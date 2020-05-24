import { Post } from './Post';

export interface Message {
    id: number;
    senderId: number;
    senderUsername: string;
    senderPhotoUrl: string;
    recipientId: number;
    recipientUsername: string;
    recipientPhotoUrl: string;
    content: string;
    isRead: boolean;
    dateRead: Date;
    messageSent: string;
    post?: Post;
    postId?: number;
    groupId?: number;
    groupPhotoUrls?: Array<GroupPhotoUrl>;
    groupName?: string;
}