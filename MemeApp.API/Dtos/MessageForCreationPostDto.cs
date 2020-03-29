using System;

namespace MemeApp.API.Dtos
{
    public class MessageForCreationPostDto
    {
        public int SenderId { get; set; }

        public int RecipientId { get; set; }

        public DateTime MessageSent { get; set; }

        public int PostId { get; set; }

        public MessageForCreationPostDto() {
            MessageSent = DateTime.Now;
        }
    }
}