import { Component, OnInit, Injectable } from '@angular/core';
import { User } from '../_models/User';
import { UserService } from '../_services/User.service';
import { AlertifyService } from '../_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { Post } from '../_models/Post';
import { Follow } from '../_models/Follow';
import { AuthService } from '../_services/auth.service';

@Injectable({
  providedIn: 'root'
})
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
      this.followers = this.user.followers.length;
      console.log(this.user);
      this.posts = this.user.posts;
      if (this.user.username === this.authService.decodedToken.unique_name) {
        this.isMyProfile = true;
      }
      this.user.followers.forEach(follow => {
        if (follow.followerId == this.authService.decodedToken.nameid) {
          this.following = true;
        }
      });
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

  follow(id: number) {
    this.userService.followUser(this.authService.decodedToken.nameid, id).subscribe(() => {
      this.following = true;
      this.followers++;
    });
  }

  unfollow(id: number) {
    this.userService.unfollowUser(this.authService.decodedToken.nameid, id).subscribe(() => {
      this.following = false;
      this.followers--;
    });
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
