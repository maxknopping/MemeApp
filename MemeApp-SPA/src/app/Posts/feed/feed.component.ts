import { Component, OnInit } from '@angular/core';
import { Post } from '../../_models/Post';
import { UserService } from '../../_services/User.service';
import { AlertifyService } from '../../_services/alertify.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {
  posts: Post[];

  constructor(private user: UserService, private alertify: AlertifyService) { }

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    const username = localStorage.getItem('username');
    this.user.getFeed(username).subscribe((posts: Post[]) => {
      this.posts = posts;
    }, error => {
      this.alertify.error(error);
    });
  }

}
