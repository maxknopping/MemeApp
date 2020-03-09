import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
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
  myPost: boolean;

  constructor(private route: ActivatedRoute, private user: UserService,
              private authService: AuthService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.comments = data['comments'];
      this.myPost = this.route.snapshot.params['myPost'];
      this.comments.forEach(element => {
        element.likes = element.likeList.length;
        if (element.commenterId == this.authService.decodedToken.nameid ||
            this.myPost) {
              element.deleteable = true;
        }
        element.likeList.forEach(e => {
          if (e.commenterId == this.authService.decodedToken.nameid) {
            element.liked = true;
          }
        });
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

  deleteComment(comment: Comment) {
    this.user.deleteComment(comment.id).subscribe(() => {
      this.comments = this.comments.filter(obj => obj !== comment);
    });
  }
}
