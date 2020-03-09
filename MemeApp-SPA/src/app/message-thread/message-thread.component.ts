import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Message } from '../_models/Message';
import { AuthService } from '../_services/auth.service';
import { UserService } from '../_services/User.service';
import { AlertifyService } from '../_services/alertify.service';

@Component({
  selector: 'app-message-thread',
  templateUrl: './message-thread.component.html',
  styleUrls: ['./message-thread.component.css']
})
export class MessageThreadComponent implements OnInit {
  messages: Message[];
  newMessage: any = {};
  photoUrlOtherPerson;
  usernameOtherPerson;
  recipientId;
  id
  @ViewChild('scrollBottom', {static: true}) private scrollBottom: ElementRef;


  constructor(private route: ActivatedRoute, private auth: AuthService, private user: UserService,
              private alertify: AlertifyService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.messages = data['messages'];
      this.id = this.auth.decodedToken.nameid;
      console.log(this.messages);
      if (this.messages.length == 0) {
        this.user.getUser(this.route.snapshot.params['recipientId']).subscribe(user => {
          this.photoUrlOtherPerson = user.photoUrl;
          this.usernameOtherPerson = user.username;
          this.recipientId = user.id;
        });
      } else if (this.messages[0].senderId == this.id) {
        this.photoUrlOtherPerson = this.messages[0].recipientPhotoUrl;
        this.usernameOtherPerson = this.messages[0].recipientUsername;
        this.recipientId = this.messages[0].recipientId;
      } else {
        this.photoUrlOtherPerson = this.messages[0].senderPhotoUrl;
        this.usernameOtherPerson = this.messages[0].senderUsername;
        this.recipientId = this.messages[0].senderId;
      }
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.messages.length; i++) {
        if (this.messages[i].isRead == false && this.messages[i].recipientId == this.id) {
          this.user.markAsRead(this.messages[i].id, this.id);
        }
      }
      this.scrollToBottom();
    });
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
        this.scrollBottom.nativeElement.scrollTop = this.scrollBottom.nativeElement.scrollHeight;
    } catch(err) { }
  }

  sendMessage() {
    this.newMessage.recipientId = this.recipientId;
    this.user.sendMessage(this.auth.decodedToken.nameid, this.newMessage).subscribe((message: Message) => {
        this.messages.push(message);
        this.newMessage = {};
    }, error => {
      this.alertify.error(error);
    });
  }

  deleteMessage(id: number) {
    this.alertify.confirm("Are you sure you want to delete this message?", () => {
      this.user.deleteMessage(id, this.auth.decodedToken.nameid).subscribe(() => {
        this.messages.splice(this.messages.findIndex(m => m.id === id), 1);
        this.alertify.success("Message deleted");
      }, error => {
        this.alertify.error(error);
      })
    })
  }

}
