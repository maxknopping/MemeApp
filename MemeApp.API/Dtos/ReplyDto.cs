using System;
using System.Collections.Generic;

namespace MemeApp.API.Dtos
{
    public class ReplyDto
    {
        public int Id { get; set; }

        public string Text { get; set; }

        public int Likes { get; set; }

        public int CommenterId { get; set; }

        public IList<ReplyLikeDto> LikeList { get; set; }

        public DateTime Created { get; set; }

        public int PostId { get; set; }


        public int CommentId { get; set; }

        public string Username { get; set; }

        public string PhotoUrl { get; set; }

    }
}