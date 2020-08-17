import { Component, OnInit, ViewChild, ElementRef, HostListener, Input, forwardRef, OnChanges, ViewChildren, QueryList } from '@angular/core';
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
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CroppingModalComponent } from '../CroppingModal/CroppingModal.component';
import { ResizeEvent } from 'angular-resizable-element';
import { UserService } from 'src/app/_services/User.service';
import { ToolbarService, LinkService, ImageService, HtmlEditorService, RichTextEditorComponent, RichTextEditor } from '@syncfusion/ej2-angular-richtexteditor';
import html2canvas from "html2canvas";


@Component({
  selector: 'app-uploadPost',
  templateUrl: './uploadPost.component.html',
  styleUrls: ['./uploadPost.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => UploadPostComponent),
    multi: true,
  }, ToolbarService, LinkService, ImageService, HtmlEditorService]
})
export class UploadPostComponent implements OnInit  {
  @ViewChildren('defaultRTE') rteObj: QueryList<RichTextEditorComponent>;

  boxes = [
    {id: 1, shown: true, style: {}},
    {id: 2, shown: false, style: {}},
    {id: 3, shown: false, style: {}},
    {id: 4, shown: false, style: {}},
    {id: 5, shown: false, style: {}},
  ]
  dragDisabled = false;
  bsModalRef: BsModalRef;
  imgURL;
  public message: string;
  post = {
    id: 0,
    caption: '',
    url: '',
    inJoust: false
  };
  styles = [
    {id: 1, style: {}},
    {id: 2, style: {}},
    {id: 3, style: {}},
    {id: 4, style: {}},
    {id: 5, style: {}},
  ];
  boxStyle = {
    visibility: 'hidden'
  };
  uploader: FileUploader;
  baseURL = environment.apiUrl;
  captionMode = false;
  memeMode = false;
  memes = [];
  rteValue: string;
  rte: RichTextEditorComponent;

  public tools: object = {
    type: 'Multiline',
    items: [ 'Bold',
    'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '-',
    'LowerCase', 'UpperCase', 'Undo', 'Redo']
  };

  public iframe: object = {
    enable: true,
  };

  constructor(private authService: AuthService, private http: HttpClient, private sanitizer: DomSanitizer,
              private modalService: BsModalService, private user: UserService) { }

  ngOnInit() {
    this.initializeUploader();
    this.user.getMemes().subscribe((res: any) => {
      this.memes = res.data.memes;
    });
  }

  ngAfterViewInit(): void {
    this.rteObj.changes.subscribe((comps: QueryList <RichTextEditorComponent>) =>
    {
        this.rte = comps.first;
    });
  }

  hideBoxes() {
    this.boxStyle = {
      visibility: 'hidden'
    };
  }

  unhideBoxes() {
    this.boxStyle = {
      visibility: 'visible'
    };
  }

  onResizeStart(event: ResizeEvent): void {
    console.log(event);
    this.toggleDragDisabled();
  }
  onResizeEnd(event: ResizeEvent, box: any): void {
    console.log(event);
    box.style = {
      position: 'fixed',
      left: `${event.rectangle.left}px`,
      top: `${event.rectangle.top}px`,
      width: `${event.rectangle.width}px`,
      height: `${event.rectangle.height}px`
    };
    this.dragDisabled = false;
  }

  toggleDragDisabled() {
    this.dragDisabled = !this.dragDisabled;
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
          inJoust: this.post.inJoust,
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
      }
    });
  }

  toggleCaptionMode() {
    if (this.captionMode == true) {
      this.uploader.clearQueue();
      this.imgURL = '';
    }
    this.captionMode = !this.captionMode;
  }

public blobToFile = (theBlob: Blob, fileName: string): File => {

  const b: File = new File([theBlob], fileName);
  return b;
}

cropImageModal() {
  const initialState = {
    type: 'square'
  };
  this.bsModalRef = this.modalService.show(CroppingModalComponent, {initialState});
  this.bsModalRef.content.sendPhoto.subscribe(value => {
    const blobImage = value.BlobImage;
    const file = this.blobToFile(blobImage, 'newPhoto');
    const array: File[] = [file];
    this.uploader.addToQueue(array);
    this.bsModalRef.hide();
    this.memeMode = true;
    this.preview(blobImage);
  });
  }

  handleFileInput(files: FileList) {
    const file = files.item(0);
    this.preview(file);
    this.memeMode = true;
  }

  captureMeme() {
    const element = document.getElementById('memeContainer');
    var component = this;
    html2canvas(element, {allowTaint: true, useCORS: true}).then(function(canvas) {
      canvas.toBlob(function(blob) {
        const file = component.blobToFile(blob, 'newMeme');
        const array: File[] = [file];
        component.uploader.addToQueue(array);
        component.preview(blob);
        component.memeMode = false;
        component.captionMode = true;
      });
    })
  }

  onMemeClick(meme: any) {
    this.imgURL = meme.url;
    this.memeMode = true;
  }

  onAddTextBox() {
    for(let box of this.boxes) {
      if (!box.shown) {
        box.shown = true;
        break;
      }
    }
  }

  onRemoveTextBox(box: any) {
    box.shown = false;
  }

  getHtml(box: any) {
    
    const rte = this.rteObj.find(r => r.getID() == `box${box.id}`);
    return rte !== undefined ? rte.getHtml() : null;
  }


}
