import { Component, OnInit } from '@angular/core';
import { Message } from '../_models/Message';
import { UserService } from '../_services/User.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { SendPostModalComponent } from '../Posts/SendPostModal/SendPostModal.component';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  query: string;
  searchPreviewUsers;
  messages: Message[];
  id;
  messageContainer = 'Unread';
  bsModalRef: BsModalRef;
  
  constructor(private user: UserService, private auth: AuthService,
              private route: ActivatedRoute, private alertify: AlertifyService, private modalService: BsModalService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.messages = data['messages'];
      this.loadMessages();
    });
  }

  loadMessages() {
    this.user.getMessages(this.auth.decodedToken.nameid).subscribe((data: Message[]) => {
      this.messages = data;
      this.id = this.auth.decodedToken.nameid;
      console.log(data);
    });
  }

  search(phrase) {
    this.user.searchForUser(this.auth.decodedToken.nameid ,phrase, true).subscribe(users => {
      this.searchPreviewUsers = users;
    });
  }

  onKey(event: any) { // without type info
    this.searchPreview(event.target.value);
  }

  searchPreview(phrase) {
    this.user.searchForUser(this.auth.decodedToken.nameid, phrase, false).subscribe(users => {
      this.searchPreviewUsers = users;
    });
  }

  createGroup() {
    this.bsModalRef = this.modalService.show(SendPostModalComponent, {
      initialState: {
        elementType: 'group'
      }
    });
    this.bsModalRef.content.userToSendPostTo.subscribe(value => {
        this.user.createGroup(this.auth.decodedToken.nameid, 'Group', value.message, value.users).subscribe();
    });
  }


}
