using System;
using System.ComponentModel.DataAnnotations;

namespace MemeApp.API.Dtos
{
    public class UserForRegisterDto
    {
        [Required]
        public string Username { get; set; }

        [Required]
        [StringLength(30, MinimumLength = 4, ErrorMessage = "Your password must be between 4 and 50 characters")]
        public string Password { get; set; }

        [Required]
        public string Email { get; set; }

        public DateTime Created { get; set; }

        public DateTime LastActive { get; set; }

        public UserForRegisterDto() {
            Created = DateTime.Now;
            LastActive = DateTime.Now;
        }
    }
}