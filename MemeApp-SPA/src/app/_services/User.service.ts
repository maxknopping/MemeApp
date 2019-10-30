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

  getFollowers(username: string) {
    return this.http.get(`${this.baseUrl}/followers/${username}`);
  }

getFollowing(username: string) {
    return this.http.get(`${this.baseUrl}/following/${username}`);
  }
 
}
