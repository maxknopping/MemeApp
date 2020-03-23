using System.Linq;
using AutoMapper;
using MemeApp.API.Dtos;
using MemeApp.API.Models;

namespace MemeApp.API.Helpers
{
    public class AutoMapperProfiles: Profile
    {
        public AutoMapperProfiles() {
            CreateMap<User, UserForListDto>();
            CreateMap<User, UserForDetailedDto>().ForMember(dest => dest.Posts, opt => 
                opt.MapFrom(src => src.Posts.OrderByDescending(p => p.Created)));
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
            CreateMap<Comment, CommentForListDto>().ForMember(dest => dest.PhotoUrl, opt => 
                opt.MapFrom(src => src.Post.User.PhotoUrl)).ForMember(dest => dest.Username, opt => 
                opt.MapFrom(src => src.Post.User.Username));
            CreateMap<CommentLike, CommentLikeDto>();
            CreateMap<MessageForCreationDto, Message>().ReverseMap();
            CreateMap<Message, MessageForListDto>();
            CreateMap<User, UserForManipulationDto>();
            CreateMap<UserForManipulationDto, UserForListDto>();

        }
    }
}