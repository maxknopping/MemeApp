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
  query: string;
  searchPreviewUsers;
  messages: Message[];
  id;
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

  search(phrase) {
    this.user.searchForUser(this.auth.decodedToken.nameid ,phrase, true).subscribe(users => {
      this.searchPreviewUsers = users;
    });

    //eventually, router navigate to search results
  }

  searchPreview(phrase) {
    this.user.searchForUser(this.auth.decodedToken.nameid, phrase, false).subscribe(users => {
      this.searchPreviewUsers = users;
    });
  }


}
