import { User } from './User';
import { Like } from './Like';
import { Post } from './Post';
import { CommentLike } from './CommentLike';
import { Reply } from './Reply';


export interface Comment {
    id: number;
    text: string;
    likes: number;
    commenterId: number;
    created: Date;
    postId: number;
    username: string;
    creatorId: number;
    photoUrl: string;
    likeList: CommentLike[];
    replies: Reply[];
    liked: boolean;
    deleteable: boolean;
    replying: boolean;
    replyText: string;
}
