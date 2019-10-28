using System;
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
        private readonly IMemeHubRepository repo;
        private readonly IMapper mapper;
        private readonly IOptions<CloudinarySettings> cloudinaryConfig;
        private Cloudinary cloudinary;

        public PostsController(IMemeHubRepository repo,
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

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePost(int id, int userId) {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)) {
                return Unauthorized();
            }
            var userFromRepo = await repo.GetUser(userId);
            if (!userFromRepo.Posts.Any()) {
                return Unauthorized();
            }
            var post = await repo.GetPost(id);
            if (post.PublicId != null) {
                 var deleteParams = new DeletionParams(post.PublicId);
                var result = cloudinary.Destroy(deleteParams);
                if (result.Result == "ok") {
                repo.Delete(post);
                }
            }
            if (post.PublicId == null) {
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

            mapper.Map(postForUpdate, post);

            if (await repo.SaveAll()) {
                return NoContent();
            }

            return BadRequest();

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

            userFromRepo.PhotoUrl = uploadResult.Uri.ToString();
            userFromRepo.PublicIdForPhoto = uploadResult.PublicId;

            if (await repo.SaveAll()) {
                return CreatedAtRoute("GetUser", new {id = userFromRepo.Id}, userFromRepo);
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
                        Transformation = new Transformation().Width(1080).Height(1080).Crop("fill").Gravity("face")
                    };
                    uploadResult = cloudinary.Upload(uploadParams);
                }
            }

            postForCreation.Url = uploadResult.Uri.ToString();
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