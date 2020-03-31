import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../_models/User';
import { UserService } from '../_services/User.service';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-followingList',
  templateUrl: './followingList.component.html',
  styleUrls: ['./followingList.component.css']
})
export class FollowingListComponent implements OnInit {
  users: User[];

  constructor(private route: ActivatedRoute, private userService: UserService, private authService: AuthService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.users = data['users'];
      console.log(this.users);
    });
  }

  follow(user: User) {
    console.log(user);
    this.userService.followUser(this.authService.decodedToken.nameid, user.id).subscribe(() => {
      user.followButton = 'Following';

    });
  }

  unfollow(user: User) {
    this.userService.unfollowUser(this.authService.decodedToken.nameid, user.id).subscribe(() => {
      user.followButton = 'Follow';
    });
  }

}
