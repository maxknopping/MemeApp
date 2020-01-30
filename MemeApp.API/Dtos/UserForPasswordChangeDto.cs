namespace MemeApp.API.Dtos
{
    public class UserForPasswordChangeDto
    {
        public string Username { get; set; }

        public string CurrentPassword { get; set; }

        public string NewPassword { get; set; }
    }
}