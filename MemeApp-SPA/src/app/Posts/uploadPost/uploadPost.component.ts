import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Post } from 'src/app/_models/Post';
import { PostCardComponent } from '../Post-Card/Post-Card.component';
import { AuthService } from 'src/app/_services/auth.service';
import { FileUploader } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-uploadPost',
  templateUrl: './uploadPost.component.html',
  styleUrls: ['./uploadPost.component.css']
})
export class UploadPostComponent implements OnInit {
  public imagePath;
  imgURL: any;
  public message: string;
  post = {
    id: 0,
    caption: '',
    url: ''
  };
  uploader: FileUploader;
  baseURL = environment.apiUrl;

  constructor(private authService: AuthService, private http: HttpClient, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.initializeUploader();
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url: this.baseURL + '/api/users/' + this.authService.decodedToken.nameid + '/posts',
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
        const res: Post = JSON.parse(response);
        const newPost = {
          id: res.id,
          url: res.url,
          dateAdded: res.dateAdded,
          isProfilePicture: res.isProfilePicture,
          caption: this.post.caption
        };
        this.post = newPost;
        this.http.put(this.baseURL + '/api/users/' +
          this.authService.decodedToken.nameid + '/posts/' + this.post.id, this.post).subscribe();
      }
    }
  }

  preview(files) {
    console.log(files);
    if (files.length === 0) {
      return;
    }
    const reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (event) => {
      this.imgURL = reader.result;
    };
  }

  postPhoto() {
    this.uploader.uploadAll();
  }

  removePhoto(item) {
    this.uploader.queue.forEach(element => {
      if (element === item) {
        element.remove();
        this.imgURL = '';
      }
    });
  }

}
