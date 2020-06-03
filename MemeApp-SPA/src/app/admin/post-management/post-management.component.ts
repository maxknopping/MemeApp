import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/_services/admin.service';
import { AuthService } from 'src/app/_services/auth.service';
import { Post } from 'src/app/_models/Post';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { UserService } from 'src/app/_services/User.service';

@Component({
  selector: 'app-post-management',
  templateUrl: './post-management.component.html',
  styleUrls: ['./post-management.component.css']
})
export class PostManagementComponent implements OnInit {
  posts = [];
  constructor(private admin: AdminService, private auth: AuthService, private alertify: AlertifyService, 
              private user: UserService) { }

  ngOnInit() {
    this.admin.getReportedPosts(this.auth.decodedToken.nameid).subscribe((res: Post[]) => {
      this.posts = res;
    });
  }

  deletePost(id) {
    this.alertify.confirm('Are you sure you want to delete this post?', () => {
      this.user.deletePost(this.auth.decodedToken.nameid, id).subscribe(() => {
        this.posts.splice(this.posts.findIndex(p => p.id === id), 1);
        this.alertify.success('Post has been deleted');
      }, error => {
        this.alertify.error('Failed to delete the post');
      });
    });
  }

  allowPost(id) {
      this.admin.unReportPost(this.auth.decodedToken.nameid, id).subscribe(() => {
        this.posts.splice(this.posts.findIndex(p => p.id === id), 1);
        this.alertify.success('Post has been Unreported');
      }, error => {
        this.alertify.error('Failed to unrepot this post');
      });
  }

}
