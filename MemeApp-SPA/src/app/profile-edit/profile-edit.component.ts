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
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { CroppingModalComponent } from '../Posts/CroppingModal/CroppingModal.component';
import { PasswordModalComponent } from '../PasswordModal/PasswordModal.component';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})
export class ProfileEditComponent implements OnInit {
  @ViewChild('editForm', {static: true}) editForm: NgForm;
  bsModalRef: BsModalRef;
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
              private sanitizer: DomSanitizer, private http: HttpClient,
              private modalService: BsModalService, private auth: AuthService) { }

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
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });
    this.uploader.onAfterAddingFile = (file) => {
      //this.imgURL = (window.URL) ? this.sanitizer.
      //  bypassSecurityTrustUrl(window.URL.createObjectURL(file._file)) :
      //  this.sanitizer.bypassSecurityTrustUrl((window as any).webkitURL.createObjectURL(file._file));
      file.withCredentials = false;
      console.log(this.imgURL);
    };

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const res: User = JSON.parse(response);
        const newUser = {
          id: res.id,
          username: res.username,
          email: res.email,
          created: res.created,
          name: res.name,
          lastActive: res.lastActive,
          photoUrl: res.photoUrl,
          bio: res.bio,
          posts: res.posts,
          followers: res.followers,
          following: res.following
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
    };
  }

  public blobToFile = (theBlob: Blob, fileName: string): File => {

    const b: File = new File([theBlob], fileName);
    return b;
  }

  cropImageModal() {
    const initialState = {
      type: 'circle'
    };
    this.bsModalRef = this.modalService.show(CroppingModalComponent, {initialState});
    this.bsModalRef.content.sendPhoto.subscribe(value => {
      const blobImage = value.BlobImage;
      const file = this.blobToFile(blobImage, 'newPhoto');
      const array: File[] = [file];
      this.uploader.addToQueue(array);
      this.bsModalRef.hide();
      this.preview(blobImage);
    });
  }

  changePasswordModal() {
    const initialState = {
      type: 'circle'
    };
    console.log('opening modal');
    this.bsModalRef = this.modalService.show(PasswordModalComponent, {initialState});
    this.bsModalRef.content.sendPassword.subscribe(value => {
      console.log(`${this.auth.decodedToken.unique_name} ${value.NewPassword} ${value.CurrentPassword}`);
      this.auth.changePassword(this.auth.decodedToken.unique_name,
        value.NewPassword,
        value.CurrentPassword)
        .subscribe(() => {
           this.alertify.success('Your password was successfully changed');
        }, error => {
          this.alertify.error(error);
        });
    });
  }

  preview(files) {
    console.log(files);
    const reader = new FileReader();
    reader.readAsDataURL(files);
    reader.onload = (event) => {
      this.imgURL = reader.result;
    };

  }


}
