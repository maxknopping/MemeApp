using System;

namespace MemeApp.API.Dtos
{
    public class UserForReportDto
    {
        public int Id { get; set; }

        public string Username { get; set; }

        public string Email { get; set; }

        public DateTime Created { get; set; }

        public DateTime LastActive { get; set; }

        public string PhotoUrl { get; set; }

        public string Name { get; set; }

        public string Bio { get; set; }

        public bool IsAdmin { get; set; }

        public int ReportedCount { get; set; }

        public int ReportedPostCount { get; set; }
        
        public bool IsBanned { get; set; }
        public int BanCount { get; set; }
    }
}