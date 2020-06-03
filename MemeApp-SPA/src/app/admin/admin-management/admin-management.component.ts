import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/_models/User';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { UserService } from 'src/app/_services/User.service';
import { AuthService } from 'src/app/_services/auth.service';
import { SendPostModalComponent } from 'src/app/Posts/SendPostModal/SendPostModal.component';
import { AdminService } from 'src/app/_services/admin.service';

@Component({
  selector: 'app-admin-management',
  templateUrl: './admin-management.component.html',
  styleUrls: ['./admin-management.component.css']
})
export class AdminManagementComponent implements OnInit {

  users: User[];
  groupName;
  originalName;
  groupId;
  bsModalRef: BsModalRef;

  constructor(private userService: UserService, private authService: AuthService,
              private modalService: BsModalService, private admin: AdminService) { }

  ngOnInit() {
    this.admin.getAdminUsers(this.authService.decodedToken.nameid).subscribe((res: User[]) => {
      this.users = res;
      console.log(this.users);
    });
  }

  getGroup() {
    this.admin.getAdminUsers(this.authService.decodedToken.nameid).subscribe((res: User[]) => {
      this.users = res;
      console.log(this.users);
    });
  }

  removeUser(user) {
    this.admin.updateRoles(this.authService.decodedToken.nameid, {rolesToRemove: ['Admin'], rolesToAdd: []}, user.id).subscribe(() => {
        this.users = this.users.filter(u => u.id != user.id);
      });
  }

  addUser() {
    this.bsModalRef = this.modalService.show(SendPostModalComponent, {
      initialState: {
        elementType: 'addUser'
      }
    });
    this.bsModalRef.content.userToSendPostTo.subscribe(value => {
        value.users.forEach(element => {
          this.admin.updateRoles(this.authService.decodedToken.nameid, {rolesToAdd: ['Admin'], rolesToRemove: []}, element).subscribe(() => {
              let index = value.users.indexOf(element);
              console.log(index);
              if (index == value.users.length - 1) {
                this.getGroup();
              }
          });
        });
    });
  }

}
