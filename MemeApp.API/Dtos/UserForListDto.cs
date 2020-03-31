using System;
using System.Collections.Generic;
using MemeApp.API.Models;

namespace MemeApp.API.Dtos
{
    public class UserForListDto
    {
        public int Id { get; set; }

        public string Username { get; set; }

        public string Email { get; set; }

        public DateTime Created { get; set; }

        public DateTime LastActive { get; set; }

        public string FollowButton { get; set; }

        public string PhotoUrl { get; set; }

        public string Name { get; set; }
    }
}