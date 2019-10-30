using System;
using System.Collections.Generic;
using MemeApp.API.Models;

namespace MemeApp.API.Dtos
{
    public class UserForListDto
    {
        public int Id { get; set; }

        public string Username { get; set; }

        public string Gender { get; set; }

        public int Age { get; set; }

        public string KnownAs { get; set; }

        public DateTime Created { get; set; }

        public DateTime LastActive { get; set; }

        public string PhotoUrl { get; set; }

        public IList<Follow> Followers { get; set; }

        public IList<Follow> Following { get; set; }
    }
}