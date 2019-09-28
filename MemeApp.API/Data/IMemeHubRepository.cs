using System.Collections.Generic;
using System.Threading.Tasks;
using MemeApp.API.Dtos;
using MemeApp.API.Models;

namespace MemeApp.API.Data
{
    public interface IMemeHubRepository
    {
         void Add<T>(T entity) where T:class;

         void Delete<T>(T entity) where T:class;

         Task<bool> SaveAll();
         Task<IEnumerable<User>> GetUsers();

         Task<User> GetUser(int id);

         Task<User> GetUser(string username);

         Task<IList<PostForDetailedDto>> GetFeed(User user);



    }
}