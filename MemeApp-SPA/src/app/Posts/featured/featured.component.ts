import { Component, OnInit } from '@angular/core';
import { Post } from '../../_models/Post';
import { UserService } from '../../_services/User.service';
import { AlertifyService } from '../../_services/alertify.service';
import { ActivatedRouteSnapshot, ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-featured',
  templateUrl: './featured.component.html',
  styleUrls: ['./featured.component.css']
})
export class FeaturedComponent implements OnInit {
  posts: Post[] =  [];
  index: number;

  constructor(private user: UserService, private route: ActivatedRoute, private alertify: AlertifyService, 
              private authService: AuthService) { }

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
