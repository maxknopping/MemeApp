using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using MemeApp.API.Dtos;
using MemeApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace MemeApp.API.Data
{
    public class MemeHubRepository : IMemeHubRepository
    {
        public DataContext context { get; set; }
        private readonly IMapper mapper;
        public MemeHubRepository(DataContext context, IMapper mapper)
        {
            this.mapper = mapper;
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
            var user = await context.Users
                .Include(p => p.Posts)
                .Include(p => p.Following)
                .Include(p => p.Followers)
                .FirstOrDefaultAsync(x => x.Id == id);

            return user;
        }

        public async Task<User> GetUser(string username)
        {
            var user = await context.Users
                .Include(p => p.Posts)
                .Include(p => p.Following)
                .Include(p => p.Followers)
                .FirstOrDefaultAsync(x => x.Username == username);

            return user;
        }

        public async Task<IEnumerable<User>> GetUsers()
        {
            var users = await context.Users
                .Include(p => p.Posts)
                .Include(p => p.Following)
                .Include(p => p.Followers)
                .ToListAsync();

            return users;
        }

        public async Task<bool> SaveAll()
        {
            return await context.SaveChangesAsync() > 0;
        }

        public async Task<PostForDetailedDto> GetFeed(User user, int index)
        {
            var allPosts = new List<PostForDetailedDto>();
            foreach (var account in user.Following)
            {
                var fullAccount = await GetUser(account.FolloweeId);
                foreach (var Post in fullAccount.Posts)
                {
                    var postDto = mapper.Map<PostForDetailedDto>(Post);
                    allPosts.Add(postDto);

                }
            }
            allPosts.Sort(SortPostsByDate);
            var feed = allPosts[index];

            return feed;
        }

        public int SortPostsByDate(PostForDetailedDto x, PostForDetailedDto y)
        {
            return y.Created.CompareTo(x.Created);
        }

        public async Task<Post> GetPost(int id) {
            var post = await context.Posts.FirstOrDefaultAsync(p => p.Id == id);
            return post;
        }

        public async Task<Follow> GetFollow(int userId, int recipientId)
        {
            return await context.Follows
                .FirstOrDefaultAsync(u => u.FollowerId == userId && u.FolloweeId == recipientId);
        }

    }
}