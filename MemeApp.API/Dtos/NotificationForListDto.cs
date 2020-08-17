using System;

namespace MemeApp.API.Dtos
{
    public class NotificationForListDto
    {
        public int Id { get; set; }

        public int RecipientId { get; set; }

        public int CauserId { get; set; }

        public string CauserUsername { get; set; }

        public string CauserPhotoUrl { get; set; }

        public DateTime Created { get; set; }

        public string GroupName { get; set; }

        public bool IsRead { get; set; }

        public string Message { get; set; }

        public string PostUrl { get; set; }

        public int? PostId { get; set; }

        public string CommentText { get; set; }

        public int? CommentId { get; set; }

        public bool Followed { get; set; }

        public string Type { get; set; }
    }
}