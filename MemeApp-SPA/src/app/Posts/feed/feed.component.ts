import { Component, OnInit } from '@angular/core';
import { Post } from '../../_models/Post';
import { UserService } from '../../_services/User.service';
import { AlertifyService } from '../../_services/alertify.service';
import { ActivatedRouteSnapshot, ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {
  posts: Post[] =  [];
  index: number;
  reachedEnd: boolean;

  constructor(private user: UserService, private route: ActivatedRoute, private alertify: AlertifyService) { }

  ngOnInit() {
    this.index = 0;
    this.loadPosts();
    window.addEventListener('scroll', this.scroll, true); //third parameter
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.scroll, true);
  }

  loadPosts() {
    const username = localStorage.getItem('username');
    this.user.getFeed(username, this.index).subscribe((post: Post) => {
      this.posts.push(post);
      this.index++;
    }, error => {
      this.reachedEnd = true;
    });
  }

  scroll = (): void => {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      this.loadPosts();
    }
  }
}
