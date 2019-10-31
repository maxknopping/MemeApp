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

        protected override void OnModelCreating(ModelBuilder builder) {
            builder.Entity<Follow>().HasKey(k => new {k.FollowerId, k.FolloweeId});

            builder.Entity<Follow>()
                .HasOne(u => u.Followee)
                .WithMany(u => u.Followers)
                .HasForeignKey(u => u.FolloweeId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Follow>()
                .HasOne(u => u.Follower)
                .WithMany(u => u.Following)
                .HasForeignKey(u => u.FollowerId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Like>().HasKey(k => new {k.LikerId, k.PostId});

            builder.Entity<Like>()
                .HasOne(u => u.Post)
                .WithMany(p => p.LikeList)
                .HasForeignKey(u => u.PostId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
