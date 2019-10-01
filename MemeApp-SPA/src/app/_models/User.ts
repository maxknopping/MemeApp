import { Post } from './Post';
import { Followee } from './Followee';

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
    followers: Followee[];
}
