import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import {FormsModule } from '@angular/forms';

@Component({
  selector: 'app-update-caption',
  templateUrl: './update-caption.component.html',
  styleUrls: ['./update-caption.component.css']
})
export class UpdateCaptionComponent implements OnInit {
  @Output() sendPassword = new EventEmitter();
  myform: FormGroup = null;
  type: string;
  title: string;
  closeBtnName: string;
  list: any[] = [];

  constructor(public bsModalRef: BsModalRef, private fb: FormBuilder, 
              private auth: AuthService, private alertify: AlertifyService) {}

  createForm(): FormGroup {
    return this.fb.group({
    CurrentPassword: ['']
    });
  }

  ngOnInit() {
    this.myform = this.createForm();
  }

  submit() {
    this.sendPassword.emit(this.myform.value);
    this.bsModalRef.hide();
    console.log(this.myform.value);

  }

}
