using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
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
    [Route("api/users/{userId}/[controller]")]
    [ApiController]
    public class MessagesController : ControllerBase
    {
        private readonly IMemeClubRepository repo;
        private readonly IMapper mapper;
        public MessagesController(IMemeClubRepository repo, IMapper mapper)
        {
            this.mapper = mapper;
            this.repo = repo;

        }

        [HttpGet("{id}", Name="GetMessage")]
        public async Task<IActionResult> GetMessage(int userId, int id) {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)) {
                return Unauthorized();
            }
            var messageFromRepo = await repo.GetMessage(id);
            if (messageFromRepo == null) {
                return NotFound();
            }

            return Ok(messageFromRepo);
        }

        [HttpGet]
        public async Task<IActionResult> GetConversations(int userId) {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)) {
                return Unauthorized();
            }

            var messagesFromRepo = await repo.GetConversationListForUser(userId);

            var conversations = mapper.Map<List<MessageForListDto>>(messagesFromRepo);

            return Ok(conversations);
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetConversationUsers(int userId) {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)) {
                return Unauthorized();
            }

            var usersFromRepo = await repo.GetConversationUsers(userId);


            return Ok(usersFromRepo);
        }

        [HttpGet("thread/{recipientId}")]
        public async Task<IActionResult> GetMessageThread(int userId, int recipientId) {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)) {
                return Unauthorized();
            }

            var messagesFromRepo = await repo.GetMessageThread(userId, recipientId);

            var messageThread = mapper.Map<IList<MessageForListDto>>(messagesFromRepo);

            return Ok(messageThread);
        }

        [HttpGet("thread/group/{groupId}")]
        public async Task<IActionResult> GetGroupMessageThread(int userId, int groupId) {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)) {
                return Unauthorized();
            }

            var messagesFromRepo = await repo.GetGroupMessageThread(userId, groupId);

            var messageThread = mapper.Map<IList<MessageForListDto>>(messagesFromRepo);

            return Ok(messageThread);
        }

        [HttpPost]
        public async Task<IActionResult> CreateMessage(int userId, MessageForCreationDto message) {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)) {
                return Unauthorized();
            }

            message.SenderId = userId;

            var recipient = await repo.GetUser(message.RecipientId);
            var sender = await repo.GetUser(message.SenderId);
            if (recipient == null) {
                return BadRequest("Could not find user");
            }

            var fullMessage = mapper.Map<Message>(message);

            var notification = new Notification("message")
            {
                RecipientId = message.RecipientId,
                CauserId = userId
            };

            repo.Add(fullMessage);
            repo.Add(notification);

            if (await repo.SaveAll()) {
                var messageToReturn = mapper.Map<MessageForListDto>(fullMessage);
                var notificationCount = await repo.HasNewNotifications(recipient.Id);

                if (recipient.PushToken != null) {
                        var client = new PushClient();
                        var pushNotification = new PushMessage(recipient.PushToken, 
                            data: new {type = "message"},
                            title: "MemeClub", 
                            body: $"@{sender.Username} {notification.Message}\"{message.Content}\"", 
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
                return CreatedAtRoute("GetMessage", new {id = fullMessage.Id}, messageToReturn);
            }

            throw new Exception("Creating message failed on save");
        }

        [HttpPost("group")]
        public async Task<IActionResult> CreateGroup(int userId, GroupForCreationDto groupForCreation) {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)) {
                return Unauthorized();
            }

            var group = new Group()
            {
                GroupName = groupForCreation.GroupName
            };

            repo.Add(group);

            if (!(await repo.SaveAll())) {
                throw new Exception("Adding a group failed on save");
            }
            
            foreach(var user in groupForCreation.UserIds) {
                if (user == userId) {
                    continue;
                }
                var fulluser = await repo.GetUser(user);
                var userGroup = new UserGroup()
                {
                    UserId = user,
                    GroupId = group.Id,
                    UserPhotoUrl = fulluser.PhotoUrl
                };
                repo.Add(userGroup);
            }

            var self = await repo.GetUser(userId);
            var selfGroup = new UserGroup()
            {
                UserId = userId,
                GroupId = group.Id,
                UserPhotoUrl = self.PhotoUrl
            };
            repo.Add(selfGroup);

            if (!(await repo.SaveAll())) {
                throw new Exception("Adding usergroups failed on save");
            }

            var message = new MessageGroupForCreationDto(){
                SenderId = userId,
                Content = groupForCreation.Message,
                GroupId = group.Id
            };

            return await CreateGroupMessage(userId, group.Id, message);
            
        }

        [HttpPut("group")]
        public async Task<IActionResult> UpdateGroup(int userId, GroupForUpdateDto groupForCreation) {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)) {
                return Unauthorized();
            }

            var group = await repo.GetGroup(groupForCreation.GroupId);

            if (group == null) {
                return BadRequest("Group doesn't exist");
            }

            group.GroupName = groupForCreation.GroupName;

            foreach (var user in groupForCreation.UsersToAdd) {
                if (group.UserGroups.Select(ug => ug.UserId).Contains(user)) {
                    continue;
                }
                var fulluser = await repo.GetUser(user);
                var userGroup = new UserGroup()
                {
                    UserId = user,
                    GroupId = group.Id,
                    UserPhotoUrl = fulluser.PhotoUrl
                };
                repo.Add(userGroup);
            }

            await repo.SaveAll();

            foreach (var user in groupForCreation.UsersToRemove) {
                var userGroup = group.UserGroups.FirstOrDefault(ug => ug.UserId == user);
                repo.Delete(userGroup);
            }

            await repo.SaveAll();

            return Ok();

        }

        [HttpPost("group/{groupId}")]
        public async Task<IActionResult> CreateGroupMessage(int userId, int groupId, MessageGroupForCreationDto message) {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)) {
                return Unauthorized();
            }
            message.SenderId = userId;
            var group = await repo.GetGroup(groupId);

            Post post = null;

            if (message.PostId != null) {
                post = await repo.GetPost(message.PostId.Value);
            }

            var fullMessage = mapper.Map<Message>(message);
            fullMessage.MessageSent = DateTime.Now;
            var messages = new List<Message>();
            var sender = await repo.GetUser(userId);
            foreach(var userGroup in group.UserGroups) {
                if (userGroup.UserId == userId) {
                    continue;
                }
                var individualMessage = new Message() {
                    SenderId = fullMessage.SenderId,
                    Content = fullMessage.Content,
                    MessageSent = fullMessage.MessageSent,
                    GroupId = fullMessage.GroupId
                };
                if (post != null) {
                    individualMessage.Post = post;
                }
                individualMessage.RecipientId = userGroup.UserId;
                var notification = new Notification("groupMessage")
                {
                    RecipientId = userGroup.UserId,
                    CauserId = userId,
                    GroupName = group.GroupName
                };
                repo.Add(notification);
                repo.Add(individualMessage);

                await repo.SaveAll();

                var notificationCount = await repo.HasNewNotifications(userGroup.UserId);
                var userRecipient = await repo.GetUser(userGroup.UserId);

                if (userRecipient.PushToken != null) {
                        var client = new PushClient();
                        var pushNotification = new PushMessage(userRecipient.PushToken, 
                            data: new {type = "groupMessage"},
                            title: "MemeClub", 
                            body: $"@{sender.Username} {notification.Message}\"{group.GroupName}\"", 
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


            var messageToReturn = mapper.Map<MessageForListDto>(fullMessage);
            return CreatedAtRoute("GetMessage", new {id = fullMessage.Id}, messageToReturn);

            throw new Exception("Creating message failed on save");
        }

        [HttpPost("withPost")]
        public async Task<IActionResult> CreateMessageWithPost(int userId, MessageForCreationPostDto message) {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)) {
                return Unauthorized();
            }

            message.SenderId = userId;

            var recipient = await repo.GetUser(message.RecipientId);

            if (recipient == null) {
                return BadRequest("Could not find user");
            }

            var post = await repo.GetPost(message.PostId);

            if (post == null) {
                return BadRequest("Could not find post");
            }

            var fullMessage = mapper.Map<Message>(message);

            fullMessage.Post = post;

            var notification = new Notification("message")
            {
                RecipientId = message.RecipientId,
                CauserId = userId
            };

            repo.Add(notification);

            repo.Add(fullMessage);


            if (await repo.SaveAll()) {
                var messageToReturn = mapper.Map<MessageForListDto>(fullMessage);
                var notificationCount = await repo.HasNewNotifications(message.RecipientId);
                var userRecipient = await repo.GetUser(message.RecipientId);
                var sender = await repo.GetUser(userId);

                if (userRecipient.PushToken != null) {
                        var client = new PushClient();
                        var pushNotification = new PushMessage(userRecipient.PushToken, 
                            data: new {type = "groupMessage"},
                            title: "MemeClub", 
                            body: $"@{sender.Username} {notification.Message}: Post by user: {post.User.Username}", 
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



                return CreatedAtRoute("GetMessage", new {id = fullMessage.Id}, messageToReturn);
            }

            throw new Exception("Creating message failed on save");
        }

        [HttpPost("{id}")]
        public async Task<IActionResult> DeleteMessage(int id, int userId) {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)) {
                return Unauthorized();
            }

            var messageFromRepo = await repo.GetMessage(id);

            if (messageFromRepo.SenderId == userId) {
                messageFromRepo.SenderDeleted = true;
            } 
            if (messageFromRepo.RecipientId == userId) {
                messageFromRepo.RecipientDeleted = true;
            }

            if (messageFromRepo.SenderDeleted && messageFromRepo.RecipientDeleted) {
                repo.Delete(messageFromRepo);
            }

            if ( await repo.SaveAll()) {
                return NoContent();
            }

            throw new Exception("Error deleting message");
        }

        [HttpPost("{id}/read")]
        public async Task<IActionResult> MarkMessageAsRead(int id, int userId) {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)) {
                return Unauthorized();
            }

            var message = await repo.GetMessage(id);

            if (message.RecipientId != userId) {
                return Unauthorized();
            }

            message.IsRead = true;
            message.DateRead = DateTime.Now;

            await repo.SaveAll();

            return NoContent();
        }

    }
}