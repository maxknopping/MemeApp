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

                var post = await repo.GetFeed(user, index);

                return Ok(post);
            } catch {
                return BadRequest();
            }

        }

        [HttpGet("featured/{index}")]
        public async Task<IActionResult> GetFeatured(int index)
        {
            try {

                var post = await repo.GetFeatured(index);

                return Ok(post);
            } catch {
                return BadRequest();
            }

        }

        [HttpGet("followers/{username}")]
        public async Task<IActionResult> GetFollowers(string username)
        {

            var user = await repo.GetUser(username);

            var followers = new List<UserForListDto>();
            foreach (var follow in user.Followers)
            {
                var follower = await repo.GetUser(follow.FollowerId);
                var userToReturn = mapper.Map<UserForListDto>(follower);
                followers.Add(userToReturn);
            }

            return Ok(followers);

        }

        [HttpGet("following/{username}")]
        public async Task<IActionResult> GetFollowing(string username)
        {

            var user = await repo.GetUser(username);

            var following = new List<UserForListDto>();
            foreach (var follow in user.Following)
            {
                var followee = await repo.GetUser(follow.FolloweeId);
                var userToReturn = mapper.Map<UserForListDto>(followee);
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
                FolloweeId = recipientId
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

        [HttpPost("{id}/like/{recipientId}")]
        public async Task<IActionResult> LikePost(int id, int recipientId) {
            if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)) {
                return Unauthorized();
            }
            var like = await repo.GetLike(id, recipientId);

            if (like != null) {
                //unfollow
                return BadRequest("You already like this post");
            }

            var recipient = await repo.GetPost(recipientId);
            if (recipient == null) {
                return NotFound();
            }

            var user = await repo.GetUser(id);
            
            like = new Like {
                LikerId = id,
                PostId = recipientId,
                Post = recipient,
                Liker = user
            };

            repo.Add<Like>(like);

            if (await repo.SaveAll()) {
                return Ok();
            }

            return BadRequest("failed to like post");
            
        }

        [HttpPost("{id}/unlike/{recipientId}")]
        public async Task<IActionResult> UnikePost(int id, int recipientId) {
            if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)) {
                return Unauthorized();
            }
            var like = await repo.GetLike(id, recipientId);

            if (like == null) {
                //follow
                return BadRequest("You don't already like this post");
            }

            var recipient = await repo.GetPost(recipientId);
            if (recipient == null) {
                return NotFound();
            }

            repo.Delete<Like>(like);

            if (await repo.SaveAll()) {
                return Ok();
            }

            return BadRequest("failed to like post");
            
        }

        [HttpGet("likers/{postId}")]
        public async Task<IActionResult> GetLikers(int postId)
        {

            var post = await repo.GetPost(postId);

            var likers = new List<UserForListDto>();
            foreach (var like in post.LikeList)
            {
                var liker = await repo.GetUser(like.LikerId);
                var userToReturn = mapper.Map<UserForListDto>(liker);
                likers.Add(userToReturn);
            }

            return Ok(likers);

        }

        [HttpPost("comment")]
        public async Task<IActionResult> PostComment(CommentForCreationDto comment) {
            if (comment.CommenterId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)) {
                return Unauthorized();
            }

            var recipient = await repo.GetPost(comment.PostId);
            if (recipient == null) {
                return NotFound();
            }

            var fullComment = mapper.Map<Comment>(comment);
            fullComment.Created = DateTime.Now;
            recipient.Comments.Add(fullComment);

            if(await repo.SaveAll()) {
                return Ok();
            }

            return BadRequest("failed to make comment");

        }

        [HttpGet("comments/{postId}")]
        public async Task<IActionResult> GetComments(int postId)
        {

            var post = repo.GetComments(postId);

            var comments = new List<CommentForListDto>();
            foreach (var comment in post)
            {
                var commenter = await repo.GetUser(comment.CommenterId);
                var commentToReturn = mapper.Map<CommentForListDto>(comment);
                var likes = new List<CommentLikeDto>();
                foreach(var like in comment.LikeList) {
                    var newLike = mapper.Map<CommentLikeDto>(like);
                    likes.Add(newLike);
                }
                commentToReturn.LikeList = likes;
                commentToReturn.PhotoUrl = commenter.PhotoUrl;
                commentToReturn.Username = commenter.Username;
                comments.Add(commentToReturn);
            }

            comments = comments.SortComments();

            return Ok(comments);

        }

        [HttpPost("{id}/comment/like/{recipientId}/{postId}")]
        public async Task<IActionResult> LikeComment(int id, int recipientId, int postId) {
            if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)) {
                return Unauthorized();
            }
            var like = await repo.GetCommentLike(id, recipientId);

            if (like != null) {
                //unfollow
                return BadRequest("You already like this post");
            }

            var recipient = await repo.GetComment(recipientId);
            var post = await repo.GetPost(postId);
            if (recipient == null || post == null) {
                return NotFound();
            }

            var user = await repo.GetUser(id);
            
            like = new CommentLike {
                CommenterId = id,
                CommentId = recipientId,
                PostId = postId,
                Post = post,
                Comment = recipient,
                Commenter = user
            };

            repo.Add<CommentLike>(like);

            if (await repo.SaveAll()) {
                return Ok();
            }

            return BadRequest("failed to like comment");
            
        }

        [HttpPost("{id}/comment/unlike/{recipientId}/{postId}")]
        public async Task<IActionResult> UnLikeComment(int id, int recipientId, int postId) {
            if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)) {
                return Unauthorized();
            }
            var like = await repo.GetCommentLike(id, recipientId);

            if (like == null) {
                //unfollow
                return BadRequest("You don't already like this post");
            }

            var recipient = await repo.GetComment(recipientId);
            var post = await repo.GetPost(postId);
            if (recipient == null || post == null) {
                return NotFound();
            }


            repo.Delete<CommentLike>(like);

            if (await repo.SaveAll()) {
                return Ok();
            }

            return BadRequest("failed to unlike comment");
            
        }

        [HttpGet("commentLikers/{commentId}")]
        public async Task<IActionResult> GetCommentLikers(int commentId)
        {

            var comment = await repo.GetComment(commentId);

            var likers = new List<UserForListDto>();
            foreach (var like in comment.LikeList)
            {
                var liker = await repo.GetUser(like.CommenterId);
                var userToReturn = mapper.Map<UserForListDto>(liker);
                likers.Add(userToReturn);
            }

            return Ok(likers);

        }

        [HttpDelete("{commentId}/deleteComment")]
        public async Task<IActionResult> DeleteComment(int commentId) {
            var comment = await repo.GetComment(commentId);

            if (comment == null) {
                //follow
                return BadRequest("This comment doesn't exist");
            }

            foreach(var like in comment.LikeList) {
                repo.Delete<CommentLike>(like);
            }
            repo.Delete<Comment>(comment);

            if (await repo.SaveAll()) {
                return Ok();
            }

            return BadRequest("failed to delete comment");
            
        }


    }
}