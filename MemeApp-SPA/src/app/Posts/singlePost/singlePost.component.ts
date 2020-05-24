import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Post } from 'src/app/_models/Post';
import { SEOService } from 'src/app/_services/SEO.service';

@Component({
  selector: 'app-singlePost',
  templateUrl: './singlePost.component.html',
  styleUrls: ['./singlePost.component.css']
})
export class SinglePostComponent implements OnInit {
  post: Post;

  constructor(private route: ActivatedRoute, private seo: SEOService) { }

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

}
