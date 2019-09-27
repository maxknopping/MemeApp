using System.Collections.Generic;
using System.Threading.Tasks;
using MemeApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace MemeApp.API.Data
{
    public class MemeHubRepository : IMemeHubRepository
    {
        public DataContext context { get; set; }
        public MemeHubRepository(DataContext context)
        {
            this.context = context;

        }
        public void Add<T>(T entity) where T : class
        {
            context.Add(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            context.Remove(entity);
        }

        public async Task<User> GetUser(int id)
        {
            var user = await context.Users.Include(p => p.Posts).FirstOrDefaultAsync(x => x.Id == id);

            return user;
        }

        public async Task<IEnumerable<User>> GetUsers()
        {
            var users = await context.Users.Include(p => p.Posts).ToListAsync();

            return users;
        }

        public async Task<bool> SaveAll()
        {
            return await context.SaveChangesAsync() > 0;
        }
    }
}