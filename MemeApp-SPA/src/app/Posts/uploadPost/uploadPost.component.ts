import { Component, OnInit, ViewChild, ElementRef, HostListener, Input, forwardRef, OnChanges } from '@angular/core';
import { Post } from 'src/app/_models/Post';
import { PostCardComponent } from '../Post-Card/Post-Card.component';
import { AuthService } from 'src/app/_services/auth.service';
import { FileUploader, FileItem } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import * as $ from 'jquery';
import * as Croppie from 'node_modules/croppie/croppie.js';
import { CroppieOptions } from 'croppie';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { NgxCroppieComponent } from 'ngx-croppie';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { CroppingModalComponent } from '../CroppingModal/CroppingModal.component';

@Component({
  selector: 'app-uploadPost',
  templateUrl: './uploadPost.component.html',
  styleUrls: ['./uploadPost.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => UploadPostComponent),
    multi: true
  }]
})
export class UploadPostComponent implements OnInit  {
  bsModalRef: BsModalRef;
  @Input()
  public imgCropToHeight = '400';

  /* Pass the width of the image to this component */
  @Input()
  public imgCropToWidth = '400';
  @Input()
  private responseType: 'blob' | 'base64' = 'blob';

  @ViewChild('ngxCroppie', {static: true})
  ngxCroppie: NgxCroppieComponent;

  public outputoption = { type: 'blob', size: 'original' };
  croppieImage;

  public imagePath;
  imgURL;
  public message: string;
  post = {
    id: 0,
    caption: '',
    url: ''
  };
  uploader: FileUploader;
  baseURL = environment.apiUrl;

  constructor(private authService: AuthService, private http: HttpClient, private sanitizer: DomSanitizer,
              private modalService: BsModalService) { }

  ngOnInit() {
    this.initializeUploader();
    this.outputoption = { type: this.responseType, size: 'original' };
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url: this.baseURL + '/api/users/' + this.authService.decodedToken.nameid + '/posts',
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
      //console.log(this.imgURL);
    };

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const res: Post = JSON.parse(response);
        const newPost = {
          id: res.id,
          url: res.url,
          created: res.created,
          isProfilePicture: res.isProfilePicture,
          caption: this.post.caption
        };
        this.post = newPost;
        this.http.put(this.baseURL + '/api/users/' +
          this.authService.decodedToken.nameid + '/posts/' + this.post.id, this.post).subscribe();
      }
    };
  }

  preview(files) {
    console.log(files);
    const reader = new FileReader();
    reader.readAsDataURL(files);
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
        this.croppieImage = '';
      }
    });
  }

public blobToFile = (theBlob: Blob, fileName: string): File => {

  const b: File = new File([theBlob], fileName);
  return b;
}

cropImageModal() {
  const initialState = {
    list: [
      'Open a modal with component',
      'Pass your data',
      'Do something else',
      '...'
    ],
    title: 'Modal with component'
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

}