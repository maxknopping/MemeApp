namespace MemeApp.API.Models
{
    public class Like
    {
        public int LikerId { get; set; }

        public int PostId { get; set; }

        public User Liker { get; set; }

        public Post Post { get; set; }
    }
}