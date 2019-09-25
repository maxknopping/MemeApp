using System.ComponentModel.DataAnnotations;

namespace MemeApp.API.Dtos
{
    public class UserForRegisterDto
    {
        [Required]
        public string Username { get; set; }

        [Required]
        [StringLength(50, MinimumLength = 4, ErrorMessage = "Your password must be between 4 and 50 characters")]
        public string Password { get; set; }
    }
}