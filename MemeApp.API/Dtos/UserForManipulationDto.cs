using System;
using System.Collections.Generic;

namespace MemeApp.API.Dtos
{
    public class UserForManipulationDto
    {
        public int Id { get; set; }

        public string Username { get; set; }

        public string Email { get; set; }

        public string Name { get; set; }

        public DateTime Created { get; set; }

        public DateTime LastActive { get; set; }

        public string FollowButton { get; set; }

        public IList<FollowForDetailedDto> Followers {get; set; }

        public string PhotoUrl { get; set; }
    }
}