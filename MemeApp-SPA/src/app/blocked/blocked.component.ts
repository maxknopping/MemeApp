import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../_models/User';
import { UserService } from '../_services/User.service';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';

@Component({
  selector: 'app-blocked',
  templateUrl: './blocked.component.html',
  styleUrls: ['./blocked.component.css']
})
export class BlockedComponent implements OnInit {

  users: User[];
  constructor(private route: ActivatedRoute, private userService: UserService, private authService: AuthService, 
              private alertify: AlertifyService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.users = data['users'];
      console.log(this.users);
    });
  }

  unblock(user: User) {
    this.userService.unblockUser(this.authService.decodedToken.nameid, user.id).subscribe(() => {
      this.alertify.success('Successfully unblocked user');
      this.users = this.users.filter(u => u.id != user.id);
    })
  }


}
