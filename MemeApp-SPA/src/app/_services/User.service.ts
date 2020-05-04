import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../_models/User';
import { Post } from '../_models/Post';
import { Message } from '../_models/Message';



@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = environment.apiUrl + '/api/users';

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl);
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(this.baseUrl + '/' + id);
  }

  getPost(id: number): Observable<Post> {
    return this.http.get<Post>(`${this.baseUrl}/post/${id}`);
  }

  getUserByUsername(username: string): Observable<User> {
    return this.http.get<User>(this.baseUrl + '/username/' + username);
  }

  getFeed(username, index): Observable<Post> {
    return this.http.get<Post>(this.baseUrl + '/feed/' + username + `/${index}`);
  }

  getFeatured(index): Observable<Post> {
    return this.http.get<Post>(this.baseUrl + '/featured' + `/${index}`);
  }

  updateUser(id: number, user: User) {
    return this.http.put(this.baseUrl + '/' + id, user);
  }

  deletePost(userId: number, postId: number) {
    return this.http.delete(this.baseUrl + '/' + userId + '/posts/' + postId);
  }

  followUser(id: number, recipientId: number) {
    return this.http.post(`${this.baseUrl}/${id}/follow/${recipientId}`, {});
  }

  unfollowUser(id: number, recipientId: number) {
    return this.http.post(`${this.baseUrl}/${id}/unfollow/${recipientId}`, {});
  }

  getFollowers(username: string, userId: number) {
    return this.http.get(`${this.baseUrl}/${userId}/followers/${username}`);
  }

  getFollowing(username: string, userId: number) {
    return this.http.get(`${this.baseUrl}/${userId}/following/${username}`);
  }

  likePost(id: number, recipientId: number) {
    return this.http.post(`${this.baseUrl}/${id}/like/${recipientId}`, {});
  }

  unLikePost(id: number, recipientId: number) {
    return this.http.post(`${this.baseUrl}/${id}/unlike/${recipientId}`, {});
  }

  getLikers(postId, userId) {
    return this.http.get(`${this.baseUrl}/${userId}/likers/${postId}`);
  }

  getCommentLikers(commentId, userId) {
    return this.http.get(`${this.baseUrl}/${userId}/commentLikers/${commentId}`);
  }

  sendComment(comment, postId, commenterId) {
    commenterId = +commenterId;
    return this.http.post(`${this.baseUrl}/comment`,
    {
      postId: postId,
      text: comment,
      commenterId: commenterId
    });
  }

  getComments(postId) {
    return this.http.get(`${this.baseUrl}/comments/${postId}`);
  }

  likeComment(commenterId, postId, commentId) {
    return this.http.post(`${this.baseUrl}/${commenterId}/comment/like/${commentId}/${postId}`, {});
  }

  unlikeComment(commenterId, postId, commentId) {
    return this.http.post(`${this.baseUrl}/${commenterId}/comment/unlike/${commentId}/${postId}`, {});
  }

  deleteComment(commentId) {
    return this.http.delete(`${this.baseUrl}/${commentId}/deleteComment`);
  }

  getMessages(id: number) {
    return this.http.get(`${this.baseUrl}/${id}/messages`);
  }

  getMessageThread(id: number, recipientId: number) {
    return this.http.get<Message[]>(`${this.baseUrl}/${id}/messages/thread/${recipientId}`);
  }

  getGroupMessageThread(id: number, recipientId: number) {
    return this.http.get<Message[]>(`${this.baseUrl}/${id}/messages/thread/group/${recipientId}`);
  }

  createGroup(userId: number, groupName: string, message: string, userIds: number[]) {
    return this.http.post(`${this.baseUrl}/${userId}/messages/group`, {
      groupName,
      message,
      userIds
    });
  }

  updateGroup(userId: number, groupName: number, groupId: number, usersToAdd: number[], 
              usersToRemove: number[]) {
    return this.http.put(`${this.baseUrl}/${userId}/messages/group`, {
        groupName,
        groupId,
        usersToAdd,
        usersToRemove
    });
  }

  getGroupUsers(userId: number, groupId: number) {
    return this.http.get(`${this.baseUrl}/${userId}/group/${groupId}`);
  }

  sendMessage(id: number, message: Message) {
    return this.http.post(`${this.baseUrl}/${id}/messages`, message);
  }

  sendGroupMessage(id: number, groupId: number, message) {
    return this.http.post(`${this.baseUrl}/${id}/messages/group/${groupId}`, message);
  }

  sendMessageWithPost(id: number, message) {
    return this.http.post(`${this.baseUrl}/${id}/messages/withPost`, message);
  }

  deleteMessage(id: number, userId: number) {
    return this.http.post(`${this.baseUrl}/${userId}/messages/${id}`, {});
  }

  markAsRead(id: number, userId: number) {
    return this.http.post(`${this.baseUrl}/${userId}/messages/${id}/read`, {}).subscribe();
  }

  searchForUser(userId: number, query: string, fullResult: boolean) {
    return this.http.get(`${this.baseUrl}/search/${userId}/${query}/${fullResult}`);
  }

  getNotifications(userId: number) {
    return this.http.get(`${this.baseUrl}/notifications/${userId}`);
  }

  markNotificationsAsRead(userId: number) {
    return this.http.post(`${this.baseUrl}/notifications/${userId}/read`, {});
  }

}
