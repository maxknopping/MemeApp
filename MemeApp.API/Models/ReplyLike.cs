namespace MemeApp.API.Models
{
    public class ReplyLike
    {
        public int PostId { get; set; }

        public int LikerId { get; set; }

        public User Liker { get; set; }

        public Post Post { get; set; }
        public int ReplyId { get; set; }

        public Reply Reply { get; set; }
    }
}