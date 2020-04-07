import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Post } from 'src/app/_models/Post';
import { UserService } from 'src/app/_services/User.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { AuthService } from 'src/app/_services/auth.service';
import { User } from 'src/app/_models/User';
import { NgForm } from '@angular/forms';
import {Router} from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { SendPostModalComponent } from '../SendPostModal/SendPostModal.component';
import { Message } from 'src/app/_models/Message';

@Component({
  selector: 'app-Post-Card',
  templateUrl: './Post-Card.component.html',
  styleUrls: ['./Post-Card.component.css']
})
export class PostCardComponent implements OnInit {
  @Input() post: Post;
  @Output() delete = new EventEmitter();
  @ViewChild('editForm', {static: true}) commentForm: NgForm;
  liked = false;
  myPost = false;
  likes;
  comment;
  bsModalRef: BsModalRef;

  constructor(private user: UserService, private alertify: AlertifyService, private authService: AuthService,
              private router: Router, private modalService: BsModalService) { }

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user.username === this.post.username) {
      this.myPost = true;
    }
    console.log(this.post);
    this.likes = this.post.likeList.length;
    this.post.likeList.forEach(element => {
      if (element.likerId == this.authService.decodedToken.nameid) {
        this.liked = true;
      }
    });
    console.log(this.post);
    this.comment = '';
  }

  like() {
    this.user.likePost(this.authService.decodedToken.nameid, this.post.id).subscribe(() => {
      this.liked = true;
      this.likes++;
    });
  }

  unlike() {
    this.user.unLikePost(this.authService.decodedToken.nameid, this.post.id).subscribe(() => {
      this.liked = false;
      this.likes--;
    });
  }

  deletePost(id: number) {
    this.delete.emit(id);
  }

  sendComment() {
    this.user.sendComment(this.comment, this.post.id, this.authService.decodedToken.nameid).subscribe(() => {
      this.router.navigate(['/comments', this.post.id, this.myPost]);
    });
  }

  messagePost() {
    this.bsModalRef = this.modalService.show(SendPostModalComponent, {
      initialState: {
        elementType: 'sendPost'
      }
    });
    this.bsModalRef.content.userToSendPostTo.subscribe(value => {
      value.groups.forEach(element => {
        const message = {senderId: this.authService.decodedToken.nameid, postId: this.post.id, groupId: element};
        this.user.sendGroupMessage(message.senderId, message.groupId, message).subscribe();
      });
      value.users.forEach(element => {
        const message = {senderId: this.authService.decodedToken.nameid, recipientId: element, postId: this.post.id};
        this.user.sendMessageWithPost(this.authService.decodedToken.nameid, message).subscribe();
      });
    });
  }


}
