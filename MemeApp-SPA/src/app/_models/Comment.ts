import { User } from './User';
import { Like } from './Like';
import { Post } from './Post';
import { CommentLike } from './CommentLike';


export interface Comment {
    id: number;
    text: string;
    likes: number;
    commenterId: number;
    created: Date;
    postId: number;
    username: string;
    photoUrl: string;
    likeList: CommentLike[];
    liked: boolean;
}
