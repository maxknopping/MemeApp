using System;

namespace MemeApp.API.Models
{
    public class Message
    {
        public int Id { get; set; }

        public int SenderId { get; set; }

        public User Sender { get; set; }

        public int RecipientId { get; set; }

        public User Recipient { get; set; }

        public string Content { get; set; }

        public bool IsRead { get; set; }

        public DateTime? DateRead { get; set; }

        public DateTime MessageSent { get; set; }

        public bool SenderDeleted { get; set; }

        public bool RecipientDeleted { get; set; }

        public bool SenderReadReceipts { get; set; }

        public Post Post { get; set; }

        public int? GroupId { get; set; }

        public Group Group { get; set; }
    }
}