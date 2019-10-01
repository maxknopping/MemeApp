using System;
using System.Collections.Generic;

namespace MemeApp.API.Models
{
    public class Post
    {
        public int Id { get; set; }

        public string Url { get; set; }

        public string Caption { get; set; }

        public IList<Comment> Comments {get; set; }

        public int Likes { get; set; }

        public bool IsProfilePicture { get; set; }

        public DateTime Created { get; set; }

        public User User { get; set; }

        public IList<Liker> Likers {get; set; }


        public int UserId { get; set; }


        
    }
}