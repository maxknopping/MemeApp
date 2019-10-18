using System;
using Microsoft.AspNetCore.Http;

namespace MemeApp.API.Dtos
{
    public class PostForCreationDto
    {
        public string Url { get; set; }

        public IFormFile File { get; set; }
        
        public string Caption { get; set; }

        public DateTime DateCreated { get; set; }

        public string PublicId { get; set; }

        public PostForCreationDto() {
            DateCreated = DateTime.Now;
        }
    }
}