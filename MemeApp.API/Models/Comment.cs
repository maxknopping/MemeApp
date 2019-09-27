using System;

namespace MemeApp.API.Models
{
    public class Comment
    {
        public string Text { get; set; }

        public int Likes { get; set; }

        public int Id { get; set; }

        public DateTime Created { get; set; }

        public Post Post { get; set; }

        public int PostId { get; set; }
    }
}