import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { logging } from 'protractor';
import { map } from 'rxjs/operators';
import {JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { User } from '../_models/User';
import { BehaviorSubject, Observable } from 'rxjs';
import { Post } from '../_models/Post';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = environment.apiUrl + '/api/auth/';
  jwtHelper = new JwtHelperService();
  decodedToken: any;
  currentUser: User;
  photoUrl = new BehaviorSubject<string>('../../assets/user.png');
  currentPhotoUrl = this.photoUrl.asObservable();

  constructor(private http: HttpClient) { }



  login(model: any) {
    return this.http.post(this.baseUrl + 'login', model)
      .pipe(
        map((response: any) => {
          const user = response;
          localStorage.setItem('token', user.token);
          localStorage.setItem('user', JSON.stringify(user.user));
          this.decodedToken = this.jwtHelper.decodeToken(user.token);
          localStorage.setItem('username', this.decodedToken.unique_name);
          this.currentUser = user.user;
          this.changeMainPhoto(this.currentUser.photoUrl);
        }));
  }

  register(user: User) {
    return this.http.post(this.baseUrl + 'register', user);
  }

  loggedIn() {
    const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
  }

  changeMainPhoto(url: string) {
    this.photoUrl.next(url);
  }

  changePassword(username, newPassword, currentPassword) {
    return this.http.put(`${this.baseUrl}changePassword`, {
      username: username,
      currentPassword: currentPassword,
      newPassword: newPassword
    });
  }

  forgotUsername(email: string) {
    return this.http.post(`${this.baseUrl}forgotUsername/${email}`, {});
  }

  forgotPassword(username: string) {
    return this.http.post(`${this.baseUrl}forgotPassword/${username}`, {});
  }

  changeTempPassword(username, newPassword, currentPassword) {
    return this.http.put(`${this.baseUrl}changeTempPassword`, {
      username: username,
      currentPassword: currentPassword,
      newPassword: newPassword
    });
  }

  getPost(id: number): Observable<Post> {
    return this.http.get<Post>(`${this.baseUrl}post/${id}`);
  }
}
