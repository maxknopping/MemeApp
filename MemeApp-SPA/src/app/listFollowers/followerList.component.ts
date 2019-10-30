import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../_models/User';

@Component({
  selector: 'app-followerList',
  templateUrl: './followerList.component.html',
  styleUrls: ['./followerList.component.css']
})
export class FollowerListComponent implements OnInit {
  users: User[];

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.users = data['users'];
      console.log(this.users);
    });
  }

}
