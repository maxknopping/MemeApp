using System;
using System.Collections.Generic;
using MemeApp.API.Models;

namespace MemeApp.API.Dtos
{
    public class PostForUpdateDto
    {
        public string Caption { get; set; }
        
         public IList<Comment> Comments {get; set; }

         public int Likes { get; set; }

    }
}