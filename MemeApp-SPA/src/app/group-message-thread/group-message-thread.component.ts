import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Message } from '../_models/Message';
import { AuthService } from '../_services/auth.service';
import { UserService } from '../_services/User.service';
import { AlertifyService } from '../_services/alertify.service';

@Component({
  selector: 'app-group-message-thread',
  templateUrl: './group-message-thread.component.html',
  styleUrls: ['./group-message-thread.component.css']
})
export class GroupMessageThreadComponent implements OnInit {
  messages: Message[];
  newMessage: any = {};
  groupName;
  groupId;
  photoUrls = [];
  id;
  @ViewChild('scrollBottom', {static: true}) private scrollBottom: ElementRef;


  constructor(private route: ActivatedRoute, private auth: AuthService, private user: UserService,
              private alertify: AlertifyService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.messages = data['messages'];
      this.id = this.auth.decodedToken.nameid;
      console.log(this.messages);
      if (this.messages.length > 0) {
        this.groupName = this.messages[0].groupName;
        this.groupId = this.messages[0].groupId;
        this.messages[0].groupPhotoUrls.forEach(element => {
          if (element.id !== this.id) {
            this.photoUrls.push(element.photoUrl);
          }
        })

      }
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.messages.length; i++) {
        // tslint:disable-next-line: triple-equals
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
    this.newMessage.groupId = this.groupId;
    this.user.sendGroupMessage(this.auth.decodedToken.nameid, this.groupId, this.newMessage)
      .subscribe((message: Message) => {
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
