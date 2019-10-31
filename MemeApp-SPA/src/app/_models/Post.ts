import { User } from './User';
import { Like } from './Like';

export interface Post {
    id: number;
    url: string;
    caption: string;
    isProfilePicture: boolean;
    username: string;
    likes: number;
    likeList: Like[];
    dateAdded: Date;
    profilePictureUrl: string;
}
