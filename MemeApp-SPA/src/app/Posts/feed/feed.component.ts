import { Component, OnInit } from '@angular/core';
import { Post } from '../../_models/Post';
import { UserService } from '../../_services/User.service';
import { AlertifyService } from '../../_services/alertify.service';
import { ActivatedRouteSnapshot, ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {
  posts: Post[] =  [];
  index: number;
  reachedEnd: boolean;

  constructor(private user: UserService, private route: ActivatedRoute, private alertify: AlertifyService, private authService: AuthService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.index = 0;
      this.loadInitialPosts();
    });
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

  loadInitialPosts() {
    const username = localStorage.getItem('username');
    this.user.getFeed(username, this.index).subscribe((post: Post) => {
      this.posts.push(post);
      this.index++;
      this.user.getFeed(username, this.index).subscribe((post2: Post) => {
        this.posts.push(post2);
        this.index++;
      })
    }, error => {
      this.reachedEnd = true;
    });
  }

  scroll = (): void => {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      this.loadPosts();
    }
  }

  deletePost(id) {
    this.alertify.confirm('Are you sure you want to delete this post?', () => {
      this.user.deletePost(this.authService.decodedToken.nameid, id).subscribe(() => {
        this.posts.splice(this.posts.findIndex(p => p.id === id), 1);
        this.alertify.success('Post has been deleted');
      }, error => {
        this.alertify.error('Failed to delete the post');
      });
    });
  }
}
