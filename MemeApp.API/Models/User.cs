using System;
using System.Collections;
using System.Collections.Generic;

namespace MemeApp.API.Models
{
    public class User
    {
        public int Id { get; set; }

        public string Username { get; set; }

        public byte[] PasswordHash { get; set; }

        public byte[] PasswordSalt {get; set; }

        public string PhotoUrl { get; set; }

        public string PublicIdForPhoto { get; set; }

        public string Email { get; set; }

        public DateTime Created { get; set; }

        public DateTime LastActive { get; set; }

        public IList<Follow> Followers { get; set; }

        public IList<Follow> Following { get; set; }

        public string Bio { get; set; }

        public string Name { get; set; }

        public IList<Post> Posts { get; set; }

        public IList<Message> MessagesSent { get; set; }

        public IList<Message> MessagesReceived { get; set; }

        public IList<Notification> NotificationsCaused { get; set; }

        public  IList<Notification> NotificationsReceived { get; set; }

        public IList<UserGroup> UserGroups { get; set; }

        public string PushToken { get; set; }

    }
}