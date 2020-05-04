
export interface Notification {
    id: number;
    recipientId: number;
    causerId: number;
    causerUsername: string;
    causerPhotoUrl: string;
    created: Date;
    isRead: boolean;
    message: string;
    postUrl: string;
    commentText: string;
    commentId?: number;
    followed: boolean;
    type: string;
}