import { Component, OnInit, ViewChild, ElementRef, HostListener, Input, forwardRef, OnChanges } from '@angular/core';
import { Post } from 'src/app/_models/Post';
import { PostCardComponent } from '../Post-Card/Post-Card.component';
import { AuthService } from 'src/app/_services/auth.service';
import { FileUploader } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import * as $ from 'jquery';
import * as Croppie from 'node_modules/croppie/croppie.js';
import { CroppieOptions } from 'croppie';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { NgxCroppieComponent } from 'ngx-croppie';

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
export class UploadPostComponent implements OnInit, OnChanges, ControlValueAccessor  {
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
    this.outputoption = { type: this.responseType, size: 'original' };
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
        this.croppieImage = '';
      }
    });
  }

  public get croppieOptions(): CroppieOptions {
    const opts: CroppieOptions = {};
    opts.viewport = {
      width: parseInt(this.imgCropToWidth, 10),
      height: parseInt(this.imgCropToHeight, 10)
    };

    opts.boundary = {
      width: parseInt(this.imgCropToWidth, 10) + 100,
      height: parseInt(this.imgCropToWidth, 10) + 100
    };

    opts.enforceBoundary = true;
    return opts;
}

imageUploadEvent(evt: any) {
  if (!evt.target) {
    return;
  }
  if (!evt.target.files) {
    return;
  }

  if (evt.target.files.length !== 1) {
    return;
  }

  const file = evt.target.files[0];
  if (
    file.type !== 'image/jpeg' &&
    file.type !== 'image/png' &&
    file.type !== 'image/gif' &&
    file.type !== 'image/jpg'
  ) {
    return;
  }

  const fr = new FileReader();
  fr.onloadend = loadEvent => {
    this.croppieImage = fr.result.toString();
  };

  fr.readAsDataURL(file);
}

newImageResultFromCroppie(img: string) {
  this.croppieImage = img;
  this.propagateChange(this.croppieImage);
}

public blobToFile = (theBlob: Blob, fileName: string): File => {
  const b: any = theBlob;
  // A Blob() is almost a File() - it's just missing the two properties below which we will add
  b.lastModifiedDate = new Date();
  b.name = fileName;

  // Cast to a File() type
  return  theBlob as File;
}

dataURItoBlob(dataURI: string) {
  const binary = atob(dataURI.split(',')[1]);
  const array = [];
  for (let i = 0; i < binary.length; i++) {
   array.push(binary.charCodeAt(i));
  }
  return new Blob([new Uint8Array(array)], {
  type: 'image/jpg'
  });
}

ngOnChanges(changes: any) {
  if (this.croppieImage) {
    return;
  }

  if (!changes.imageUrl) {
    return;
  }

  if (!changes.imageUrl.previousValue && changes.imageUrl.currentValue) {
    this.croppieImage = changes.imageUrl.currentValue;
    this.propagateChange(this.croppieImage);
  }
}
writeValue(value: any) {
  if (value !== undefined) {
    this.croppieImage = value;
    this.propagateChange(this.croppieImage);
  }
}

propagateChange = (_: any) => {};

registerOnChange(fn) {
  this.propagateChange = fn;
}

registerOnTouched() {}


}
