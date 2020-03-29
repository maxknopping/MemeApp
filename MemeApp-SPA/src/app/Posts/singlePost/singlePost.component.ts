import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Post } from 'src/app/_models/Post';

@Component({
  selector: 'app-singlePost',
  templateUrl: './singlePost.component.html',
  styleUrls: ['./singlePost.component.css']
})
export class SinglePostComponent implements OnInit {
  post: Post;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.post = data['post'];
    })
  }

}
