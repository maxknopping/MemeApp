namespace MemeApp.API.Models
{
    public class Followee
    {
        public int Id { get; set; }

        public string Username { get; set; }

        public User User { get; set; }
        public int UserId { get; set; }

    }
}