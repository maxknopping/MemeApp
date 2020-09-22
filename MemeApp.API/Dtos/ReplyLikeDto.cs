namespace MemeApp.API.Dtos
{
    public class ReplyLikeDto
    {
        public int PostId { get; set; }

        public int LikerId { get; set; }

        public int ReplyId { get; set; }

    }
}