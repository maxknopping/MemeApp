import { User } from './User';
import { Liker } from './Liker';

export interface Post {
    id: number;
    url: string;
    caption: string;
    isProfilePicture: boolean;
    username: string;
    likes: number;
    likers: Liker[];
    dateAdded: Date;
    profilePictureUrl: string;
}
