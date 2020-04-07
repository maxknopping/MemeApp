using System;
using System.Collections.Generic;

namespace MemeApp.API.Dtos
{
    public class UserForSendPostDto
    {
        public int Id { get; set; }

        public string Username { get; set; }

        public string Email { get; set; }

        public DateTime Created { get; set; }

        public DateTime LastActive { get; set; }

        public string GroupName { get; set; }

        public int GroupId { get; set; }

        public IList<string> GroupPhotoUrls { get; set; }

        public IList<string> GroupUsernames { get; set; }

        public string PhotoUrl { get; set; }

        public string Name { get; set; }
    }
}