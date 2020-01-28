import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-CroppingModal',
  templateUrl: './CroppingModal.component.html',
  styleUrls: ['./CroppingModal.component.css']
})
export class CroppingModalComponent implements OnInit {
  @Output() sendPhoto = new EventEmitter();

  myform: FormGroup = null;

  title: string;
  closeBtnName: string;
  list: any[] = [];

  constructor(public bsModalRef: BsModalRef, private fb: FormBuilder) {}

  createForm(): FormGroup {
    return this.fb.group({
    BlobImage: [null, Validators.compose([Validators.required])]
    });
  }

  ngOnInit() {
    this.myform = this.createForm();
  }

  submit() {
    this.sendPhoto.emit(this.myform.value);
    console.log(this.myform.value);
  }

}
