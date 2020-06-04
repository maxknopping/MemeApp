import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/_services/admin.service';
import { AuthService } from 'src/app/_services/auth.service';
import { User } from 'src/app/_models/User';
import { AlertifyService } from 'src/app/_services/alertify.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: User[];
  constructor(private admin: AdminService, private auth: AuthService, private alertify: AlertifyService) { }

  ngOnInit() {
    this.admin.getReportedUsers(this.auth.decodedToken.nameid).subscribe((res: User[]) => {
      this.users = res;
      console.log(this.users);
    });
  }

  removeBio(user: User) {
    this.admin.updateUser(this.auth.decodedToken.nameid, {removeBio: true}, user.id).subscribe(() => {
      this.alertify.success('Successfully removed bio');
      user.bio = '';
    });
  }

  removeProfilePicture(user: User) {
    this.admin.updateUser(this.auth.decodedToken.nameid, {removeProfilePicture: true}, user.id).subscribe(() => {
      this.alertify.success('Successfully removed profile picture');
      user.photoUrl = null;
    });
  }

  removeName(user: User) {
    this.admin.updateUser(this.auth.decodedToken.nameid, {removeName: true}, user.id).subscribe(() => {
      this.alertify.success('Successfully removed profile picture');
      user.name = '';
    });
  }

  unReportUser(user: User) {
    this.admin.unReportUser(this.auth.decodedToken.nameid, user.id).subscribe(() => {
      this.users = this.users.filter(u => u.id != user.id);
    });
  }

  banUser(user: User) {
    this.admin.banUser(this.auth.decodedToken.nameid, {days: 3.0}, user.id).subscribe(() => {
      this.users = this.users.filter(u => u.id != user.id);
      this.alertify.success('User has been banned');
    });
  }

}
