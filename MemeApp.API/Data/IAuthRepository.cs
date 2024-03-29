using System.Collections.Generic;
using System.Threading.Tasks;
using MemeApp.API.Models;

namespace MemeApp.API.Data
{
    public interface IAuthRepository
    {
         Task<User> Register(User user, string password);

         Task<User> Login(string username, string password);

         Task<bool> UserExists(string username);

        Task<bool> ChangePassword(User user, string password);

        Task<IList<User>> GetUsersByEmail(string email);
    }
}