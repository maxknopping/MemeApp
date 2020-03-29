import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import {FormsModule } from '@angular/forms';

@Component({
  selector: 'app-PasswordModal',
  templateUrl: './PasswordModal.component.html',
  styleUrls: ['./PasswordModal.component.css']
})
export class PasswordModalComponent implements OnInit {
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
    CurrentPassword: ['', Validators.compose([Validators.required])],
    NewPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(50)]]
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
