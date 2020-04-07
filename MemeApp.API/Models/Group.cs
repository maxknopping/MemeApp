using System.Collections.Generic;

namespace MemeApp.API.Models
{
    public class Group
    {
        public int Id { get; set; }

        public string GroupName { get; set; }

        public IList<Message> Messages { get; set; }

        public IList<UserGroup> UserGroups { get; set; }
    }
}