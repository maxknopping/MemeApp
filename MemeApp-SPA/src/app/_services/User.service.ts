import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../_models/User';
import { Post } from '../_models/Post';



@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = environment.apiUrl + "/api/users";

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

  getFeed(username): Observable<Post[]> {
    return this.http.get<Post[]>(this.baseUrl + '/feed/' + username);
  } 

  like(username, userWhoLiked, postId, unLike): Observable<Post> {
    return this.http.post<Post>(this.baseUrl + '/post/like/' + username + '/' + userWhoLiked + '/' + postId + '/' + unLike, {});
  }
 
}
