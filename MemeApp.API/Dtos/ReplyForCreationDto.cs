namespace MemeApp.API.Dtos
{
    public class ReplyForCreationDto
    {
        public int PostId { get; set; }

        public int CommentId { get; set; }

        public string Text { get; set; }

        public int CommenterId { get; set; }
    }
}