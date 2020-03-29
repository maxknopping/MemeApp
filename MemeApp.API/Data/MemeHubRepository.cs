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
                .Include(p => p.MessagesReceived)
                .Include(p => p.MessagesSent)
                .FirstOrDefaultAsync(x => x.Id == id);
            
            var posts = context.Posts
                .Include(p => p.LikeList).Include(p => p.Comments).AsQueryable();

            posts = posts.Where(p => p.UserId == user.Id);

            user.Posts = posts.AsEnumerable().ToList();

            var messages = context.Messages
                .Include(p => p.Sender).Include(p => p.Recipient).AsQueryable();

            var messagesReceived = messages.Where(p => p.RecipientId == user.Id);

            var messagesSent = messages.Where(m => m.SenderId == user.Id);

            user.MessagesReceived = messagesReceived.AsEnumerable().ToList();
            user.MessagesSent = messagesSent.AsEnumerable().ToList();

            return user;
        }

        public async Task<User> GetUser(string username)
        {
            var user = await context.Users
                .Include(p => p.Following)
                .Include(p => p.Followers)
                .Include(p => p.MessagesReceived)
                .Include(p => p.MessagesSent)
                .FirstOrDefaultAsync(x => x.Username == username);
            
            var posts = context.Posts
                .Include(p => p.LikeList).Include(p => p.Comments).AsQueryable();

            posts = posts.Where(p => p.UserId == user.Id);

            user.Posts = posts.AsEnumerable().ToList();

            var messages = context.Messages
                .Include(p => p.Sender).Include(p => p.Recipient).AsQueryable();

            var messagesReceived = messages.Where(p => p.RecipientId == user.Id);

            var messagesSent = messages.Where(m => m.SenderId == user.Id);

            user.MessagesReceived = messagesReceived.AsEnumerable().ToList();
            user.MessagesSent = messagesSent.AsEnumerable().ToList();

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
            foreach(var Post in user.Posts) {
                var fullPost = await GetPost(Post.Id);
                var postDto = mapper.Map<PostForDetailedDto>(fullPost);
                allPosts.Add(postDto);
            }

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
            var post = await context.Posts.Include(p => p.LikeList).Include(p => p.Comments).Include(p => p.User).FirstOrDefaultAsync(p => p.Id == id);
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

        public async Task<Message> GetMessage(int id)
        {
            return await context.Messages.Include(m => m.Sender)
                .Include(m => m.Recipient).FirstOrDefaultAsync(m => m.Id == id);
        }

        public async Task<IList<Message>> GetConversationListForUser(int userId)
        {
            var user = await GetUser(userId);
            var allMessages = new List<Message>();
            allMessages.AddRange(user.MessagesReceived);
            allMessages.AddRange(user.MessagesSent);

            //get all the users who there is a conversation with
            var conversationUsers = new List<User>();
            foreach(var message in user.MessagesReceived) {
                if (!conversationUsers.Contains(message.Sender)) {
                    conversationUsers.Add(message.Sender);
                }
            }
            foreach(var message in user.MessagesSent) {
                if (!conversationUsers.Contains(message.Recipient)) {
                    conversationUsers.Add(message.Recipient);
                }
            }
            var conversations = new List<Message>();
            //get the most recent message in the conversation from each user
            foreach(var person in conversationUsers) {
                var messageList = new List<Message>();
                if (person.Id == userId) {
                    messageList = allMessages.Where(m => (m.RecipientId == person.Id && m.SenderDeleted == false) && 
                    (m.SenderId == person.Id && m.RecipientDeleted == false)).ToList();
                } else {
                    messageList = allMessages.Where(m => (m.RecipientId == person.Id && m.SenderDeleted == false) || 
                    (m.SenderId == person.Id && m.RecipientDeleted == false)).ToList();
                }
                messageList = messageList.OrderByDescending(m => m.MessageSent).ToList();
                conversations.Add(messageList[0]);
            }

            //sort the most recent messages by date
            conversations = conversations.OrderByDescending(m => m.MessageSent).ToList();

            return conversations;
        }

        public async Task<IList<Message>> GetMessageThread(int userId, int recipientId)
        {
            var messages = await context.Messages.Include(m => m.Sender).ThenInclude(u => u.Posts)
                .Include(m => m.Recipient).ThenInclude(u => u.Posts).Include(m => m.Post).ThenInclude(p => p.User)
                .Where(m => (m.RecipientId == userId && m.SenderId == recipientId && m.RecipientDeleted == false) ||
                    (m.RecipientId == recipientId && m.SenderId == userId && m.SenderDeleted == false))
                .OrderBy(m => m.MessageSent)
                .ToListAsync();

            return messages;
        }

        public async Task<IList<User>> SearchForUser(string query, bool fullResult)
        {
            var arrayOfChars = query.ToCharArray();
            var allMatches = new List<KeyValuePair<string, int>>();

            foreach(var user in context.Users) {
                var usernameToChar = user.Username.ToCharArray();
                var matches = SimpleTextSearch(arrayOfChars, usernameToChar);
                allMatches.Add(new KeyValuePair<string, int>(user.Username, matches));
            }

            allMatches = allMatches.OrderByDescending(kvp => kvp.Value).ToList();
            var usersToReturn = new List<User>();
            var userList = new List<User>();
            for (int i = 0; i < 10; i++) {
                var user = await GetUser(allMatches[i].Key);
                userList.Add(user);
            } 

            if (fullResult) {
                usersToReturn = userList;
            } else {
                usersToReturn = userList.GetRange(0, 5);
            }
            return usersToReturn;

        }

        public static int SimpleTextSearch(char[] pattern, char[] text) {
            int patternSize = pattern.Count();
            int textSize = text.Count();
 
            int i = 0;
            var maxMatches = 0;
            while ((i + patternSize) <= textSize) {
                int j = 0;
                while (text[i + j] == pattern[j]) {
                    j += 1;
                    if (j > maxMatches) {
                        maxMatches = j;
                    }
                    if (j >= patternSize)
                        return j;
                }
                i += 1;
            }
            return maxMatches;
        }

        public async Task<IList<User>> GetConversationUsers(int userId)
        {
            var messages = await GetConversationListForUser(userId);
            var userList = new List<User>();
            foreach (var message in messages) {
                var idToSend = 0;
                if (message.SenderId == userId) 
                    idToSend = message.RecipientId;
                else 
                    idToSend = message.SenderId;
                
                var user = await GetUser(idToSend);
                userList.Add(user);
            }

            return userList;
        }
    }
}