using System;
using System.Collections.Generic;
using MemeApp.API.Models;

namespace MemeApp.API.Dtos
{
    public class UserForDetailedDto
    {
        public int Id { get; set; }

        public string Username { get; set; }

        public int Age { get; set; }

        public DateTime DateOfBirth { get; set; }

        public string KnownAs { get; set; }

        public DateTime Created { get; set; }

        public DateTime LastActive { get; set; }

        public string Bio { get; set; }

        public string PhotoUrl { get; set; }

        public IList<PostForDetailedDto> Posts { get; set; }

        public IList<FollowForDetailedDto> Followers {get; set; }

        public IList<FollowForDetailedDto> Following { get; set; }



    }
}