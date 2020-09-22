using System;

namespace MemeApp.API.Models
{
    public class Notification
    {
        public int Id { get; set; }
        public int RecipientId { get; set; }

        public User Recipient { get; set; }

        public int CauserId { get; set; }

        public User Causer { get; set; }

        public DateTime Created { get; set; }

        public bool IsRead { get; set; }

        public string Message { get; set; }

        public string GroupName { get; set; }

        public Post Post { get; set; }

        public int? PostId { get; set; }

        public Comment Comment { get; set; }

        public int? CommentId { get; set; }

        public Reply Reply { get; set; }

        public int? ReplyId { get; set; }

        public bool Followed { get; set; }

        public string Type { get; set; }

        public Notification(string type) {
            this.Type = type.ToLower();
            Created = DateTime.Now;
            switch (this.Type) {
                case "message": 
                    this.Message = "sent you a message: ";
                    break;
                case "groupmessage":
                    this.Message = "sent a message in: ";
                    break;
                case "comment":
                    this.Message = $"commented on your post: ";
                    break;
                case "tag":
                    this.Message = $"tagged you in a comment: ";
                    break;
                case "like":
                    this.Message = "liked your post:";
                    break;
                case "commentlike":
                    this.Message = "liked your comment: ";
                    break;
                case "follow":
                    this.Message = "followed you.";
                    this.Followed = true;
                    break;
                case "updateuser":
                    this.Message = "Your account was flagged as being inappropriate and we changed your profile. You are at risk for your account being deleted or banned.";
                    break;
                case "reply": 
                    this.Message = "replied to your comment: ";
                    break;
                default: 
                    this.Message = "";
                    break;

            }
        }
    }
}