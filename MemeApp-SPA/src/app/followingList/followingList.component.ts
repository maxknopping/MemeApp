import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../_models/User';

@Component({
  selector: 'app-followingList',
  templateUrl: './followingList.component.html',
  styleUrls: ['./followingList.component.css']
})
export class FollowingListComponent implements OnInit {
  users: User[];

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.users = data['users'];
      console.log(this.users);
    });
  }

}
