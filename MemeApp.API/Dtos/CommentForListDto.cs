using System;
using System.Collections.Generic;
using MemeApp.API.Models;

namespace MemeApp.API.Dtos
{
    public class CommentForListDto
    {
        public int Id { get; set; }
        public string Text { get; set; }

        public int Likes { get; set; }

        public IList<CommentLikeDto> LikeList { get; set; }

        public int CommenterId { get; set; }

        public IList<ReplyDto> Replies { get; set; }

        public DateTime Created { get; set; }

        public int PostId { get; set; }

        public string Username { get; set; }

        public string PhotoUrl { get; set; }
    }
}