import { Component, OnInit } from '@angular/core';
import { User } from '../_models/User';
import { UserService } from '../_services/User.service';
import { AlertifyService } from '../_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { Post } from '../_models/Post';
import { Followee } from '../_models/Followee';
import { AuthService } from '../_services/auth.service';

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
  followers = 0;

  constructor(private userService: UserService, private authService: AuthService,
              private alertify: AlertifyService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.user = data['user'];
      console.log(this.user);
      this.posts = this.user.posts;
      if (this.user.username === this.authService.decodedToken.unique_name) {
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

  follow() {
    //query api for adding a follower, get back new user object with updated follower list
    if (this.following) {
      this.followers--;
    } else {
      this.followers++;
    }

    this.following = !this.following;
  }

  deletePost(id) {
    this.alertify.confirm('Are you sure you want to delete this post?', () => {
      this.userService.deletePost(this.authService.decodedToken.nameid, id).subscribe(() => {
        this.posts.splice(this.posts.findIndex(p => p.id === id), 1);
        this.alertify.success('Post has been deleted');
      }, error => {
        this.alertify.error('Failed to delete the post');
      });
    });
  }

}
