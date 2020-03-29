using System;
using System.Collections.Generic;
using MemeApp.API.Models;

namespace MemeApp.API.Dtos
{
    public class PostForDetailedDto
    {
        public int Id { get; set; }

        public string Url { get; set; }

        public string Caption { get; set; }

        public IList<CommentForListDto> Comments {get; set; }

        public int Likes { get; set; }
        
        public IList<LikeDto> LikeList { get; set; }

        public bool IsProfilePicture { get; set; }

        public DateTime Created { get; set; }

        public string Username { get; set; }

        public string ProfilePictureUrl { get; set; }

    }
}