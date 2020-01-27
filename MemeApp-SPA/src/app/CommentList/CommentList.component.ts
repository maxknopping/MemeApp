import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Comment } from '../_models/Comment';
import { UserService } from '../_services/User.service';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-CommentList',
  templateUrl: './CommentList.component.html',
  styleUrls: ['./CommentList.component.css']
})
export class CommentListComponent implements OnInit {
  comments: Comment[];

  constructor(private route: ActivatedRoute, private user: UserService, private authService: AuthService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.comments = data['comments'];
      this.comments.forEach(element => {
        element.likes = element.likeList.length;
        element.likeList.forEach(e => {
          if (e.commenterId == this.authService.decodedToken.nameid) {
            element.liked = true;
          }
        })
      });
    });
  }

  like(comment: Comment) {
    this.user.likeComment(this.authService.decodedToken.nameid, comment.postId, comment.id).subscribe(() => {
      comment.liked = true;
      comment.likes++;
    });
  }

  unlike(comment: Comment) {
    this.user.unlikeComment(this.authService.decodedToken.nameid, comment.postId, comment.id).subscribe(() => {
      comment.liked = false;
      comment.likes--;
    });
  }
}
