import { Component, OnInit } from '@angular/core';
import { User } from '../_models/User';
import { UserService } from '../_services/User.service';
import { AlertifyService } from '../_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { Post } from '../_models/Post';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User;
  posts: Post[];
  following = false;
  isMyProfile = false;

  constructor(private userService: UserService, private alertify: AlertifyService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.user = data['user'];
      this.posts = this.user.posts;
      if (this.user.username === localStorage.getItem('username')) {
        this.isMyProfile = true;
      }
    });
  }

  loadUser() {
    this.userService.getUserByUsername(this.route.snapshot.params['username']).subscribe(res => {
      this.user = res;
      this.posts = this.user.posts;
      if (this.user.username === localStorage.getItem('username')) {
        this.isMyProfile = true;
      }
    }, error => {
      this.alertify.error(error);
    });
  }

}
