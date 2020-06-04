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
export class AdminService {
baseUrl = environment.apiUrl + '/api/admin';

constructor(private http: HttpClient) { }

  getAdminUsers(userId: number) {
    return this.http.get(`${this.baseUrl}/admins/${userId}`);
  }

  getReportedUsers(username: string) {
    return this.http.get(`${this.baseUrl}/reportedUsers/${username}`);
  }

  getReportedPosts(userId: number) {
    return this.http.get(`${this.baseUrl}/reported/${userId}`);
  }

  updateRoles(userId: number, roles: any, id: number,) {
    return this.http.post(`${this.baseUrl}/editRoles/${userId}/userToEdit/${id}`, roles);
  }

  updateUser(userId: number, userToEdit: any, id: number,) {
    return this.http.put(`${this.baseUrl}/${userId}/update/${id}`, userToEdit);
  }

  unReportPost(userId: number, postId: number) {
    return this.http.post(`${this.baseUrl}/${userId}/unReport/post/${postId}`, {});
  }

  unReportUser(userId: number, reportedId: number) {
    return this.http.post(`${this.baseUrl}/${userId}/unReport/user/${reportedId}`, {});
  }





}
