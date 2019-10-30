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

        [HttpGet("feed/{username}/{index}")]
        public async Task<IActionResult> GetFeed(string username, int index)
        {
            try {
                var user = await repo.GetUser(username);

                var post = repo.GetFeed(user, index);

                return Ok(post.Result);
            } catch {
                return BadRequest();
            }

        }

        [HttpGet("followers/{username}")]
        public async Task<IActionResult> GetFollowers(string username)
        {

            var user = await repo.GetUser(username);

            var followers = new List<UserForDetailedDto>();
            foreach (var follow in user.Followers)
            {
                var follower = await repo.GetUser(follow.FollowerId);
                var userToReturn = mapper.Map<UserForDetailedDto>(follower);
                followers.Add(userToReturn);
            }

            return Ok(followers);

        }

        [HttpGet("following/{username}")]
        public async Task<IActionResult> GetFollowing(string username)
        {

            var user = await repo.GetUser(username);

            var following = new List<UserForDetailedDto>();
            foreach (var follow in user.Following)
            {
                var followee = await repo.GetUser(follow.FolloweeId);
                var userToReturn = mapper.Map<UserForDetailedDto>(followee);
                following.Add(userToReturn);
            }

            return Ok(following);

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

        [HttpPost("{id}/follow/{recipientId}")]
        public async Task<IActionResult> FollowUser(int id, int recipientId) {
            if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)) {
                return Unauthorized();
            }
            var follow = await repo.GetFollow(id, recipientId);

            if (follow != null) {
                //unfollow
                return BadRequest("You already follow this user");
            }

            var recipient = await repo.GetUser(recipientId);
            if (recipient == null) {
                return NotFound();
            }

            var follower = await repo.GetUser(id);
            
            follow = new Follow {
                FollowerId = id,
                FolloweeId = recipientId,
                Followee = recipient,
                Follower = follower
            };

            repo.Add<Follow>(follow);

            if (await repo.SaveAll()) {
                return Ok();
            }

            return BadRequest("failed to follow user");
            
        }

        [HttpPost("{id}/unfollow/{recipientId}")]
        public async Task<IActionResult> UnfollowUser(int id, int recipientId) {
            if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)) {
                return Unauthorized();
            }
            var follow = await repo.GetFollow(id, recipientId);

            if (follow == null) {
                //unfollow
                return BadRequest("You don't follow this user");
            }

            var recipient = await repo.GetUser(recipientId);
            if (recipient == null) {
                return NotFound();
            }

            repo.Delete(follow);

            if (await repo.SaveAll()) {
                return Ok();
            }

            return BadRequest("failed to follow user");
            
        }


    }
}