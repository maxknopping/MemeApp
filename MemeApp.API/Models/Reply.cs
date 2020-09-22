using System;
using System.Collections.Generic;

namespace MemeApp.API.Models
{
    public class Reply
    {
        public int Id { get; set; }
        public string Text { get; set; }

        public int Likes { get; set; }

        public int CommenterId { get; set; }

        public IList<ReplyLike> LikeList { get; set; }

        public DateTime Created { get; set; }

        public Post Post { get; set; }

        public int PostId { get; set; }

        public IList<Notification> Notifications { get; set; }
        public Comment Comment { get; set; }

        public int CommentId { get; set; }

        public User Commenter { get; set; }
    }
}