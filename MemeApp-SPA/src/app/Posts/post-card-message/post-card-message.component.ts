import { Component, OnInit, Input } from '@angular/core';
import { Post } from 'src/app/_models/Post';

@Component({
  selector: 'app-post-card-message',
  templateUrl: './post-card-message.component.html',
  styleUrls: ['./post-card-message.component.css']
})
export class PostCardMessageComponent implements OnInit {
  @Input() post: Post;


  constructor() { }

  ngOnInit() {
    console.log(this.post);
  }

}
