using System;
using System.Collections;
using System.Collections.Generic;

namespace MemeApp.API.Models
{
    public class User
    {
        public int Id { get; set; }

        public string Username { get; set; }

        public byte[] PasswordHash { get; set; }

        public byte[] PasswordSalt {get; set; }

        public string Gender { get; set; }

        public string PhotoUrl { get; set; }

        public string PublicIdForPhoto { get; set; }

        public DateTime DateOfBirth { get; set; }

        public string KnownAs { get; set; }

        public DateTime Created { get; set; }

        public DateTime LastActive { get; set; }

        public string Bio { get; set; }

        public IList<Post> Posts { get; set; }

        public IList<Followee> Following { get; set; }
    }
}