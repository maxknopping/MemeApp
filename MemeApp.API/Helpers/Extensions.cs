using System;
using System.Collections.Generic;
using System.Linq;
using MemeApp.API.Dtos;
using Microsoft.AspNetCore.Http;

namespace MemeApp.API.Helpers
{
    public static class Extensions
    {
        public static void AddApplicationError(this HttpResponse httpResponse, string message) {
            httpResponse.Headers.Add("Application-Error", message);
            httpResponse.Headers.Add("Access-Control-Allow-Origin", "*");
            httpResponse.Headers.Add("Access-Control-Expose-Headers", "Application-Error");
            
        }

        public static int CalculateAge(this DateTime date) {
            var age = DateTime.Today.Year - date.Year;
            if (date.AddYears(age) > DateTime.Today) {
                age --;
            }
            return age;
        }

        public static List<CommentForListDto> SortComments (this List<CommentForListDto> comments) {
            comments = comments.OrderByDescending(c => c.LikeList.Count).ToList();
            return comments;
        }
    }
}