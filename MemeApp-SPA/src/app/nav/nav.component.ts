import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { Router } from '@angular/router';
import { UserService } from '../_services/User.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {};
  username;
  photoUrl: string;
  query: string;
  searchPreviewUsers;
  @ViewChild('dropdown', {static: true}) private dropdown: ElementRef;

  constructor(
    public authService: AuthService,
    private alertify: AlertifyService,
    private router: Router,
    private user: UserService
  ) {}

  ngOnInit() {
    this.authService.currentPhotoUrl.subscribe(photoUrl => this.photoUrl = photoUrl)
  }

  login() {
    this.authService.login(this.model).subscribe(
      next => {
        this.alertify.success('logged in successfully');
      },
      error => {
        this.alertify.error('failed to log in');
      }, () => {
        this.router.navigate(['/feed']);
      }
    );
    this.username = localStorage.getItem('username');

  }

  loggedIn() {
    return this.authService.loggedIn();
  }

  logOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('user');
    this.authService.decodedToken = null;
    this.authService.currentUser = null;
    this.router.navigate(['/home']);
    this.alertify.success('logged out successfully');
  }

  search(phrase) {
    this.user.searchForUser(phrase, true).subscribe(users => {
      this.searchPreviewUsers = users;
    });

    //eventually, router navigate to search results
  }

  searchPreview(phrase) {
    this.user.searchForUser(phrase, false).subscribe(users => {
      this.searchPreviewUsers = users;
    });
  }

}
