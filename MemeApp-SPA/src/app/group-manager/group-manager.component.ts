import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../_models/User';
import { UserService } from '../_services/User.service';
import { AuthService } from '../_services/auth.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SendPostModalComponent } from '../Posts/SendPostModal/SendPostModal.component';

@Component({
  selector: 'app-group-manager',
  templateUrl: './group-manager.component.html',
  styleUrls: ['./group-manager.component.css']
})
export class GroupManagerComponent implements OnInit {

  users: User[];
  groupName;
  originalName;
  groupId;
  bsModalRef: BsModalRef;

  constructor(private route: ActivatedRoute, private userService: UserService, private authService: AuthService,
              private modalService: BsModalService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.users = data['users'];
      console.log(this.users);
      this.groupId = this.route.snapshot.params['groupId'];
      this.groupName = this.route.snapshot.params['groupName'];
      this.originalName = this.groupName;
    });
  }

  changeName() {
    if (this.groupName !== this.originalName) {
      this.userService.updateGroup(this.authService.decodedToken.nameid, this.groupName, 
        this.groupId, [], []).subscribe(() => {
          this.originalName = this.groupName;
        });
    }
  }

  getGroup() {
    this.userService.getGroupUsers(this.authService.decodedToken.nameid, this.groupId).subscribe((res: User[]) => {
      this.users = res;
    })
  }

  removeUser(user) {
    this.userService.updateGroup(this.authService.decodedToken.nameid, this.originalName,
      this.groupId, [], [user.id]).subscribe(()=> {
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
        this.userService.updateGroup(this.authService.decodedToken.nameid, this.originalName, this.groupId, 
          value.users, []).subscribe(() => {
            this.getGroup();
          });
    });
  }


}
