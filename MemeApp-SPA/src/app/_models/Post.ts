import { User } from './User';

export interface Post {
    id: number;
    url: string;
    caption: string;
    isProfilePicture: boolean;
    username: string;
    likes: number;
    dateAdded: Date;
}
