namespace MemeApp.API.Models
{
    public class Liker
    {
        public int Id { get; set; }

        public int Username{get; set; }

        public int PostId { get; set; }

        public int LikerId { get; set; }
    }
}