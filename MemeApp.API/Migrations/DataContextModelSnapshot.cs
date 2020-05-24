﻿// <auto-generated />
using System;
using MemeApp.API.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace MemeApp.API.Migrations
{
    [DbContext(typeof(DataContext))]
    partial class DataContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.1.11-servicing-32099");

            modelBuilder.Entity("MemeApp.API.Models.Comment", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("CommenterId");

                    b.Property<DateTime>("Created");

                    b.Property<int>("Likes");

                    b.Property<int>("PostId");

                    b.Property<string>("Text");

                    b.HasKey("Id");

                    b.HasIndex("PostId");

                    b.ToTable("Comments");
                });

            modelBuilder.Entity("MemeApp.API.Models.CommentLike", b =>
                {
                    b.Property<int>("CommenterId");

                    b.Property<int>("CommentId");

                    b.Property<int>("PostId");

                    b.HasKey("CommenterId", "CommentId");

                    b.HasIndex("CommentId");

                    b.HasIndex("PostId");

                    b.ToTable("CommentLikes");
                });

            modelBuilder.Entity("MemeApp.API.Models.Follow", b =>
                {
                    b.Property<int>("FollowerId");

                    b.Property<int>("FolloweeId");

                    b.HasKey("FollowerId", "FolloweeId");

                    b.HasIndex("FolloweeId");

                    b.ToTable("Follows");
                });

            modelBuilder.Entity("MemeApp.API.Models.Group", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("GroupName");

                    b.HasKey("Id");

                    b.ToTable("Groups");
                });

            modelBuilder.Entity("MemeApp.API.Models.Like", b =>
                {
                    b.Property<int>("LikerId");

                    b.Property<int>("PostId");

                    b.HasKey("LikerId", "PostId");

                    b.HasIndex("PostId");

                    b.ToTable("Likes");
                });

            modelBuilder.Entity("MemeApp.API.Models.Message", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Content");

                    b.Property<DateTime?>("DateRead");

                    b.Property<int?>("GroupId");

                    b.Property<bool>("IsRead");

                    b.Property<DateTime>("MessageSent");

                    b.Property<int?>("PostId");

                    b.Property<bool>("RecipientDeleted");

                    b.Property<int>("RecipientId");

                    b.Property<bool>("SenderDeleted");

                    b.Property<int>("SenderId");

                    b.Property<bool>("SenderReadReceipts");

                    b.HasKey("Id");

                    b.HasIndex("GroupId");

                    b.HasIndex("PostId");

                    b.HasIndex("RecipientId");

                    b.HasIndex("SenderId");

                    b.ToTable("Messages");
                });

            modelBuilder.Entity("MemeApp.API.Models.Notification", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("CauserId");

                    b.Property<int?>("CommentId");

                    b.Property<DateTime>("Created");

                    b.Property<bool>("Followed");

                    b.Property<bool>("IsRead");

                    b.Property<string>("Message");

                    b.Property<int?>("PostId");

                    b.Property<int>("RecipientId");

                    b.Property<string>("Type");

                    b.HasKey("Id");

                    b.HasIndex("CauserId");

                    b.HasIndex("CommentId");

                    b.HasIndex("PostId");

                    b.HasIndex("RecipientId");

                    b.ToTable("Notifications");
                });

            modelBuilder.Entity("MemeApp.API.Models.Post", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Caption");

                    b.Property<DateTime>("Created");

                    b.Property<bool>("IsProfilePicture");

                    b.Property<int>("JoustRating");

                    b.Property<int>("Likes");

                    b.Property<string>("PublicId");

                    b.Property<string>("Url");

                    b.Property<int>("UserId");

                    b.Property<bool>("inJoust");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("Posts");
                });

            modelBuilder.Entity("MemeApp.API.Models.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Bio");

                    b.Property<DateTime>("Created");

                    b.Property<string>("Email");

                    b.Property<bool>("IsAdmin");

                    b.Property<DateTime>("LastActive");

                    b.Property<string>("Name");

                    b.Property<byte[]>("PasswordHash");

                    b.Property<byte[]>("PasswordSalt");

                    b.Property<string>("PhotoUrl");

                    b.Property<string>("PublicIdForPhoto");

                    b.Property<string>("PushToken");

                    b.Property<string>("Username");

                    b.HasKey("Id");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("MemeApp.API.Models.UserGroup", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("GroupId");

                    b.Property<int>("UserId");

                    b.Property<string>("UserPhotoUrl");

                    b.HasKey("Id");

                    b.HasIndex("GroupId");

                    b.HasIndex("UserId");

                    b.ToTable("UserGroups");
                });

            modelBuilder.Entity("MemeApp.API.Models.Value", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Name");

                    b.HasKey("Id");

                    b.ToTable("Values");
                });

            modelBuilder.Entity("MemeApp.API.Models.Comment", b =>
                {
                    b.HasOne("MemeApp.API.Models.Post", "Post")
                        .WithMany("Comments")
                        .HasForeignKey("PostId")
                        .OnDelete(DeleteBehavior.Restrict);
                });

            modelBuilder.Entity("MemeApp.API.Models.CommentLike", b =>
                {
                    b.HasOne("MemeApp.API.Models.Comment", "Comment")
                        .WithMany("LikeList")
                        .HasForeignKey("CommentId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("MemeApp.API.Models.User", "Commenter")
                        .WithMany()
                        .HasForeignKey("CommenterId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("MemeApp.API.Models.Post", "Post")
                        .WithMany()
                        .HasForeignKey("PostId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("MemeApp.API.Models.Follow", b =>
                {
                    b.HasOne("MemeApp.API.Models.User", "Followee")
                        .WithMany("Followers")
                        .HasForeignKey("FolloweeId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("MemeApp.API.Models.User", "Follower")
                        .WithMany("Following")
                        .HasForeignKey("FollowerId")
                        .OnDelete(DeleteBehavior.Restrict);
                });

            modelBuilder.Entity("MemeApp.API.Models.Like", b =>
                {
                    b.HasOne("MemeApp.API.Models.User", "Liker")
                        .WithMany()
                        .HasForeignKey("LikerId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("MemeApp.API.Models.Post", "Post")
                        .WithMany("LikeList")
                        .HasForeignKey("PostId")
                        .OnDelete(DeleteBehavior.Restrict);
                });

            modelBuilder.Entity("MemeApp.API.Models.Message", b =>
                {
                    b.HasOne("MemeApp.API.Models.Group", "Group")
                        .WithMany("Messages")
                        .HasForeignKey("GroupId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("MemeApp.API.Models.Post", "Post")
                        .WithMany("MessagesSent")
                        .HasForeignKey("PostId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("MemeApp.API.Models.User", "Recipient")
                        .WithMany("MessagesReceived")
                        .HasForeignKey("RecipientId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("MemeApp.API.Models.User", "Sender")
                        .WithMany("MessagesSent")
                        .HasForeignKey("SenderId")
                        .OnDelete(DeleteBehavior.Restrict);
                });

            modelBuilder.Entity("MemeApp.API.Models.Notification", b =>
                {
                    b.HasOne("MemeApp.API.Models.User", "Causer")
                        .WithMany("NotificationsCaused")
                        .HasForeignKey("CauserId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("MemeApp.API.Models.Comment", "Comment")
                        .WithMany("Notifications")
                        .HasForeignKey("CommentId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("MemeApp.API.Models.Post", "Post")
                        .WithMany("Notifications")
                        .HasForeignKey("PostId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("MemeApp.API.Models.User", "Recipient")
                        .WithMany("NotificationsReceived")
                        .HasForeignKey("RecipientId")
                        .OnDelete(DeleteBehavior.Restrict);
                });

            modelBuilder.Entity("MemeApp.API.Models.Post", b =>
                {
                    b.HasOne("MemeApp.API.Models.User", "User")
                        .WithMany("Posts")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("MemeApp.API.Models.UserGroup", b =>
                {
                    b.HasOne("MemeApp.API.Models.Group", "Group")
                        .WithMany("UserGroups")
                        .HasForeignKey("GroupId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("MemeApp.API.Models.User", "User")
                        .WithMany("UserGroups")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict);
                });
#pragma warning restore 612, 618
        }
    }
}
