import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/User.service';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';

@Component({
  selector: 'app-SendPostModal',
  templateUrl: './SendPostModal.component.html',
  styleUrls: ['./SendPostModal.component.css']
})
export class SendPostModalComponent implements OnInit {
  @Output() userToSendPostTo = new EventEmitter();
  users;
  messages;
  elementType;
  userIds = [];
  usersToSend = [];
  groupsToSend = [];
  query
  id;
  message = '';


  constructor(public bsModalRef: BsModalRef, private auth: AuthService, private user: UserService) { }

  ngOnInit() {
    this.id = this.auth.decodedToken.nameid;
    if (this.elementType === 'sendPost') {
      this.user.getMessages(this.id).subscribe(messages => {
        this.messages = messages;
        this.messages.forEach(element => {
          // tslint:disable-next-line: triple-equals
          element.checked = false;
        });
        console.log(this.userIds);
      });
    }

  }

  searchPreview(phrase) {
    console.log(this.usersToSend);
    this.user.searchForUser(this.auth.decodedToken.nameid, phrase, false).subscribe(users => {
      this.users = users;
      this.users.forEach(element => {
        if (this.usersToSend.some(e => e == element.id)) {
          element.checked = true;
        } else {
          element.checked = false;
        }
      });
    });
  }

  handleCheckboxChangeMessage(item) {
    if (!item.checked) {
      if (item.groupId > 0) {
        this.groupsToSend.push(item.groupId);
      } else {
        this.usersToSend.push(item.senderId == this.id ? item.recipientId : item.senderId);
        console.log(this.usersToSend);
      }
    } else {
      if (item.groupId > 0) {
        this.groupsToSend =  this.groupsToSend.filter(i => i != item.groupId);
      } else {
        this.usersToSend = this.usersToSend.filter(i => item.senderId == this.id ? item.recipientId != i : item.senderId != i);
      }
    }
  }

  handleCheckboxChangeUser(item) {
    if (!item.checked) {
        this.usersToSend.push(item.id);
    } else {
        this.usersToSend = this.usersToSend.filter(i => item.id !== i);
    }
  }

  submit() {
    this.userToSendPostTo.emit({users: this.usersToSend, groups: this.groupsToSend, message: this.message});
    this.bsModalRef.hide();
    this.messages = [];
    this.users = [];
    this.userIds = [];
    this.usersToSend = [];
    this.message = '';
  }
}
