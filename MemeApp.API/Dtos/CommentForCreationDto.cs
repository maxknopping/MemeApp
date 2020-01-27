namespace MemeApp.API.Dtos
{
    public class CommentForCreationDto
    {
        public int PostId { get; set; }

        public string Text { get; set; }

        public int CommenterId { get; set; }

    }
}