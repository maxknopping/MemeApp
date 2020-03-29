using System;
using System.Collections;
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
    [Route("api/users/{userId}/[controller]")]
    [ApiController]
    public class MessagesController : ControllerBase
    {
        private readonly IMemeHubRepository repo;
        private readonly IMapper mapper;
        public MessagesController(IMemeHubRepository repo, IMapper mapper)
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

            var usersToReturn = mapper.Map<List<UserForListDto>>(usersFromRepo);

            return Ok(usersToReturn);
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

        [HttpPost]
        public async Task<IActionResult> CreateMessage(int userId, MessageForCreationDto message) {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)) {
                return Unauthorized();
            }

            message.SenderId = userId;

            var recipient = await repo.GetUser(message.RecipientId);

            if (recipient == null) {
                return BadRequest("Could not find user");
            }

            var fullMessage = mapper.Map<Message>(message);

            repo.Add(fullMessage);


            if (await repo.SaveAll()) {
                var messageToReturn = mapper.Map<MessageForListDto>(fullMessage);
                return CreatedAtRoute("GetMessage", new {id = fullMessage.Id}, messageToReturn);
            }

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

            repo.Add(fullMessage);


            if (await repo.SaveAll()) {
                var messageToReturn = mapper.Map<MessageForListDto>(fullMessage);
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