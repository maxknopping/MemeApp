using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using MemeApp.API.Data;
using MemeApp.API.Dtos;
using MemeApp.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.Net.Mail;
using Microsoft.AspNetCore.Authorization;
using System.Linq;
using Floxdc.ExponentServerSdk;

namespace MemeApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepository _repo;
        private readonly IConfiguration _configuration;
        private readonly IMapper mapper;
        private readonly IMemeClubRepository userRepo;

        private readonly Random random;
        public AuthController(IAuthRepository repo, IMemeClubRepository userRepo, IConfiguration _configuration, IMapper mapper)
        {
            this.userRepo = userRepo;
            this.mapper = mapper;
            this._configuration = _configuration;
            this._repo = repo;
            this.random = new Random();

        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserForRegisterDto userForRegister)
        {
            //validate request

            userForRegister.Username = userForRegister.Username.ToLower();
            if (await _repo.UserExists(userForRegister.Username))
            {
                return BadRequest("Username taken.");
            }

            var userToCreate = mapper.Map<User>(userForRegister);

            var createdUser = await _repo.Register(userToCreate, userForRegister.Password);

            var userToReturn = mapper.Map<UserForDetailedDto>(createdUser);

            MailMessage welcomeEmail = new MailMessage();

            welcomeEmail.From = new MailAddress("no-reply@memeclub.co", "MemeClub Team");
            welcomeEmail.To.Add(userForRegister.Email);
            welcomeEmail.Subject = "Welcome to MemeClub";
            welcomeEmail.Body = $"Welcome to MemeClub!\n\nThank you for creating your account. Your username is {userForRegister.Username}. To get started, follow some meme pages or click on the featured tab. If you wish to compete for the title of best meme, visit the Joust Page. Here, you can enter memes to go head-to-head with other memes. We hope you find some quality memes on our app.\n\nSincerly,\nThe MemeClub Team";
            welcomeEmail.IsBodyHtml = false;
            SmtpClient smtp = new SmtpClient()
            {
                Host = "smtp.gmail.com",
                Port = 587,
                EnableSsl = true,
                DeliveryMethod = SmtpDeliveryMethod.Network,
                UseDefaultCredentials = false,
                Credentials = new System.Net.NetworkCredential("no-reply@memeclub.co", "memeclub6969")

            };

            try
            {
                smtp.Send(welcomeEmail);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            var message = new Message{
                RecipientId = createdUser.Id,
                SenderId = 11,
                Content = "Hi! Welcome to MemeClub. Message me if you find any bugs or have any feedback about the app.",
                MessageSent = DateTime.Now
            };

            var notification = new Notification("message")
            {
                RecipientId = message.RecipientId,
                CauserId = 11
            };

            userRepo.Add(notification);
            userRepo.Add(message);
            await userRepo.SaveAll();

            return CreatedAtRoute("GetUser", new { controller = "Users", id = createdUser.Id }, userToReturn);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(UserForLoginDto userForLogin)
        {
            var userFromRepo = await _repo.Login(userForLogin.Username.ToLower(), userForLogin.Password);

            if (userFromRepo == null)
            {
                return Unauthorized();
            }

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, userFromRepo.Id.ToString()),
                new Claim(ClaimTypes.Name, userFromRepo.Username)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.
                GetBytes(_configuration.GetSection("AppSettings:Token").Value));

            var cred = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = cred
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            if (userFromRepo.IsBanned) {
                if (userFromRepo.BanEnds.CompareTo(DateTime.Now) <= 0) {
                    userFromRepo.IsBanned = false;
                    await userRepo.SaveAll();
                }
            }

            var user = mapper.Map<UserForListDto>(userFromRepo);

            return Ok(new
            {
                token = tokenHandler.WriteToken(token),
                user,
                pushToken = userFromRepo.PushToken

            });

        }

        [Authorize]
        [HttpPut("changePassword")]
        public async Task<IActionResult> ChangePassword(UserForPasswordChangeDto userForLogin)
        {
            var userFromRepo = await _repo.Login(userForLogin.Username.ToLower(), userForLogin.CurrentPassword);

            if (userFromRepo == null)
            {
                return BadRequest("Incorrect Password");
            }

            if (await _repo.ChangePassword(userFromRepo, userForLogin.NewPassword))
            {
                return Ok();
            }

            return BadRequest("The passwords are the same");

        }

        [HttpPost("forgotUsername/{email}")]
        public async Task<IActionResult> ForgotUsername(string email)
        {
            var users = await _repo.GetUsersByEmail(email);

            if (users.Count == 0)
            {
                return BadRequest("This email address is not asscoiated with an account.");
            }

            string emails = "";
            foreach (var user in users)
            {
                emails += $"{user.Username}\n";
            }

            MailMessage forgotEmail = new MailMessage();

            forgotEmail.From = new MailAddress("no-reply@memeclub.co", "MemeClub Team");
            forgotEmail.To.Add(email);
            forgotEmail.Subject = "Forgot Username";
            forgotEmail.Body = $"Here are all the usernames associated with this email:\n\n{emails}\n\nSincerely,\nThe MemeClub Team";
            forgotEmail.IsBodyHtml = false;
            SmtpClient smtp = new SmtpClient()
            {
                Host = "smtp.gmail.com",
                Port = 587,
                EnableSsl = true,
                DeliveryMethod = SmtpDeliveryMethod.Network,
                UseDefaultCredentials = false,
                Credentials = new System.Net.NetworkCredential("no-reply@memeclub.co", "memeclub6969")

            };

            try
            {
                smtp.Send(forgotEmail);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }

            return Ok();

        }

        [HttpPost("forgotPassword/{username}")]
        public async Task<IActionResult> forgotPassword(string username)
        {
            var user = await userRepo.GetUser(username);

            if (user == null)
            {
                return BadRequest("Username doesn't exist");
            }

            var newPassword = RandomString(8);

            await _repo.ChangePassword(user, newPassword);

            MailMessage forgotEmail = new MailMessage();

            forgotEmail.From = new MailAddress("no-reply@memeclub.co", "MemeClub Team");
            forgotEmail.To.Add(user.Email);
            forgotEmail.Subject = "Forgot Password";
            forgotEmail.Body = $"Your temporary password for user {username} is:\n\n{newPassword}\n\n-The MemeClub Team";
            forgotEmail.IsBodyHtml = false;
            SmtpClient smtp = new SmtpClient()
            {
                Host = "smtp.gmail.com",
                Port = 587,
                EnableSsl = true,
                DeliveryMethod = SmtpDeliveryMethod.Network,
                UseDefaultCredentials = false,
                Credentials = new System.Net.NetworkCredential("no-reply@memeclub.co", "memeclub6969")

            };

            try
            {
                smtp.Send(forgotEmail);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }

            return Ok(new {
                email = user.Email
            });

        }

        public string RandomString(int length)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            return new string(Enumerable.Repeat(chars, length)
                .Select(s => s[this.random.Next(s.Length)]).ToArray());
        }

        [HttpPut("changeTempPassword")]
        public async Task<IActionResult> ChangeTempPassword(UserForPasswordChangeDto userForLogin)
        {
            var userFromRepo = await _repo.Login(userForLogin.Username.ToLower(), userForLogin.CurrentPassword);

            if (userFromRepo == null)
            {
                return BadRequest("Incorrect Temporary Password.");
            }

            if (await _repo.ChangePassword(userFromRepo, userForLogin.NewPassword))
            {
                return Ok();
            }

            return BadRequest();

        }

        [HttpPost("pushToken/{id}")]
        public async Task<IActionResult> SetPushToken(int id, PushTokenDto push) {
            var user = await userRepo.GetUser(id);

            user.PushToken = push.PushToken;


            if (await userRepo.SaveAll()) {
                return Ok();
            }

            return BadRequest();

        }

        [HttpGet("post/{postId}")]
        public async Task<IActionResult> GetPost(int postId)
        {
            var user = await userRepo.GetPost(postId);

            var userToReturn = mapper.Map<PostForDetailedDto>(user);

            return Ok(userToReturn);
        }




    }
}