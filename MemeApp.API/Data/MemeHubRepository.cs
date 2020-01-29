using System.Collections.Generic;
using System.Linq;
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
                .Include(p => p.Following)
                .Include(p => p.Followers)
                .FirstOrDefaultAsync(x => x.Id == id);
            
            var posts = context.Posts
                .Include(p => p.LikeList).Include(p => p.Comments).AsQueryable();

            posts = posts.Where(p => p.UserId == user.Id);

            user.Posts = posts.AsEnumerable().ToList();

            return user;
        }

        public async Task<User> GetUser(string username)
        {
            var user = await context.Users
                .Include(p => p.Following)
                .Include(p => p.Followers)
                .FirstOrDefaultAsync(x => x.Username == username);
            
            var posts = context.Posts
                .Include(p => p.LikeList).Include(p => p.Comments).AsQueryable();

            posts = posts.Where(p => p.UserId == user.Id);

            user.Posts = posts.AsEnumerable().ToList();

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
                    var fullPost = await GetPost(Post.Id);
                    var postDto = mapper.Map<PostForDetailedDto>(fullPost);
                    allPosts.Add(postDto);

                }
            }
            allPosts.Sort(SortPostsByDate);
            var feed = allPosts[index];

            return feed;
        }

        public async Task<PostForDetailedDto> GetFeatured(int index)
        {
            var posts = await GetAllPosts();
            var allPosts = new List<PostForDetailedDto>();
            foreach (var post in posts)
            {
                var postDto = mapper.Map<PostForDetailedDto>(post);
                allPosts.Add(postDto);

            }
            var feed = allPosts[index];

            return feed;
        }

        public int SortPostsByDate(PostForDetailedDto x, PostForDetailedDto y)
        {
            return y.Created.CompareTo(x.Created);
        }

        public async Task<Post> GetPost(int id) {
            var post = await context.Posts.Include(p => p.LikeList).Include(p => p.Comments).FirstOrDefaultAsync(p => p.Id == id);
            return post;
        }

        public async Task<IList<Post>> GetAllPosts() { //need to do only posts from last x amount of time (eventually)
            var post = await context.Posts.Include(p => p.LikeList).Include(p => p.Comments).Include(p => p.User).OrderByDescending(p => p.LikeList.Count).ToListAsync();
            return post;
        }

        public async Task<Follow> GetFollow(int userId, int recipientId)
        {
            return await context.Follows
                .FirstOrDefaultAsync(u => u.FollowerId == userId && u.FolloweeId == recipientId);
        }

        public async Task<Like> GetLike(int userId, int postId)
        {
            return await context.Likes.FirstOrDefaultAsync(u => u.LikerId == userId && u.PostId == postId);
        }

        public IEnumerable<Comment> GetComments(int postId)
        {
            return context.Comments.Where(c => c.PostId == postId).Include(c => c.LikeList);
        }

        public async Task<CommentLike> GetCommentLike(int userId, int commentId)
        {
            return await context.CommentLikes
                .FirstOrDefaultAsync(u => u.CommenterId == userId && u.CommentId == commentId);
        }

        public async Task<Comment> GetComment(int commentId)
        {
            var comment = await context.Comments.Include(p => p.LikeList).FirstOrDefaultAsync(p => p.Id == commentId);
            return comment;
        }
    }
}