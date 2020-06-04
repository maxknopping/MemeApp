using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Floxdc.ExponentServerSdk;
using Floxdc.ExponentServerSdk.Enums;
using MemeApp.API.Data;
using MemeApp.API.Dtos;
using MemeApp.API.Helpers;
using MemeApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace MemeApp.API.Controllers
{

    [ApiController]
    [Authorize]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly IMemeClubRepository repo;
        private readonly IMapper mapper;
        private readonly IOptions<CloudinarySettings> cloudinaryConfig;
        private Cloudinary cloudinary;

        public AdminController(IMemeClubRepository repo, IMapper mapper, IOptions<CloudinarySettings> cloudinaryConfig)
        {
            this.cloudinaryConfig = cloudinaryConfig;
            this.mapper = mapper;
            this.repo = repo;

            Account acc = new Account(
                cloudinaryConfig.Value.CloudName,
                cloudinaryConfig.Value.Key,
                cloudinaryConfig.Value.Secret
            );

            cloudinary = new Cloudinary(acc);

        }
        [HttpGet("admins/{userId}")]
        public async Task<IActionResult> GetAdminUsers(int userId)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)) {
                return Unauthorized();
            }
            var user = await repo.GetUser(userId);

            if (!user.IsAdmin)
            {
                return Unauthorized();
            }
            var users = await repo.getAdminUsers();

            var usersToReturn = mapper.Map<List<UserForListDto>>(users);

            return Ok(usersToReturn);
        }

        [HttpGet("reported/{userId}")]
        public async Task<IActionResult> GetReportedPosts(int userId)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)) {
                return Unauthorized();
            }
            var user = await repo.GetUser(userId);

            if (!user.IsAdmin)
            {
                return Unauthorized();
            }
            var posts = await repo.getReportedPosts();

            var postsToReturn = mapper.Map<List<PostForDetailedDto>>(posts);

            return Ok(postsToReturn);
        }

        [HttpPost("{userId}/unReport/post/{postId}")]
        public async Task<IActionResult> UnReportPost(int userId, int postId)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)) {
                return Unauthorized();
            }
            var user = await repo.GetUser(userId);
            if (!user.IsAdmin) {
                return Unauthorized();
            }

            var post = await repo.GetPost(postId);
            post.isReported = false;
            await repo.SaveAll();
            return Ok();
        }

        [HttpPost("{userId}/unReport/user/{reportedId}")]
        public async Task<IActionResult> UnReportUser(int userId, int reportedId)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)) {
                return Unauthorized();
            }
            var admin = await repo.GetUser(userId);
            if (!admin.IsAdmin) {
                return Unauthorized();
            }
            var user = await repo.GetUser(reportedId);
            user.IsReported = false;
            await repo.SaveAll();
            return Ok();
        }

        [HttpGet("reportedUsers/{userId}")]
        public async Task<IActionResult> GetReportedUsers(int userId)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)) {
                return Unauthorized();
            }
            var user = await repo.GetUser(userId);

            if (!user.IsAdmin)
            {
                return Unauthorized();
            }
            var users = await repo.getReportedUsers();

            var usersToReturn = mapper.Map<List<UserForReportDto>>(users);

            return Ok(usersToReturn);
        }

        [HttpPost("editRoles/{userId}/userToEdit/{id}")]
        public async Task<IActionResult> EditRoles(int id, int userId, RoleEditDto rolesToEdit)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)) {
                return Unauthorized();
            }
            var user = await repo.GetUser(userId);

            if (!user.IsAdmin)
            {
                return Unauthorized();
            }

            var userToEdit = await repo.GetUser(id);

            if (rolesToEdit.RolesToAdd.Contains("Admin"))
            {
                userToEdit.IsAdmin = true;
            }
            if (rolesToEdit.RolesToRemove.Contains("Admin"))
            {
                userToEdit.IsAdmin = false;
            }

            await repo.SaveAll();


            return NoContent();

        }

        [HttpPost("ban/{userId}/userToBan/{id}")]
        public async Task<IActionResult> BanUser(int id, int userId, BanDto ban)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)) {
                return Unauthorized();
            }
            var user = await repo.GetUser(userId);

            if (!user.IsAdmin)
            {
                return Unauthorized();
            }

            var userToBan = await repo.GetUser(id);

            var now = DateTime.Now;

            var banDate = now.AddDays(ban.Days);

            userToBan.IsBanned = true;
            userToBan.BanEnds = banDate;
            userToBan.IsReported = false;

            if (await repo.SaveAll()) {
                return Ok();
            } else {
                return BadRequest();
            }
        }

        [HttpPut("{userId}/update/{id}")]
        public async Task<IActionResult> UpdateUser(int id, int userId, UserForAdminEditDto userForEdit)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)) {
                return Unauthorized();
            }
            var admin = await repo.GetUser(userId);

            if (!admin.IsAdmin) {
                return Unauthorized();
            }


            var userFromRepo = await repo.GetUser(id);

            if (userForEdit.RemoveProfilePicture)
            {
                if (userFromRepo.PublicIdForPhoto != null)
                {
                    var deleteParams = new DeletionParams(userFromRepo.PublicIdForPhoto);
                    var result = cloudinary.Destroy(deleteParams);
                    if (result.Result == "ok")
                    {
                        userFromRepo.PhotoUrl = null;
                    }
                } else {
                    userFromRepo.PhotoUrl = null;
                }
            }

            if (userForEdit.RemoveBio) {
                userFromRepo.Bio = null;
            }

            if (userForEdit.RemoveName) {
                userFromRepo.Name = null;
            }

            if (await repo.SaveAll())
            {
                var notification = new Notification("updateUser")
                {
                    RecipientId = id,
                    CauserId = userId
                };

                repo.Add<Notification>(notification);



                if (await repo.SaveAll()) {
                    var notificationCount = await repo.HasNewNotifications(id);

                    if (userFromRepo.PushToken != null) {
                        var client = new PushClient();
                        var pushNotification = new PushMessage(userFromRepo.PushToken, 
                            data: new {type = "updateUser"},
                            title: "MemeClub", 
                            body: $"{notification.Message}", 
                            sound: PushSounds.Default, 
                            badge: notificationCount,
                            displayInForeground: true
                        );

                        try
                        {
                            await client.Publish(pushNotification);
                        }
                        catch (Exception ex)
                        {
                            Console.WriteLine(ex.Message);
                        }
                    }
                }
                return NoContent();
            }

            return BadRequest("No changes were made.");
        }
    }
}