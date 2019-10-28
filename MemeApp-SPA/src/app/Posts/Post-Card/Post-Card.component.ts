import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Post } from 'src/app/_models/Post';
import { UserService } from 'src/app/_services/User.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { AuthService } from 'src/app/_services/auth.service';
import { User } from 'src/app/_models/User';

@Component({
  selector: 'app-Post-Card',
  templateUrl: './Post-Card.component.html',
  styleUrls: ['./Post-Card.component.css']
})
export class PostCardComponent implements OnInit {
  @Input() post: Post;
  @Output() delete = new EventEmitter();
  liked = false;
  myPost = false;

  constructor(private user: UserService, private alertify: AlertifyService, private authService: AuthService) { }

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user.username === this.post.username) {
      this.myPost = true;
    }
    console.log(this.myPost);
  }

  like() {
    this.liked = !this.liked;
    if (this.liked === true) {
      this.post.likes++;
    } else {
      this.post.likes --;
    }
  }

  deletePost(id: number) {
    this.delete.emit(id);
  }


}
