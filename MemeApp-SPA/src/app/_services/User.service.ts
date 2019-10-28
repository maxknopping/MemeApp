import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../_models/User';
import { Post } from '../_models/Post';
import { Liker } from '../_models/Liker';



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

  getUserByUsername(username: string): Observable<User> {
    return this.http.get<User>(this.baseUrl + '/username/' + username);
  }

  getFeed(username, index): Observable<Post> {
    return this.http.get<Post>(this.baseUrl + '/feed/' + username + `/${index}`);
  } 

  like(username, userWhoLiked, postId, unLike): Observable<Post> {
    return this.http.post<Post>(this.baseUrl + '/post/like/' + username + '/' + userWhoLiked + '/' + postId + '/' + unLike, {});
  }

  updateUser(id: number, user: User) {
    return this.http.put(this.baseUrl + '/' + id, user);
  }

  deletePost(userId: number, postId: number) {
    return this.http.delete(this.baseUrl + '/' + userId + '/posts/' + postId);
  }

  likePost(post: Post, userId: number, username: string) {
    post.likes++;
    const liker: Liker = {
      username: username,
      postId: post.id,
      likerId: userId
    };
    post.likers.push(liker);
    return this.http.put(`${this.baseUrl}/${userId}/posts/${post.id}`, post);
  }
 
}
