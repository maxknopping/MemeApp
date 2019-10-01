namespace MemeApp.API.Models
{
    public class Liker
    {
        public int Id { get; set; }

        public string Username { get; set; }

        public int LikerId { get; set; }

        public Post Post { get; set; }

        public int PostId { get; set; }
    }
}