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
            CreateMap<Message, MessageForListDto>().ForMember(dest => dest.GroupName, opt =>
                opt.MapFrom(src => src.Group.GroupName)).ForMember(dest => dest.GroupPhotoUrls, opt =>
                opt.MapFrom(src => src.Group.UserGroups.Select(ug => 
                new {id = ug.UserId, photoUrl =  ug.UserPhotoUrl})));
            CreateMap<User, UserForManipulationDto>();
            CreateMap<UserForManipulationDto, UserForListDto>();
            CreateMap<MessageForCreationPostDto, Message>();
            CreateMap<Notification, NotificationForListDto>().ForMember(n => n.CauserUsername, opt => 
                opt.MapFrom(src => src.Causer.Username)).ForMember(n => n.PostUrl, opt => 
                opt.MapFrom(src => src.Post.Url)).ForMember(n => n.CommentText, opt => 
                opt.MapFrom(src => src.Comment.Text)).ForMember(n => n.CauserPhotoUrl, opt => 
                opt.MapFrom(src => src.Causer.PhotoUrl));
            CreateMap<MessageGroupForCreationDto, Message>();
            CreateMap<User, UserForSendPostDto>();
            CreateMap<User, UserForReportDto>();

        }
    }
}