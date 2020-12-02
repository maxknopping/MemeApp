namespace MemeApp.API.Models
{
    public class Block
    {
        public int BlockerId { get; set; }

        public int BlockeeId { get; set; }

        public User Blocker { get; set; }

        public User Blockee { get; set; }
    }
}