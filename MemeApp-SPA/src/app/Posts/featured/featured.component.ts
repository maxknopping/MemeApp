import { Component, OnInit } from '@angular/core';
import { Post } from '../../_models/Post';
import { UserService } from '../../_services/User.service';
import { AlertifyService } from '../../_services/alertify.service';
import { ActivatedRouteSnapshot, ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-featured',
  templateUrl: './featured.component.html',
  styleUrls: ['./featured.component.css']
})
export class FeaturedComponent implements OnInit {
  posts: Post[] =  [];
  index: number;

  constructor(private user: UserService, private route: ActivatedRoute, private alertify: AlertifyService) { }

  ngOnInit() {
    this.index = 0;
    this.loadInitialPosts();
    window.addEventListener('scroll', this.scroll, true); //third parameter
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.scroll, true);
  }

  loadPosts() {
    this.user.getFeatured(this.index).subscribe((post: Post) => {
      this.posts.push(post);
      this.index++;
    }, error => {
    });
  }

  loadInitialPosts() {
    this.user.getFeatured(this.index).subscribe((post: Post) => {
      this.posts.push(post);
      this.index++;
      this.user.getFeatured(this.index).subscribe((post2: Post) => {
        this.posts.push(post2);
        this.index++;
      })
    }, error => {
    });
  }

  scroll = (): void => {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      this.loadPosts();
    }
  }

}
