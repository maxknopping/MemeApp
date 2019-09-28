import { Component, OnInit, Input } from '@angular/core';
import { Post } from 'src/app/_models/Post';

@Component({
  selector: 'app-Post-Card',
  templateUrl: './Post-Card.component.html',
  styleUrls: ['./Post-Card.component.css']
})
export class PostCardComponent implements OnInit {
  @Input() post: Post;
  constructor() { }

  ngOnInit() {
  }

}
