using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using MemeApp.API.Data;
using MemeApp.API.Dtos;
using MemeApp.API.Helpers;
using MemeApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MemeApp.API.Controllers
{
    [ServiceFilter(typeof(LogUserActivity))]
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IMemeHubRepository repo;
        private readonly IMapper mapper;
        public UsersController(IMemeHubRepository repo, IMapper mapper)
        {
            this.mapper = mapper;
            this.repo = repo;

        }

        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var users = await repo.GetUsers();

            var usersToReturn = mapper.Map<IEnumerable<UserForListDto>>(users);

            return Ok(usersToReturn);
        }

        [HttpGet("{id}", Name = "GetUser")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await repo.GetUser(id);

            var userToReturn = mapper.Map<UserForDetailedDto>(user);

            return Ok(userToReturn);
        }

        [HttpGet("username/{username}")]
        public async Task<IActionResult> GetUserByString(string username)
        {
            var user = await repo.GetUser(username);

            var userToReturn = mapper.Map<UserForDetailedDto>(user);

            return Ok(userToReturn);
        }

        [HttpGet("feed/{username}")]
        public async Task<IActionResult> GetFeed(string username)
        {
            var user = await repo.GetUser(username);

            var posts = repo.GetFeed(user);

            return Ok(posts.Result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UserForEditDto userForEdit) {
            if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)) {
                return Unauthorized();
            }

            var userFromRepo = await repo.GetUser(id);

            mapper.Map(userForEdit, userFromRepo);

            if (await repo.SaveAll()) {
                return NoContent();
            }

            throw new Exception($"Updating user {id} failed on save.");
        }

        [HttpPost("post/like")]
        public async Task<IActionResult> LikePost(string username,string userWhoLiked, 
            int postId, bool unLike) {
            var user = await repo.GetUser(username);
            var userLiker = await repo.GetUser(userWhoLiked);
            Post postToReturn = new Post();
            foreach(var post in user.Posts) {
                if(post.Id == postId) {
                    if (unLike) {
                        post.Likes --;
                    } else {
                        post.Likes++;
                    }
                    postToReturn = post;
                    var liker = new Liker {
                        Username = userWhoLiked,
                        LikerId = userLiker.Id,
                        Post = post,
                        PostId = postId
                    };
                    post.Likers.Add(liker);
                }
            }
            await repo.SaveAll();

            var postDto = mapper.Map<PostForDetailedDto>(postToReturn);

            return Ok(postDto);
        }

    }
}