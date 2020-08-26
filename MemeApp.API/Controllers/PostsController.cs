using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using MemeApp.API.Data;
using MemeApp.API.Dtos;
using MemeApp.API.Helpers;
using MemeApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace MemeApp.API.Controllers
{
    [Authorize]
    [Route("api/users/{userId}/posts")]
    [ApiController]
    public class PostsController : ControllerBase
    {
        private readonly IMemeClubRepository repo;
        private readonly IMapper mapper;
        private readonly IOptions<CloudinarySettings> cloudinaryConfig;
        private Cloudinary cloudinary;

        public PostsController(IMemeClubRepository repo,
                              IMapper mapper,
                              IOptions<CloudinarySettings> cloudinaryConfig)
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

        [HttpGet("{id}", Name = "GetPost")]
        public async Task<IActionResult> GetPost(int id) {
            var photo = await repo.GetPost(id);
            var photoToReturn = mapper.Map<PostForDetailedDto>(photo);

            return Ok(photoToReturn);
        }

        [HttpGet("{id}/watermark")]
        public async Task<IActionResult> AddWatermarkToPost(int id) {
            var photo = await repo.GetPost(id);
            byte[] imageData = null;
            using (var wc = new System.Net.WebClient()) {
                imageData = wc.DownloadData(photo.Url);
            }

            var stream = new MemoryStream(imageData);

            if (imageData == null) {
                return BadRequest("Could not find post");
            }

            
            MemoryStream logoStream = new MemoryStream();
            using (FileStream file = new FileStream("Controllers/MemeClub.png", FileMode.Open, FileAccess.Read)) {
                byte[] bytes = new byte[file.Length];
                file.Read(bytes, 0, Convert.ToInt32(file.Length));
                file.CopyTo(logoStream);
            }

            var mainImage = new Bitmap(stream);
            var logo = new Bitmap(logoStream);
            //Image mainImage = Image.FromStream(stream, false, true);
            //Image logo = Image.FromStream(logoStream, false, true);

            var markedImage = new MemoryStream();
            using (Graphics g = Graphics.FromImage(mainImage)) {
                g.DrawImage(logo, new System.Drawing.Point(mainImage.Size.Width - logo.Size.Width - 10, mainImage.Size.Height - logo.Size.Height - 10));
                mainImage.Save(markedImage, ImageFormat.Png);
            }

            var markedBytes = markedImage.ToArray();

            var base64 = Convert.ToBase64String(markedBytes);


            return Ok(base64);

        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePost(int id, int userId) {
            var user = await repo.GetUser(userId);
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value) && !user.IsAdmin) {
                return Unauthorized();
            }
            var userFromRepo = await repo.GetUser(userId);
            if (!userFromRepo.Posts.Any() || !userFromRepo.IsAdmin) {
                return Unauthorized();
            }
            var post = await repo.GetPost(id);
            if (post.PublicId != null) {
                 var deleteParams = new DeletionParams(post.PublicId);
                var result = cloudinary.Destroy(deleteParams);
                if (result.Result == "ok") {
                foreach(var comment in post.Comments) {
                    var fullComment = await repo.GetComment(comment.Id);
                    foreach(var like in fullComment.LikeList) {
                    repo.Delete<CommentLike>(like);
                    }
                    repo.Delete<Comment>(comment);
                }

                foreach(var like in post.LikeList) {
                    repo.Delete<Like>(like);
                }
                foreach(var notification in post.Notifications) {
                    repo.Delete<Notification>(notification);
                }
                foreach( var message in post.MessagesSent) {
                    repo.Delete<Message>(message);
                }

                repo.Delete(post);
                }
            }
            if (post.PublicId == null) {
                foreach(var comment in post.Comments) {
                    var fullComment = await repo.GetComment(comment.Id);
                    foreach(var like in fullComment.LikeList) {
                    repo.Delete<CommentLike>(like);
                }
                repo.Delete<Comment>(comment);
                }

                foreach(var like in post.LikeList) {
                    repo.Delete<Like>(like);
                }
                foreach(var notification in post.Notifications) {
                    repo.Delete<Notification>(notification);
                }
                foreach( var message in post.MessagesSent) {
                    repo.Delete<Message>(message);
                }
                repo.Delete(post);
            }
            if (await repo.SaveAll()) {
                return Ok();
            }
            return BadRequest();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePost(int id, int userId, PostForUpdateDto postForUpdate) {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)) {
                return Unauthorized();
            }
            var post = await repo.GetPost(id);

            if (postForUpdate.InJoust) {
                post.JoustRating = 1000;
            }

            mapper.Map(postForUpdate, post);

            if (await repo.SaveAll()) {
                return NoContent();
            }

            return BadRequest();

        }

        [HttpPost("report/{postId}")]
        public async Task<IActionResult> ReportUser(int userId, int postId)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)) {
                return Unauthorized();
            }

            var post = await repo.GetPost(postId);
            post.isReported = true;
            post.User.ReportedPostCount++;
            await repo.SaveAll();
            return Ok();
        }


        [HttpPost("profilePicture")]
        public async Task<IActionResult> AddProfilePictureForUser(int userId, [FromForm]PostForCreationDto postForCreation) {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)) {
                return Unauthorized();
            }

            var userFromRepo = await repo.GetUser(userId);

            var file = postForCreation.File;

            var uploadResult = new ImageUploadResult();

            if (file.Length > 0) {
                using (var stream = file.OpenReadStream()) {
                    var uploadParams = new ImageUploadParams() {
                        File = new FileDescription(file.Name, stream),
                        Transformation = new Transformation().Width(1080).Height(1080).Crop("fill").Gravity("face")
                    };
                    uploadResult = cloudinary.Upload(uploadParams);
                }
            }

            userFromRepo.PhotoUrl = uploadResult.Uri.ToString().Replace("http", "https");
            userFromRepo.PublicIdForPhoto = uploadResult.PublicId;

            foreach (var group in userFromRepo.UserGroups) {
                group.UserPhotoUrl = userFromRepo.PhotoUrl;
            }


            if (await repo.SaveAll()) {
                return CreatedAtRoute("GetUser", new {id = userFromRepo.Id}, userFromRepo);
            }

            return BadRequest("Could not add the photo");
        }

        [HttpPost("profilePicture/ios")]
        public async Task<IActionResult> AddProfilePictureForUserIos(int userId, PostForCreationIosDto postForCreation) {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)) {
                return Unauthorized();
            }

            var userFromRepo = await repo.GetUser(userId);
            byte[] data = System.Convert.FromBase64String(postForCreation.File);
            var stream = new MemoryStream(data);
            var uploadResult = new ImageUploadResult();

            if (data.Length > 0) {
                var uploadParams = new ImageUploadParams() {
                    File = new FileDescription("New Post", stream),
                    Transformation = new Transformation().Width(1080).Height(1080).Crop("pad").Radius("max")
                };
                uploadResult = cloudinary.Upload(uploadParams);
            }

            userFromRepo.PhotoUrl = uploadResult.Uri.ToString().Replace("http", "https");
            userFromRepo.PublicIdForPhoto = uploadResult.PublicId;

            if (await repo.SaveAll()) {
                return CreatedAtRoute("GetPost", new {id = userFromRepo.Id}, userFromRepo);
            }

            return BadRequest("Could not add the photo");
        }

        [HttpPost("ios")]
        public async Task<IActionResult> AddPostForUserIos(int userId, PostForCreationIosDto postForCreation) {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)) {
                return Unauthorized();
            }

            var userFromRepo = await repo.GetUser(userId);
            byte[] data = System.Convert.FromBase64String(postForCreation.File);
            var stream = new MemoryStream(data);
            var uploadResult = new ImageUploadResult();

            if (data.Length > 0) {
                var uploadParams = new ImageUploadParams() {
                    File = new FileDescription("New Post", stream),
                    Transformation = new Transformation().Width(1080).Height(1080).Crop("pad")
                };
                uploadResult = cloudinary.Upload(uploadParams);
            }

            var postTemp = new PostForCreationDto();

            postTemp.Url = uploadResult.Uri.ToString().Replace("http", "https");
            postTemp.PublicId = uploadResult.PublicId;
            postTemp.Caption = postForCreation.Caption;
            postTemp.InJoust = postForCreation.InJoust;
            postTemp.JoustRating = 1000;


            var post = mapper.Map<Post>(postTemp);
            post.Created = DateTime.Now;
            userFromRepo.Posts.Add(post);

            if (await repo.SaveAll()) {
                var postToReturn = mapper.Map<PostForDetailedDto>(post);
                return CreatedAtRoute("GetPost", new {id = post.Id}, postToReturn);
            }

            return BadRequest("Could not add the photo");
        }

        [HttpPost]
        public async Task<IActionResult> AddPostForUser(int userId, [FromForm]PostForCreationDto postForCreation) {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)) {
                return Unauthorized();
            }

            var userFromRepo = await repo.GetUser(userId);

            var file = postForCreation.File;

            var uploadResult = new ImageUploadResult();

            if (file.Length > 0) {
                using (var stream = file.OpenReadStream()) {
                    var uploadParams = new ImageUploadParams() {
                        File = new FileDescription(file.Name, stream),
                        Transformation = new Transformation().Width(1080).Height(1080).Crop("pad")
                    };
                    uploadResult = cloudinary.Upload(uploadParams);
                }
            }

            postForCreation.Url = uploadResult.Uri.ToString().Replace("http", "https");
            postForCreation.PublicId = uploadResult.PublicId;

            var post = mapper.Map<Post>(postForCreation);
            post.Created = DateTime.Now;
            userFromRepo.Posts.Add(post);

            if (await repo.SaveAll()) {
                var postToReturn = mapper.Map<PostForDetailedDto>(post);
                return CreatedAtRoute("GetPost", new {id = post.Id}, postToReturn);
            }

            return BadRequest("Could not add the photo");
        }

    }

    
}