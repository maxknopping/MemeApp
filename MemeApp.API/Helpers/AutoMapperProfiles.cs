using System.Linq;
using AutoMapper;
using MemeApp.API.Dtos;
using MemeApp.API.Models;

namespace MemeApp.API.Helpers
{
    public class AutoMapperProfiles: Profile
    {
        public AutoMapperProfiles() {
            CreateMap<User, UserForListDto>()
                .ForMember(dest => dest.Age, opt => opt.MapFrom(src => src.DateOfBirth.CalculateAge()));
            CreateMap<User, UserForDetailedDto>().ForMember(dest => dest.Age, opt => opt.MapFrom(src => src.DateOfBirth.CalculateAge()));
            CreateMap<Post, PostForDetailedDto>().ForMember(dest => dest.Username, opt => opt
                .MapFrom(src => src.User.Username)).ForMember(dest => dest.ProfilePictureUrl, opt => opt
                .MapFrom(src => src.User.PhotoUrl));
            CreateMap<UserForEditDto, User>();
            CreateMap<Post, PostToReturnDto>();
            CreateMap<PostForCreationDto, Post>();
            CreateMap<PostForUpdateDto, Post>();
            CreateMap<UserForRegisterDto, User>();
            CreateMap<Follow, FollowForDetailedDto>();
            CreateMap<Like, LikeDto>();
            CreateMap<CommentForCreationDto, Comment>();
            CreateMap<Comment, CommentForListDto>();
            CreateMap<CommentLike, CommentLikeDto>();

        }
    }
}