import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../_models/User';
import { Post } from '../_models/Post';
import { AlertifyService } from '../_services/alertify.service';
import { NgForm } from '@angular/forms';
import { UserService } from '../_services/User.service';
import { AuthService } from '../_services/auth.service';
import { FileUploader } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})
export class ProfileEditComponent implements OnInit {
  @ViewChild('editForm', {static: true}) editForm: NgForm;
  user: User;
  posts: Post[];
  public imagePath;
  imgURL: any;
  public message: string;
  uploader: FileUploader;
  baseURL = environment.apiUrl;
  photoUrl: string;

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.editForm.dirty) {
      $event.returnValue = true;
    }
  }

  constructor(private route: ActivatedRoute, private alertify: AlertifyService, private userService: UserService,
              private authService: AuthService, private router: Router,
              private sanitizer: DomSanitizer, private http: HttpClient) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.user = data['user'];
      this.posts = this.user.posts;
      this.initializeUploader();
      this.imgURL = this.user.photoUrl;
    });
  }

  sendChanges() {
    if (this.uploader.queue.length > 0) {
      this.uploader.uploadAll();
    } else {
      this.updateUser();
    }
  }

  updateUser() {
    this.userService.updateUser(this.authService.decodedToken.nameid, this.user).subscribe(next => {
      this.alertify.success('Profile updated');
      this.editForm.reset(this.user);
      this.authService.decodedToken.unique_name = this.user.username;
      this.router.navigate([ '/profile/', this.authService.decodedToken.unique_name]);
    }, error => {
      this.alertify.error(error);
    });
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url: this.baseURL + '/api/users/' + this.authService.decodedToken.nameid + '/posts/profilePicture',
      authToken: 'Bearer ' + localStorage.getItem('token'),
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });
    this.uploader.onAfterAddingFile = (file) => {
      this.imgURL = (window.URL) ? this.sanitizer.
        bypassSecurityTrustUrl(window.URL.createObjectURL(file._file)) :
        this.sanitizer.bypassSecurityTrustUrl((window as any).webkitURL.createObjectURL(file._file));
      file.withCredentials = false;
      console.log(this.imgURL);
    };

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const res: User = JSON.parse(response);
        const newUser = {
          id: res.id,
          username: res.username,
          knownAs: res.knownAs,
          gender: res.gender,
          created: res.created,
          lastActive: res.lastActive,
          photoUrl: res.photoUrl,
          bio: res.bio,
          posts: res.posts,
          followers: res.followers
        };
        this.authService.currentUser.photoUrl = newUser.photoUrl;
        this.user = newUser;
        if (this.editForm.dirty) {
          this.updateUser();
        } else {
          this.alertify.success('Profile updated');
          this.router.navigate([ '/profile/', this.authService.decodedToken.unique_name]);
        }
      }
    }
  }


}
