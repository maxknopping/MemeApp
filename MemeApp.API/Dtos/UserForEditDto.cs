namespace MemeApp.API.Dtos
{
    public class UserForEditDto
    {
        public string Username { get; set; }

        public string Bio { get; set; }

        public string Email { get; set; }

        public string Name { get; set; }

        public bool RemoveProfilePicture { get; set; }
    }
}