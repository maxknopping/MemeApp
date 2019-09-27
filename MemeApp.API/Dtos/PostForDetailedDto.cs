using System;
using System.Collections.Generic;
using MemeApp.API.Models;

namespace MemeApp.API.Dtos
{
    public class PostForDetailedDto
    {
        public int Id { get; set; }

        public string Url { get; set; }

        public string Caption { get; set; }

        public IList<Comment> Comments {get; set; }

        public int Likes { get; set; }

        public bool IsMain { get; set; }

        public DateTime Created { get; set; }

    }
}