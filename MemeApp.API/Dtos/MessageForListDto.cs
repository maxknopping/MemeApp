using System;
using System.Collections.Generic;

namespace MemeApp.API.Dtos
{
    public class MessageForListDto
    {
        public int Id { get; set; }
        public int SenderId { get; set; }
        public string SenderPhotoUrl { get; set; }
        public string SenderUsername { get; set; }
        public int RecipientId { get; set; }
        public DateTime MessageSent { get; set; }
        public DateTime? MessageRead { get; set; }
        public bool IsRead { get; set; }
        public string Content { get; set; }

        public PostForDetailedDto Post { get; set; }
        public string RecipientPhotoUrl { get; set; }

        public string RecipientUsername { get; set; }

        public IList<Object> GroupPhotoUrls { get; set; }

        public int GroupId { get; set; }

        public string GroupName { get; set; }
    }
}