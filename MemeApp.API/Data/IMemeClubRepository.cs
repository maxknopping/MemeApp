using System.Collections.Generic;
using System.Threading.Tasks;
using MemeApp.API.Dtos;
using MemeApp.API.Models;

namespace MemeApp.API.Data
{
    public interface IMemeClubRepository
    {
         void Add<T>(T entity) where T:class;

         void Delete<T>(T entity) where T:class;

         Task<bool> SaveAll();
         Task<IEnumerable<User>> GetUsers();

         Task<User> GetUser(int id);

         Task<User> GetUser(string username);

         Task<PostForDetailedDto> GetFeed(User user, int index);

         Task<PostForDetailedDto> GetFeatured(int id, int index);

         Task<Post> GetPost(int id);

         Task<Follow> GetFollow(int userId, int recipientId);

         Task<Like> GetLike(int userId, int postId);

         IEnumerable<Comment> GetComments(int postId);

         Task<Comment> GetComment(int commentId);

         IEnumerable<Reply> GetReplies(int commentId);

         Task<Reply> GetReply(int replyId);

         Task<ReplyLike> GetReplyLike(int userId, int replyId);

         Task<CommentLike> GetCommentLike(int userId, int commentId);

         Task<Message> GetMessage(int id);

         Task<IList<Message>> GetConversationListForUser(int userId);

         Task<IList<UserForSendPostDto>> GetConversationUsers(int userId);
         Task<IList<Message>> GetMessageThread(int userId, int recipientId);

        Task<IList<User>> SearchForUser(int id, string query, bool fullResult);

        Task<IList<Notification>> GetNotifications(int userId);

        Task<int> HasNewMessages(int userId);

        Task<int> HasNewNotifications(int userId);

        Task<Group> GetGroup(int groupId);

        Task<IList<Message>> GetGroupMessageThread(int userId, int groupId);

        Task<IList<Post>> GetJoustPosts();

        Task<bool> JoustResult(int winningPostId, int losingPostId);

        Task<Post> GetTopJoustPosts(int index);

        Task<Post> GetSwipePost();

        Task<bool> SwipeResult(int postId, bool liked);

        Task<IList<User>> getAdminUsers();

        Task<IList<User>> getReportedUsers();

        Task<IList<Post>> getReportedPosts();

        Task<Block> GetBlock(int blockerId, int blockeeId);

    }
}