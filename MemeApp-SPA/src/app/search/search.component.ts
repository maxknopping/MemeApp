import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { UserService } from '../_services/User.service';
import { User } from '../_models/User';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  users: User[];
  query;

  constructor(private authService: AuthService, private user: UserService) { }

  ngOnInit() {
  }

  search(phrase) {
    this.user.searchForUser(this.authService.decodedToken.nameid ,phrase, true).subscribe((users: User[]) => {
      this.users = users;
    });
  }

  onKey(event: any) { // without type info
    this.search(event.target.value);
  }

  follow(user: User) {
    console.log(user);
    this.user.followUser(this.authService.decodedToken.nameid, user.id).subscribe(() => {
      user.followButton = 'Following';

    });
  }

  unfollow(user: User) {
    this.user.unfollowUser(this.authService.decodedToken.nameid, user.id).subscribe(() => {
      user.followButton = 'Follow';
    });
  }

}
