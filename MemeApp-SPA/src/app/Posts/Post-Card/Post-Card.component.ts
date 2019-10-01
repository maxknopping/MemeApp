import { Component, OnInit, Input } from '@angular/core';
import { Post } from 'src/app/_models/Post';
import { UserService } from 'src/app/_services/User.service';

@Component({
  selector: 'app-Post-Card',
  templateUrl: './Post-Card.component.html',
  styleUrls: ['./Post-Card.component.css']
})
export class PostCardComponent implements OnInit {
  @Input() post: Post;
  liked = false;

  constructor(private user: UserService) { }

  ngOnInit() {
  }

  like() {
    this.liked = !this.liked;
    if (this.liked === true) {
      this.post.likes ++;
      

    } else {
      this.post.likes --;
    }
  }

}
