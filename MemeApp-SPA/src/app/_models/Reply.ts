import { ReplyLike } from './ReplyLike';

export interface Reply {
    id: number;
    text: string;
    likes: number;
    commenterId: number;
    likeList: ReplyLike[];
    created: Date;
    postId: number;
    commentId: number;
    username: string;
    photoUrl: string;
    liked: boolean;
    deleteable: boolean;
}