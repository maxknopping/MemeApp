using System;
using System.Collections.Generic;

namespace MemeApp.API.Models
{
    public class Post
    {
        public int Id { get; set; }

        public string Url { get; set; }

        public string Caption { get; set; }

        public IList<Comment> Comments { get; set; }

        public int Likes { get; set; }

        public IList<Like> LikeList { get; set; }

        public bool IsProfilePicture { get; set; }

        public string PublicId { get; set; }

        public DateTime Created { get; set; }

        public User User { get; set; }

        public int UserId { get; set; }

        public IList<Message> MessagesSent { get; set; }

        public IList<Notification> Notifications { get; set; }

        public bool inJoust { get; set; }

        public int JoustRating { get; set; }

        public bool isReported { get; set; }


        
    }
}