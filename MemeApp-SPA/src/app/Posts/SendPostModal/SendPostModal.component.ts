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
  query;
  id;


  constructor(public bsModalRef: BsModalRef, private auth: AuthService, private user: UserService) { }

  ngOnInit() {
    this.id = this.auth.decodedToken.nameid;
    this.elementType = 'user';
    this.user.getMessages(this.id).subscribe(messages => {
      this.messages = messages;
      console.log(this.messages);
      this.messages.forEach(element => {
        // tslint:disable-next-line: triple-equals
        this.userIds.push({id: element.senderId == this.id ? element.recipientId : element.senderId, checked: false});
      });
      console.log(this.userIds);
    });

  }

  searchPreview(phrase) {
    this.user.searchForUser(this.auth.decodedToken.nameid, phrase, false).subscribe(users => {
      this.users = users;
      this.users.forEach(element => {
        this.userIds.push({id: element.id, checked: false});
        element.index = this.userIds.length - 1;
      });
    });
  }

  submit() {
    this.userIds.forEach(user => {
      if (user.checked === true) {
        this.usersToSend.push(user.id);
      }
    });
    this.userToSendPostTo.emit(this.usersToSend);
    this.bsModalRef.hide();
    this.userIds = [];
    this.usersToSend = [];
  }
}
