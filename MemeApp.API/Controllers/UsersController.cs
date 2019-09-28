using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using MemeApp.API.Data;
using MemeApp.API.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MemeApp.API.Controllers
{
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

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await repo.GetUser(id);

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
    }
}