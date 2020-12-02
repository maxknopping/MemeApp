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

        public DbSet<Notification> Notifications { get; set; }

        public DbSet<UserGroup> UserGroups { get; set; }

        public DbSet<Group> Groups { get; set; }

        public DbSet<Reply> Replies { get; set; }

        public DbSet<ReplyLike> ReplyLikes { get; set; }

        public DbSet<Block> Blocks { get; set; }

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
            
            builder.Entity<Block>().HasKey(p => new {p.BlockerId, p.BlockeeId});

            builder.Entity<Block>().Property(p => p.BlockeeId).ValueGeneratedNever();
            builder.Entity<Block>().Property(p => p.BlockerId).ValueGeneratedNever();

            builder.Entity<Block>()
                .HasOne(u => u.Blocker)
                .WithMany(u => u.Blockees)
                .HasForeignKey(u => u.BlockerId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Block>()
                .HasOne(u => u.Blockee)
                .WithMany(u => u.Blockers)
                .HasForeignKey(u => u.BlockeeId)
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

            builder.Entity<Reply>().Property(p => p.Id).ValueGeneratedOnAdd();
            
            builder.Entity<Reply>()
                .HasOne(u => u.Comment)
                .WithMany(p => p.Replies)
                .HasForeignKey(u => u.CommentId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<CommentLike>().HasKey(k => new {k.CommenterId, k.CommentId});

            builder.Entity<CommentLike>()
                .HasOne(u => u.Comment)
                .WithMany(p => p.LikeList)
                .HasForeignKey(u => u.CommentId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<ReplyLike>().HasKey(k => new {k.LikerId, k.ReplyId});

            builder.Entity<ReplyLike>()
                .HasOne(u => u.Reply)
                .WithMany(p => p.LikeList)
                .HasForeignKey(u => u.ReplyId)
                .OnDelete(DeleteBehavior.Restrict);


            builder.Entity<Message>()
                .HasOne(u => u.Sender)
                .WithMany(m => m.MessagesSent)
                .HasForeignKey(u => u.SenderId)
                .OnDelete(DeleteBehavior.Restrict);


            builder.Entity<Message>()
                .HasOne(u => u.Recipient)
                .WithMany(m => m.MessagesReceived)
                .HasForeignKey(u => u.RecipientId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Message>()
                .HasOne(m => m.Post)
                .WithMany(p => p.MessagesSent)
                .OnDelete(DeleteBehavior.Restrict)
                .IsRequired(false);

            builder.Entity<Message>()
                .HasOne(m => m.Group)
                .WithMany(p => p.Messages)
                .OnDelete(DeleteBehavior.Restrict)
                .HasForeignKey(m => m.GroupId)
                .IsRequired(false);

            builder.Entity<UserGroup>()
                .HasOne(ug => ug.Group)
                .WithMany(g => g.UserGroups)
                .HasForeignKey(ug => ug.GroupId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<UserGroup>()
                .HasOne(ug => ug.User)
                .WithMany(g => g.UserGroups)
                .HasForeignKey(ug => ug.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Notification>()
                .HasOne(n => n.Causer)
                .WithMany(u => u.NotificationsCaused)
                .HasForeignKey(n => n.CauserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Notification>()
                .HasOne(n => n.Recipient)
                .WithMany(u => u.NotificationsReceived)
                .HasForeignKey(n => n.RecipientId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Notification>()
                .HasOne(n => n.Comment)
                .WithMany(c => c.Notifications)
                .HasForeignKey(n => n.CommentId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Notification>()
                .HasOne(n => n.Post)
                .WithMany(c => c.Notifications)
                .HasForeignKey(n => n.PostId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Notification>()
                .HasOne(n => n.Reply)
                .WithMany(c => c.Notifications)
                .HasForeignKey(n => n.ReplyId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
