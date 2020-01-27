namespace MemeApp.API.Dtos
{
    public class CommentLikeDto
    {
        public int PostId { get; set; }

        public int CommenterId { get; set; }

        public int CommentId { get; set; }
    }
}