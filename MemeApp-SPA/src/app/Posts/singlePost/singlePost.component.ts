import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from 'src/app/_models/Post';
import { SEOService } from 'src/app/_services/SEO.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { UserService } from 'src/app/_services/User.service';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-singlePost',
  templateUrl: './singlePost.component.html',
  styleUrls: ['./singlePost.component.css']
})
export class SinglePostComponent implements OnInit {
  post: Post;

  constructor(private route: ActivatedRoute, private seo: SEOService, private alertify: AlertifyService, 
              private user: UserService, private authSerce: AuthService, private router: Router) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.post = data['post'];
      this.seo.addTag('og:title', `${this.post.username} on MemeClub`);
      this.seo.addTag('og:image', this.post.url);
    });
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.seo.removeTags();
    this.seo.removeTags();
  }

  deletePost(id) {
    this.alertify.confirm('Are you sure you want to delete this post?', () => {
      this.user.deletePost(this.authService.decodedToken.nameid, id).subscribe(() => {
        this.alertify.success('Post has been deleted');
        this.router.navigate(['/feed']);
      }, error => {
        this.alertify.error('Failed to delete the post');
      });
    });
  }
}
