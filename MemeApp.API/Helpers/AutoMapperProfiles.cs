using System.Linq;
using AutoMapper;
using MemeApp.API.Dtos;
using MemeApp.API.Models;

namespace MemeApp.API.Helpers
{
    public class AutoMapperProfiles: Profile
    {
        public AutoMapperProfiles() {
            CreateMap<User, UserForListDto>().ForMember(dest => dest.PhotoUrl, opt => opt.MapFrom(src =>
                src.Posts.FirstOrDefault(x => x.IsProfilePicture).Url))
                .ForMember(dest => dest.Age, opt => opt.MapFrom(src => src.DateOfBirth.CalculateAge()));
            CreateMap<User, UserForDetailedDto>().ForMember(dest => dest.PhotoUrl, opt => opt.MapFrom(src =>
                src.Posts.FirstOrDefault(x => x.IsProfilePicture).Url))
                .ForMember(dest => dest.Age, opt => opt.MapFrom(src => src.DateOfBirth.CalculateAge()));
            CreateMap<Post, PostForDetailedDto>().ForMember(dest => dest.Username, opt => opt
                .MapFrom(src => src.User.Username));

        }
    }
}