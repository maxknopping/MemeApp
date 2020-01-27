namespace MemeApp.API.Models
{
    public class CommentLike
    {
        public int PostId { get; set; }

        public int CommenterId { get; set; }

        public int CommentId { get; set; }

        public Comment Comment { get; set; }

        public User Commenter { get; set; }

        public Post Post { get; set; }
    }
}