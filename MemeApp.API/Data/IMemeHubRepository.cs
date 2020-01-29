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

         Task<PostForDetailedDto> GetFeed(User user, int index);

         Task<PostForDetailedDto> GetFeatured(int index);

         Task<Post> GetPost(int id);

         Task<Follow> GetFollow(int userId, int recipientId);

         Task<Like> GetLike(int userId, int postId);

         IEnumerable<Comment> GetComments(int postId);

         Task<Comment> GetComment(int commentId);

         Task<CommentLike> GetCommentLike(int userId, int commentId);





    }
}