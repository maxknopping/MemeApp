import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { Comment } from '../_models/Comment';
import { UserService } from '../_services/User.service';
import { AuthService } from '../_services/auth.service';
import { Reply } from '../_models/Reply';

@Component({
  selector: 'app-CommentList',
  templateUrl: './CommentList.component.html',
  styleUrls: ['./CommentList.component.css']
})
export class CommentListComponent implements OnInit {
  comments: Comment[];
  myPost: boolean;
  replying: boolean = false;

  constructor(private route: ActivatedRoute, private user: UserService,
              public authService: AuthService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.comments = data['comments'];
      this.myPost = this.route.snapshot.params['myPost'];
      this.getCommentsReady();
    });
  }

  getCommentsReady() {
    this.comments.forEach(element => {
      element.replying = false;
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
      element.replies.forEach(e => {
        if (e.commenterId == this.authService.decodedToken.nameid ||
          this.myPost) {
            e.deleteable = true;
        }
        e.likeList.forEach(like => {
          e.likes++;
          if (like.likerId == this.authService.decodedToken.nameid) {
            e.liked = true;
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

  likeReply(reply: Reply) {
    this.user.likeReply(this.authService.decodedToken.nameid, reply.postId, reply.commentId, reply.id).subscribe(() => {
      reply.liked = true;
      reply.likes++;
    });
  }

  unlikeReply(reply: Reply) {
    this.user.unlikeReply(this.authService.decodedToken.nameid, reply.postId, reply.commentId, reply.id).subscribe(() => {
      reply.liked = false;
      reply.likes--;
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

  deleteReply(reply: Reply) {
    this.user.deleteReply(reply.id).subscribe(() => {
      let comment = this.comments.find(c => c.id == reply.commentId);

       comment.replies = comment.replies.filter(obj => obj !== reply);
    });
  }

  toggleReplying(comment: Comment) {
    comment.replying = !comment.replying;
  }

  postReply(comment: Comment) {
    this.user.sendReply(comment.replyText, comment.postId, this.authService.decodedToken.nameid, comment.id)
    .subscribe(() => {
      this.user.getComments(comment.postId).subscribe((response: Comment[]) => {
        this.comments = response;
        this.getCommentsReady();
      });
    });
  }
}
