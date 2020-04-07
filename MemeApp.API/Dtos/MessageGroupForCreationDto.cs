using System;

namespace MemeApp.API.Dtos
{
    public class MessageGroupForCreationDto
    {
        public int SenderId { get; set; }

        public DateTime MessageSent { get; set; }

        public string Content { get; set; }

        public int GroupId { get; set; }

        public int? PostId { get; set; }
    }
}