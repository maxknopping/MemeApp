using MemeApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace MemeApp.API.Data
{
    public class DataContext: DbContext
    {

        public DataContext(DbContextOptions<DataContext> options): base(options)
        {
            
        }


        public DbSet<Value> Values { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Post> Posts { get; set; }
        public DbSet<Follow> Follows { get; set; }
        public DbSet<Like> Likes { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<CommentLike> CommentLikes { get; set; }

        public DbSet<Message> Messages { get; set; }

        protected override void OnModelCreating(ModelBuilder builder) {
            builder.Entity<Follow>().HasKey(p => new {p.FollowerId, p.FolloweeId});

            builder.Entity<Follow>().Property(p => p.FolloweeId).ValueGeneratedNever();
            builder.Entity<Follow>().Property(p => p.FollowerId).ValueGeneratedNever();

            builder.Entity<Follow>()
                .HasOne(u => u.Follower)
                .WithMany(u => u.Following)
                .HasForeignKey(u => u.FollowerId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Follow>()
                .HasOne(u => u.Followee)
                .WithMany(u => u.Followers)
                .HasForeignKey(u => u.FolloweeId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Like>().HasKey(k => new {k.LikerId, k.PostId});

            builder.Entity<Like>()
                .HasOne(u => u.Post)
                .WithMany(p => p.LikeList)
                .HasForeignKey(u => u.PostId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Comment>().Property(p => p.Id).ValueGeneratedOnAdd();
            
            builder.Entity<Comment>()
                .HasOne(u => u.Post)
                .WithMany(p => p.Comments)
                .HasForeignKey(u => u.PostId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<CommentLike>().HasKey(k => new {k.CommenterId, k.CommentId});

            builder.Entity<CommentLike>()
                .HasOne(u => u.Comment)
                .WithMany(p => p.LikeList)
                .HasForeignKey(u => u.CommentId)
                .OnDelete(DeleteBehavior.Restrict);


            builder.Entity<Message>()
                .HasOne(u => u.Sender)
                .WithMany(m => m.MessagesSent)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Message>()
                .HasOne(u => u.Recipient)
                .WithMany(m => m.MessagesReceived)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Message>()
                .HasOne(m => m.Post)
                .WithMany(p => p.MessagesSent)
                .OnDelete(DeleteBehavior.Restrict)
                .IsRequired(false);
        }
    }
}
