using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using Floxdc.ExponentServerSdk;
using Floxdc.ExponentServerSdk.Enums;
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
        private readonly IMemeClubRepository repo;
        private readonly IMapper mapper;
        public UsersController(IMemeClubRepository repo, IMapper mapper)
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

        [HttpGet("username/{username}/{index}")]
        public async Task<IActionResult> GetPostForProfile(string username, int index) {
            var user = await repo.GetUser(username);
            var userToReturn = mapper.Map<UserForDetailedDto>(user);

            if (user.Posts.Count == 0) {
                return BadRequest();
            }
            try {
            return Ok(userToReturn.Posts[index]);
            } catch {
                return BadRequest();
            }
        }

        [HttpGet("post/{postId}")]
        public async Task<IActionResult> GetPost(int postId)
        {
            var user = await repo.GetPost(postId);

            var userToReturn = mapper.Map<PostForDetailedDto>(user);

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
                var id = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
                var post = await repo.GetFeatured(id, index);

                return Ok(post);
            } catch {
                return BadRequest();
            }

        }

        [HttpGet("{userId}/followers/{username}")]
        public async Task<IActionResult> GetFollowers( int userId, string username)
        {

            var user = await repo.GetUser(username);

            var followers = new List<UserForListDto>();
            foreach (var follow in user.Followers)
            {
                var follower = await repo.GetUser(follow.FollowerId);
                var userToReturn = mapper.Map<UserForManipulationDto>(follower);
                userToReturn.FollowButton = "Follow";
                    if (userToReturn.Id == userId) {
                        userToReturn.FollowButton = "Myself";
                    }
                    foreach(var f in userToReturn.Followers) {
                        if (f.FollowerId == userId) {
                          userToReturn.FollowButton = "Following";
                        }
                    }
                var userWithoutFollowers = mapper.Map<UserForListDto>(userToReturn);
                followers.Add(userWithoutFollowers);

            }

            return Ok(followers);

        }

        [HttpGet("{userId}/following/{username}")]
        public async Task<IActionResult> GetFollowing(string username, int userId)
        {

            var user = await repo.GetUser(username);

            var following = new List<UserForListDto>();
            foreach (var follow in user.Following)
            {
                var followee = await repo.GetUser(follow.FolloweeId);
                var userToReturn = mapper.Map<UserForManipulationDto>(followee);
                userToReturn.FollowButton = "Follow";
                    if (userToReturn.Id == userId) {
                        userToReturn.FollowButton = "Myself";
                    }
                    foreach(var f in userToReturn.Followers) {
                        if (f.FollowerId == userId) {
                          userToReturn.FollowButton = "Following";
                        }
                    }
                var userWithoutFollowers = mapper.Map<UserForListDto>(userToReturn);
                following.Add(userWithoutFollowers);
            }

            return Ok(following);

        }

        [HttpGet("{userId}/group/{groupId}")]
        public async Task<IActionResult> GetUsersInGroup(int groupId, int userId)
        {

            var group = await repo.GetGroup(groupId);

            var users = new List<UserForListDto>();
            foreach (var userGroup in group.UserGroups)
            {
                var user = await repo.GetUser(userGroup.UserId);
                var userToReturn = mapper.Map<UserForManipulationDto>(user);
                userToReturn.FollowButton = "Follow";
                    if (userToReturn.Id == userId) {
                        userToReturn.FollowButton = "Myself";
                    }
                    foreach(var f in userToReturn.Followers) {
                        if (f.FollowerId == userId) {
                          userToReturn.FollowButton = "Following";
                        }
                    }
                var userWithoutFollowers = mapper.Map<UserForListDto>(userToReturn);
                users.Add(userWithoutFollowers);
            }

            return Ok(users);

        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UserForEditDto userForEdit) {
            if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)) {
                return Unauthorized();
            }

            var existingUser = await repo.GetUser(userForEdit.Username);
            var userFromRepo = await repo.GetUser(id);

            if (existingUser != null && userForEdit.Username != userFromRepo.Username) {
                return BadRequest("Useranme is taken.");
            }
            userForEdit.Username = userForEdit.Username.ToLower();

            mapper.Map(userForEdit, userFromRepo);

            if (await repo.SaveAll()) {
                return NoContent();
            }

            return BadRequest("No changes were made.");
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
            var notification = new Notification("follow")
            {
                RecipientId = recipientId,
                CauserId = id
            };

            repo.Add<Notification>(notification);



            if (await repo.SaveAll()) {
                var notificationCount = await repo.HasNewNotifications(recipient.Id);

                if (recipient.PushToken != null) {
                    var client = new PushClient();
                    var pushNotification = new PushMessage(recipient.PushToken, 
                        data: new {type = "follow"},
                        title: "MemeClub", 
                        body: $"@{follower.Username} {notification.Message}", 
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

            var notification = new Notification("like")
            {
                RecipientId = recipient.UserId,
                CauserId = id,
                PostId = recipient.Id
            };

            repo.Add<Notification>(notification);

            var notificationCount = await repo.HasNewNotifications(id);


            var userRecipient = await repo.GetUser(recipient.UserId);

            if (userRecipient.PushToken != null) {
                var client = new PushClient();
                var pushNotification = new PushMessage(userRecipient.PushToken, 
                    data: new {type = "like"},
                    title: "MemeClub", 
                    body: $"@{user.Username} {notification.Message}", 
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

        [HttpPost("{userId}/report")]
        public async Task<IActionResult> ReportUser(int userId)
        {
            var user = await repo.GetUser(userId);
            user.IsReported = true;
            user.ReportedCount++;
            await repo.SaveAll();
            return Ok();
        }

        [HttpGet("{userId}/likers/{postId}")]
        public async Task<IActionResult> GetLikers(int postId, int userId)
        {

            var post = await repo.GetPost(postId);

            var likers = new List<UserForListDto>();
            foreach (var like in post.LikeList)
            {
                var liker = await repo.GetUser(like.LikerId);
                var userToReturn = mapper.Map<UserForManipulationDto>(liker);
                userToReturn.FollowButton = "Follow";
                    if (userToReturn.Id == userId) {
                        userToReturn.FollowButton = "Myself";
                    }
                    foreach(var f in userToReturn.Followers) {
                        if (f.FollowerId == userId) {
                          userToReturn.FollowButton = "Following";
                        }
                    }
                var userWithoutFollowers = mapper.Map<UserForListDto>(userToReturn);
                likers.Add(userWithoutFollowers);
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
            repo.Add<Comment>(fullComment);


            if(await repo.SaveAll()) {
                if (recipient.UserId != comment.CommenterId) {
                    var notification = new Notification("comment")
                    {
                        RecipientId = recipient.UserId,
                        CauserId = comment.CommenterId,
                        PostId = recipient.Id,
                        CommentId = fullComment.Id
                    };
                    repo.Add(notification);
                    var notificationCount = await repo.HasNewNotifications(recipient.UserId);
                    var userRecipient = await repo.GetUser(recipient.UserId);
                    var commenter = await repo.GetUser(comment.CommenterId);

                    if (userRecipient.PushToken != null) {
                        var client = new PushClient();
                        var pushNotification = new PushMessage(userRecipient.PushToken, 
                            data: new {type = "like"},
                            title: "MemeClub", 
                            body: $"@{commenter.Username} {notification.Message}\"{notification.Comment.Text}\"", 
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
                await repo.SaveAll();
                return Ok();
            }

            return BadRequest("failed to make comment");

        }

        [HttpPost("reply")]
        public async Task<IActionResult> PostReply(ReplyForCreationDto reply) {
            if (reply.CommenterId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)) {
                return Unauthorized();
            }

            var recipient = await repo.GetPost(reply.PostId);
            if (recipient == null) {
                return NotFound();
            }

            var comment = await repo.GetComment(reply.CommentId);
            if (comment == null) {
                return NotFound();
            }

            var fullReply = mapper.Map<Reply>(reply);
            fullReply.Created = DateTime.Now;
            repo.Add<Reply>(fullReply);


            if(await repo.SaveAll()) {

                //notification for owner of post
                if (recipient.UserId != reply.CommenterId) {
                    var notification = new Notification("comment")
                    {
                        RecipientId = recipient.UserId,
                        CauserId = reply.CommenterId,
                        PostId = recipient.Id,
                        ReplyId = fullReply.Id
                    };
                    repo.Add(notification);
                    var notificationCount = await repo.HasNewNotifications(recipient.UserId);
                    var userRecipient = await repo.GetUser(recipient.UserId);
                    var commenter = await repo.GetUser(reply.CommenterId);

                    if (userRecipient.PushToken != null) {
                        var client = new PushClient();
                        var pushNotification = new PushMessage(userRecipient.PushToken, 
                            data: new {type = "reply"},
                            title: "MemeClub", 
                            body: $"@{commenter.Username} {notification.Message}\"{notification.Reply.Text}\"", 
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

                //notification for comment that is replied to
                if (comment.CommenterId != reply.CommenterId) {
                    var notification = new Notification("reply")
                    {
                        RecipientId = comment.CommenterId,
                        CauserId = reply.CommenterId,
                        PostId = recipient.Id,
                        ReplyId = fullReply.Id
                    };
                    repo.Add(notification);
                    var notificationCount = await repo.HasNewNotifications(comment.CommenterId);
                    var userRecipient = await repo.GetUser(comment.CommenterId);
                    var commenter = await repo.GetUser(reply.CommenterId);

                    if (userRecipient.PushToken != null) {
                        var client = new PushClient();
                        var pushNotification = new PushMessage(userRecipient.PushToken, 
                            data: new {type = "reply"},
                            title: "MemeClub", 
                            body: $"@{commenter.Username} {notification.Message}\"{notification.Reply.Text}\"", 
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
                await repo.SaveAll();
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

        [HttpGet("replies/{commentId}")]
        public async Task<IActionResult> GetReplies(int commentId)
        {

            var replies = repo.GetReplies(commentId);

            var repliesToReturn = new List<ReplyDto>();
            foreach (var reply in replies)
            {
                var commenter = await repo.GetUser(reply.CommenterId);
                var commentToReturn = mapper.Map<ReplyDto>(reply);
                var likes = new List<ReplyLikeDto>();
                foreach(var like in reply.LikeList) {
                    var newLike = mapper.Map<ReplyLikeDto>(like);
                    likes.Add(newLike);
                }
                commentToReturn.LikeList = likes;
                commentToReturn.PhotoUrl = commenter.PhotoUrl;
                commentToReturn.Username = commenter.Username;
                repliesToReturn.Add(commentToReturn);
            }

            repliesToReturn = repliesToReturn.SortReplies();

            return Ok(repliesToReturn);

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

            var notification = new Notification("commentLike")
            {
                RecipientId = recipient.CommenterId,
                CauserId = id,
                PostId = postId,
                CommentId = recipientId
            };

            repo.Add<Notification>(notification);

            repo.Add<CommentLike>(like);

            var liker = await repo.GetUser(id);

            if (await repo.SaveAll()) {
                if (id != recipient.CommenterId) {
                    var notificationCount = await repo.HasNewNotifications(recipient.CommenterId);
                    var userRecipient = await repo.GetUser(recipient.CommenterId);

                    if (userRecipient.PushToken != null) {
                        var client = new PushClient();
                        var pushNotification = new PushMessage(userRecipient.PushToken, 
                            data: new {type = "like"},
                            title: "MemeClub", 
                            body: $"@{liker.Username} {notification.Message}\"{notification.Comment.Text}\"", 
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

        [HttpGet("{userId}/commentLikers/{commentId}")]
        public async Task<IActionResult> GetCommentLikers(int commentId, int userId)
        {

            var comment = await repo.GetComment(commentId);

            var likers = new List<UserForListDto>();
            foreach (var like in comment.LikeList)
            {
                var liker = await repo.GetUser(like.CommenterId);
                var userToReturn = mapper.Map<UserForManipulationDto>(liker);
                userToReturn.FollowButton = "Follow";
                    if (userToReturn.Id == userId) {
                        userToReturn.FollowButton = "Myself";
                    }
                    foreach(var f in userToReturn.Followers) {
                        if (f.FollowerId == userId) {
                          userToReturn.FollowButton = "Following";
                        }
                    }
                var userWithoutFollowers = mapper.Map<UserForListDto>(userToReturn);
                likers.Add(userWithoutFollowers);
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

            foreach(var notification in comment.Notifications) {
                repo.Delete<Notification>(notification);
            }

            foreach(var reply in comment.Replies) {
                foreach(var replyLike in reply.LikeList) {
                    repo.Delete<ReplyLike>(replyLike);
                }

                foreach(var notification in reply.Notifications) {
                    repo.Delete<Notification>(notification);
                }
                repo.Delete<Reply>(reply);
            }
            
            repo.Delete<Comment>(comment);

            if (await repo.SaveAll()) {
                return Ok();
            }

            return BadRequest("failed to delete comment");
            
        }

        [HttpDelete("{replyId}/deleteReply")]
        public async Task<IActionResult> DeleteReply(int replyId) {
            var reply = await repo.GetReply(replyId);

            if (reply == null) {
                //follow
                return BadRequest("This reply doesn't exist");
            }

            foreach(var like in reply.LikeList) {
                repo.Delete<ReplyLike>(like);
            }

            foreach(var notification in reply.Notifications) {
                repo.Delete<Notification>(notification);
            }
            
            repo.Delete<Reply>(reply);

            if (await repo.SaveAll()) {
                return Ok();
            }

            return BadRequest("failed to delete reply");
            
        }

        [HttpPost("{id}/reply/like/{recipientId}/{postId}/{commentId}")]
        public async Task<IActionResult> LikeReply(int id, int recipientId, int postId, int commentId) {
            if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)) {
                return Unauthorized();
            }
            var like = await repo.GetReplyLike(id, recipientId);

            if (like != null) {
                //unfollow
                return BadRequest("You already like this post");
            }

            var recipient = await repo.GetReply(recipientId);
            var post = await repo.GetPost(postId);
            var comment = await repo.GetComment(commentId);
            if (recipient == null || post == null || comment == null) {
                return NotFound();
            }

            var user = await repo.GetUser(id);
            
            like = new ReplyLike {
                LikerId = id,
                ReplyId = recipientId,
                PostId = postId,
                Post = post,
                Reply = recipient,
                Liker = user
            };

            var notification = new Notification("commentLike")
            {
                RecipientId = recipient.CommenterId,
                CauserId = id,
                PostId = postId,
                ReplyId = recipientId
            };

            repo.Add<Notification>(notification);

            repo.Add<ReplyLike>(like);

            var liker = await repo.GetUser(id);

            if (await repo.SaveAll()) {
                if (id != recipient.CommenterId) {
                    var notificationCount = await repo.HasNewNotifications(recipient.CommenterId);
                    var userRecipient = await repo.GetUser(recipient.CommenterId);

                    if (userRecipient.PushToken != null) {
                        var client = new PushClient();
                        var pushNotification = new PushMessage(userRecipient.PushToken, 
                            data: new {type = "like"},
                            title: "MemeClub", 
                            body: $"@{liker.Username} {notification.Message}\"{notification.Reply.Text}\"", 
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
                return Ok();
            }

            return BadRequest("failed to like comment");
            
        }

        [HttpPost("{id}/reply/unlike/{recipientId}/{postId}/{commentId}")]
        public async Task<IActionResult> UnLikeReply(int id, int recipientId, int postId, int commentId) {
            if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)) {
                return Unauthorized();
            }
            var like = await repo.GetReplyLike(id, recipientId);

            if (like == null) {
                //unfollow
                return BadRequest("You don't already like this post");
            }

            var recipient = await repo.GetReply(recipientId);
            var post = await repo.GetPost(postId);
            var comment = await repo.GetComment(commentId);
            if (recipient == null || post == null || comment == null) {
                return NotFound();
            }


            repo.Delete<ReplyLike>(like);

            if (await repo.SaveAll()) {
                return Ok();
            }

            return BadRequest("failed to unlike comment");
            
        }

        [HttpGet("{userId}/replyLikers/{replyId}")]
        public async Task<IActionResult> GetReplyLikers(int replyId, int userId)
        {

            var reply = await repo.GetReply(replyId);

            var likers = new List<UserForListDto>();
            foreach (var like in reply.LikeList)
            {
                var liker = await repo.GetUser(like.LikerId);
                var userToReturn = mapper.Map<UserForManipulationDto>(liker);
                userToReturn.FollowButton = "Follow";
                    if (userToReturn.Id == userId) {
                        userToReturn.FollowButton = "Myself";
                    }
                    foreach(var f in userToReturn.Followers) {
                        if (f.FollowerId == userId) {
                          userToReturn.FollowButton = "Following";
                        }
                    }
                var userWithoutFollowers = mapper.Map<UserForListDto>(userToReturn);
                likers.Add(userWithoutFollowers);
            }

            return Ok(likers);

        }

        [HttpGet("search/{id}/{query}/{fullResult}")]
        public async Task<IActionResult> SearchForUser(int id, string query, bool fullResult) {
            var users = await repo.SearchForUser(id, query.ToLower(), fullResult);
            var usersToReturn = mapper.Map<IList<UserForManipulationDto>>(users);
            foreach(var user in usersToReturn) {
                user.FollowButton = "Follow";
                    if (user.Id == id) {
                        user.FollowButton = "Myself";
                    }
                    foreach(var follower in user.Followers)
                        if (follower.FollowerId == id) {
                          user.FollowButton = "Following";
                        }
            }
            var usersWithoutFollowers = mapper.Map<IList<UserForListDto>>(usersToReturn);
            return Ok(usersWithoutFollowers);
        }

        [HttpGet("notifications/{userId}")]
        public async Task<IActionResult> GetNotifications(int userId) {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)) {
                return Unauthorized();
            }
            var notifications = await repo.GetNotifications(userId);

            var notificationsToReturn = mapper.Map<IList<NotificationForListDto>>(notifications);

            return Ok(notificationsToReturn);
        }

        [HttpPost("notifications/{id}/read")]
        public async Task<IActionResult> MarkNotificationsAsRead(int id) {
            if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)) {
                return Unauthorized();
            }

            var notifications = await repo.GetNotifications(id);

            foreach(var notification in notifications) {
                notification.IsRead = true;
            }

            await repo.SaveAll();

            return NoContent();
        }

        [HttpGet("hasNewMessages/{id}")]
        public async Task<IActionResult> HasNewMessages(int id) {
            if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)) {
                return Unauthorized();
            }

            int count = await repo.HasNewMessages(id);

            return Ok(new {
                count = count
            });
        }

        [HttpGet("hasNewNotifications/{id}")]
        public async Task<IActionResult> HasNewNotifications(int id) {
            if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)) {
                return Unauthorized();
            }

            int count = await repo.HasNewNotifications(id);

            return Ok(new {
                count = count
            });
        }

        [HttpGet("joust/NewPosts")]
        public async Task<IActionResult> GetNewJoustPosts() {
            var posts = await repo.GetJoustPosts();

            var postToReturn = mapper.Map<IList<PostForDetailedDto>>(posts);
            return Ok(postToReturn);

        }

        [HttpGet("swipe/nextPost")]
        public async Task<IActionResult> GetNextSwipePost() {
            var post = await repo.GetSwipePost();

            var postToReturn = mapper.Map<PostForDetailedDto>(post);
            return Ok(postToReturn);

        }

        [HttpGet("joust/top/{index}")]
        public async Task<IActionResult> GetTopJoustPosts(int index) {
            var post = await repo.GetTopJoustPosts(index);

            var postToReturn = mapper.Map<PostForDetailedDto>(post);
            return Ok(postToReturn);
        }

        [HttpPost("joust/result/{winner}/{loser}")]
        public async Task<IActionResult> JoustResult(int winner, int loser) {
            await repo.JoustResult(winner, loser);

            return Ok();
        }

        [HttpPost("swipe/result/{postId}/{liked}")]
        public async Task<IActionResult> SwipeResult(int postId, bool liked) {
            await repo.SwipeResult(postId, liked);

            return Ok();
        }

        [HttpGet("blocked/{userId}")]
        public async Task<IActionResult> GetBlockedUsers(int userId) {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)) {
                return Unauthorized();
            }

            var user = await repo.GetUser(userId);

            var blockees = new List<UserForListDto>();
            foreach (var follow in user.Blockees)
            {
                var follower = await repo.GetUser(follow.BlockeeId);
                var userToReturn = mapper.Map<UserForManipulationDto>(follower);
                var userWithoutFollowers = mapper.Map<UserForListDto>(userToReturn);
                blockees.Add(userWithoutFollowers);

            }

            return Ok(blockees);

        }

        [HttpPost("{userId}/block/{recipientId}")]
        public async Task<IActionResult> BlockUser(int userId, int recipientId) {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)) {
                return Unauthorized();
            }
            var block = await repo.GetBlock(userId, recipientId);

            if (block != null) {
                //unfollow
                return BadRequest("You've already blocked this user");
            }

            var recipient = await repo.GetUser(recipientId);
            if (recipient == null) {
                return NotFound();
            }

            var follower = await repo.GetUser(userId);
            
            block = new Block {
                BlockerId = userId,
                BlockeeId = recipientId
            };

            repo.Add<Block>(block);
            try {
                var response = await UnfollowUser(userId, recipientId);
            } catch (Exception e) {
                Console.WriteLine(e);
            }

            if (await repo.SaveAll()) {
                return Ok();
            }

            return BadRequest("failed to block user");
        }

        [HttpPost("{id}/unblock/{recipientId}")]
        public async Task<IActionResult> UnBlockUser(int id, int recipientId) {
            if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)) {
                return Unauthorized();
            }
            var block = await repo.GetBlock(id, recipientId);

            if (block == null) {
                //unfollow
                return BadRequest("You haven't blocked this user");
            }

            var recipient = await repo.GetUser(recipientId);
            if (recipient == null) {
                return NotFound();
            }

            repo.Delete(block);

            if (await repo.SaveAll()) {
                return Ok();
            }

            return BadRequest("failed to unblock user");
        }

    }
}