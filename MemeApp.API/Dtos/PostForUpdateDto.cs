using System;
using System.Collections.Generic;
using MemeApp.API.Models;

namespace MemeApp.API.Dtos
{
    public class PostForUpdateDto
    {
        public string Caption { get; set; }

        public bool InJoust { get; set; }

    }
}