import { Component, OnInit } from '@angular/core';
import { Message } from '../_models/Message';
import { UserService } from '../_services/User.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  messages: Message[];
  id;
  search;
  messageContainer = 'Unread';
  constructor(private user: UserService, private auth: AuthService,
              private route: ActivatedRoute, private alertify: AlertifyService) { }

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
    });
  }


}
