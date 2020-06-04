import { Post } from './Post';
import { Follow } from './Follow';

export interface User {
    id: number;
    username: string;
    email: string;
    name: string;
    created: Date;
    lastActive: Date;
    photoUrl?: string;
    bio?: string;
    posts: Post[];
    followers: Follow[];
    following: Follow[];
    followButton?: string;
    isAdmin?: boolean;
    reportedCount?: number;
    reportedPostCount?: number;
    isBanned?: boolean;
    banEnds?: any;
}
