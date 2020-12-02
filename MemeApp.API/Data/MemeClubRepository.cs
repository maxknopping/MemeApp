using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using MemeApp.API.Dtos;
using MemeApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace MemeApp.API.Data
{
    public class MemeClubRepository : IMemeClubRepository
    {
        public DataContext context { get; set; }
        private readonly IMapper mapper;
        public MemeClubRepository(DataContext context, IMapper mapper)
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
                .Include(p => p.Blockers)
                .Include(p => p.Blockees)
                .Include(p => p.MessagesReceived)
                .Include(p => p.MessagesSent)
                .Include(p => p.NotificationsReceived)
                .Include(u => u.UserGroups)
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
                .Include(p => p.Blockers)
                .Include(p => p.Blockees)
                .Include(p => p.MessagesReceived)
                .Include(p => p.MessagesSent)
                .FirstOrDefaultAsync(x => x.Username == username);
            
            var posts = context.Posts
                .Include(p => p.LikeList).Include(p => p.Comments).AsQueryable();

            posts = posts.Where(p => p.UserId == user.Id);

            if (user == null) {
                return null;
            }

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

        public async Task<PostForDetailedDto> GetFeatured(int id, int index)
        {
            Console.WriteLine($"[PRINT] id: {id}");
            var posts = await GetAllPosts();
            posts = posts.Where(p => !p.User.Blockers.Select(b => b.BlockerId).Contains(id)).ToList();
            posts = posts.OrderByDescending(p => p.Created).ToList();
            var allPosts = new List<PostForDetailedDto>();
            foreach (var post in posts)
            {
                var postDto = mapper.Map<PostForDetailedDto>(post);
                allPosts.Add(postDto);

            }
            allPosts = allPosts.OrderByDescending(p => p.Created.Date).ThenByDescending(p => p.LikeList.Count).ToList();
            var count = 0;
            DateTime date = DateTime.Now.Date;
            foreach(var post in allPosts) {
                if (post.Created.Date.Equals(date)) {
                    count++;
                }

                if (count > 60 && post.Created.Date.Equals(date)) {
                    allPosts.Remove(post);
                }

                if (!post.Created.Date.Equals(date)) {
                    count = 1;
                    date = post.Created.Date;
                }
            }
            var feed = allPosts[index];
            return feed;
        }

        public int SortPostsByDate(PostForDetailedDto x, PostForDetailedDto y)
        {
            return y.Created.CompareTo(x.Created);
        }

        public async Task<Post> GetPost(int id) {
            var post = await context.Posts.Include(p => p.LikeList).Include(p => p.Comments).Include(p => p.User).Include(c => c.Notifications)
            .Include(p => p.MessagesSent).FirstOrDefaultAsync(p => p.Id == id);
            return post;
        }

        public async Task<IList<Post>> GetAllPosts() { //need to do only posts from last x amount of time (eventually)
            var post = await context.Posts.Include(p => p.LikeList).Include(p => p.Comments).Include(p => p.User).ThenInclude(u => u.Blockers).OrderByDescending(p => p.LikeList.Count).ToListAsync();
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
            return context.Comments.Where(c => c.PostId == postId).Include(c => c.LikeList).Include(c=> c.Replies)
                .ThenInclude(r => r.LikeList);
        }

        public async Task<CommentLike> GetCommentLike(int userId, int commentId)
        {
            return await context.CommentLikes
                .FirstOrDefaultAsync(u => u.CommenterId == userId && u.CommentId == commentId);
        }

        public async Task<Comment> GetComment(int commentId)
        {
            var comment = await context.Comments.Include(p => p.LikeList).Include(c => c.Notifications)
            .Include(c => c.Replies).ThenInclude(r => r.Notifications).Include(c => c.Replies).ThenInclude(r => r.LikeList)
            
                .FirstOrDefaultAsync(p => p.Id == commentId);
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
                if (!conversationUsers.Contains(message.Sender) && message.GroupId == null) {
                    conversationUsers.Add(message.Sender);
                }
            }
            foreach(var message in user.MessagesSent) {
                if (!conversationUsers.Contains(message.Recipient) && message.GroupId == null) {
                    conversationUsers.Add(message.Recipient);
                }
            }
            var conversations = new List<Message>();

            //get the most recent messages from all group chats
            foreach(var userGroup in user.UserGroups) {
                var group = await GetGroup(userGroup.GroupId);

                var messages = group.Messages.OrderByDescending(m => m.MessageSent).ToList();

                conversations.Add(messages.ElementAtOrDefault(0));

            }

            //get the most recent message in the conversation from each user
            foreach(var person in conversationUsers) {
                var messageList = new List<Message>();
                if (person.Id == userId) {
                    messageList = allMessages.Where(m => (m.RecipientId == person.Id && m.SenderDeleted == false) && 
                    (m.SenderId == person.Id && m.RecipientDeleted == false) && m.GroupId == null).ToList();
                } else {
                    messageList = allMessages.Where(m => ((m.RecipientId == person.Id && m.SenderDeleted == false) || 
                    (m.SenderId == person.Id && m.RecipientDeleted == false)) && m.GroupId == null).ToList();
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
                .Where(m => ((m.RecipientId == userId && m.SenderId == recipientId && m.RecipientDeleted == false) ||
                    (m.RecipientId == recipientId && m.SenderId == userId && m.SenderDeleted == false)) && (m.GroupId == null)).ToListAsync();
            var messagesToReturn = messages.OrderBy(m => m.MessageSent);
                

            return messagesToReturn.ToList();
        }

        public async Task<IList<User>> SearchForUser(int id, string query, bool fullResult)
        {
            var arrayOfChars = query.ToCharArray();
            var allMatches = new List<KeyValuePair<string, int>>();
            foreach(var user in context.Users.Where(u => !u.Blockees.Select(b => b.BlockeeId).Contains(id) && !u.Blockers.Select(b => b.BlockerId).Contains(id))) {
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

        public async Task<IList<UserForSendPostDto>> GetConversationUsers(int userId)
        {
            var messages = await GetConversationListForUser(userId);
            var userList = new List<UserForSendPostDto>();
            foreach (var message in messages) {
                var idToSend = 0;
                if (message.SenderId == userId) 
                    idToSend = message.RecipientId;
                else 
                    idToSend = message.SenderId;
                
                UserForSendPostDto user;
                if (message.GroupId > 0) {
                    user = new UserForSendPostDto()
                    {
                        Username = message.Group.GroupName,
                        GroupPhotoUrls = message.Group.UserGroups.Select(ug => ug.UserPhotoUrl).ToList(),
                        GroupUsernames = message.Group.UserGroups.Select(ug => ug.User.Username).ToList(),
                        GroupName = message.Group.GroupName,
                        GroupId = message.GroupId.Value

                    };
                    userList.Add(user);
                } else {
                   var fullUser = await GetUser(idToSend);
                   user = mapper.Map<UserForSendPostDto>(fullUser);

                   userList.Add(user);
                }
            }

            
            return userList;
        }

        public async Task<IList<Notification>> GetNotifications(int userId)
        {
            var notificationQueryable = context.Notifications.Include(n => n.Recipient).Include(n => n.Causer)
                .Include(n => n.Post).Include(n => n.Comment).AsQueryable();

            var notificationsToReturn = await notificationQueryable.Where(n => n.RecipientId == userId).ToListAsync();

            notificationsToReturn = notificationsToReturn.OrderByDescending(n => n.Created).ToList();

            return notificationsToReturn;
        }

        public async Task<int> HasNewMessages(int userId)
        {
            var user = await GetUser(userId);
            int count = 0;
            foreach (var message in user.MessagesReceived) {
                if (!message.IsRead) {
                    count++;
                }
            }

            return count;
        }

        public async Task<int> HasNewNotifications(int userId)
        {
            var user = await GetUser(userId);
            int count = 0;
            foreach (var notification in user.NotificationsReceived) {
                if (!notification.IsRead) {
                    count++;
                }
            }

            return count;
        }

        public async Task<Group> GetGroup(int groupId)
        {
            var group = await context.Groups.Include(g => g.UserGroups)
            .Include(g => g.Messages).ThenInclude(m => m.Sender)
            .Include(g => g.Messages).ThenInclude(m => m.Post).FirstOrDefaultAsync(g => g.Id == groupId);

            return group;
        }

        public async Task<IList<Message>> GetGroupMessageThread(int userId, int groupId)
        {
            var group = await GetGroup(groupId);
            var allMessages = group.Messages.OrderBy(m => m.MessageSent).ToList();
            var messages = new List<Message>();
            DateTime lastTime = new DateTime(1200, 1,1);

            for (int i = 0; i < allMessages.Count; i++) {
                var message = allMessages.ElementAt(i);
                if (i > 0) {
                    lastTime = allMessages.ElementAt(i -1).MessageSent;
                }
                if (message.RecipientId == userId || (message.SenderId == userId && lastTime != message.MessageSent)) {
                    messages.Add(message);
                }
            }

            messages = messages.OrderBy(m => m.MessageSent).ToList();

            return messages;
        }

        public async Task<IList<Post>> GetJoustPosts()
        {
            var allJoustPosts = await context.Posts.Where(p => p.inJoust == true && p.isReported == false).ToListAsync();
            var random = new Random();
            var randomOne = random.Next(0, allJoustPosts.Count);
            var randomTwo = random.Next(0, allJoustPosts.Count);
            while (randomOne == randomTwo) {
                randomTwo = random.Next(0, allJoustPosts.Count);
            }
            var postOne = await GetPost(allJoustPosts[randomOne].Id);
            var postTwo = await GetPost(allJoustPosts[randomTwo].Id);
            var postsToReturn = new List<Post>();
            postsToReturn.Add(postOne);
            postsToReturn.Add(postTwo);
            return postsToReturn;
        }

        public async Task<bool> JoustResult(int winningPostId, int losingPostId)
        {
            var winningPost = GetPost(winningPostId).GetAwaiter().GetResult();
            var losingPost = GetPost(losingPostId).GetAwaiter().GetResult();

            var winnerExpected = (1.0 / (1.0 + Math.Pow(10, ((losingPost.JoustRating - winningPost.JoustRating)/ 400.0))));
            var loserExpected = (1.0 / (1.0 + Math.Pow(10, ((winningPost.JoustRating - losingPost.JoustRating)/ 400.0))));

            var newWinnerRating = (int)Math.Round(winningPost.JoustRating + 25*(1 - winnerExpected));
            var newLoserRating = (int)Math.Round(losingPost.JoustRating + 25*(0 - loserExpected));
            winningPost.JoustRating = newWinnerRating;
            losingPost.JoustRating = newLoserRating;

            return await SaveAll();
        }

        public async Task<Post> GetTopJoustPosts(int index)
        {
            var allJoustPosts = await context.Posts.Where(p => p.inJoust == true).ToListAsync();

            var sortedPosts = allJoustPosts.OrderByDescending(p => p.JoustRating).ToList();

            var postToReturn = await GetPost(sortedPosts[index].Id);

            return postToReturn;
        }

        public async Task<Post> GetSwipePost()
        {
            var allJoustPosts = await context.Posts.Where(p => p.inJoust == true && p.isReported == false).ToListAsync();
            var random = new Random();
            var randomOne = random.Next(0, allJoustPosts.Count);
            var postOne = await GetPost(allJoustPosts[randomOne].Id);
            return postOne;
        }

        public async Task<bool> SwipeResult(int postId, bool liked)
        {
            var post = await GetPost(postId);
            if (liked) {
                post.JoustRating += 10;
            } else {
                post.JoustRating -= 2;
            }
            return await SaveAll();
        }

        public async Task<IList<User>> getAdminUsers()
        {
            var allAdmins = await context.Users.Where(p => p.IsAdmin == true).ToListAsync();
            return allAdmins;
        }

        public async Task<IList<Post>> getReportedPosts()
        {
            var allReportedPosts = await context.Posts.Include(p => p.User).Where(p => p.isReported == true).ToListAsync();
            return allReportedPosts;
        }

        public async Task<IList<User>> getReportedUsers()
        {
            var allReported = await context.Users.Where(p => p.IsReported == true).ToListAsync();
            return allReported;
        }

        public async Task<Reply> GetReply(int replyId)
        {
            return await context.Replies.Include(r => r.LikeList).Include(r => r.Notifications)
                .FirstOrDefaultAsync(r => r.Id == replyId);
        }

        public async Task<ReplyLike> GetReplyLike(int userId, int replyId)
        {
            return await context.ReplyLikes
                .FirstOrDefaultAsync(u => u.LikerId == userId && u.ReplyId == replyId);
        }

        public IEnumerable<Reply> GetReplies(int commentId)
        {
            return context.Replies.Where(c => c.CommentId == commentId).Include(c => c.LikeList);
        }

        public async Task<Block> GetBlock(int blockerId, int blockeeId) {
            return await context.Blocks.FirstOrDefaultAsync(b => b.BlockeeId == blockeeId && b.BlockerId == blockerId);
        }
    }
}