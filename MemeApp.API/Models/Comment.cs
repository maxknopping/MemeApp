using System;
using System.Collections.Generic;

namespace MemeApp.API.Models
{
    public class Comment
    {
        public int Id { get; set; }
        public string Text { get; set; }

        public int Likes { get; set; }

        public int CommenterId { get; set; }

        public IList<CommentLike> LikeList { get; set; }

        public DateTime Created { get; set; }

        public Post Post { get; set; }

        public int PostId { get; set; }
    }
}