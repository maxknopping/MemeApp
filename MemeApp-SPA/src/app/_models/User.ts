import { Post } from './Post';

export interface User {
    id: number;
    username: string;
    knownAs: string;
    gender: string;
    created: Date;
    lastActive: Date;
    photoUrl: string;
    bio?: string;
    posts: Post[];
}
