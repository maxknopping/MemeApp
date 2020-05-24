import { User } from './User';
import { Like } from './Like';
import { Comment} from './Comment';

export interface Post {
    id: number;
    url: string;
    caption: string;
    isProfilePicture: boolean;
    username: string;
    likes: number;
    likeList: Like[];
    comments: Comment[];
    created: any;
    profilePictureUrl: string;
    inJoust: boolean;
    joustRating: number;
}
