import { Component, OnInit, Inject, Renderer2 } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { User } from '../_models/User';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import {ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  registerMode = false;
  forgotUsernameMode = false;
  forgotPasswordMode = false;
  tempPasswordMode = false;
  email = '';
  username = '';
  tempPassword = '';
  newPassword = '';
  confirmNewPassword = '';
  model: any = {};

  constructor(private auth: AuthService, private alertify: AlertifyService, private router: Router,  
    @Inject(DOCUMENT) private document: Document, private cdref: ChangeDetectorRef,
  private renderer: Renderer2) { }

  ngOnInit() {
    this.renderer.setStyle(this.document.body, 'background-color', 'black');

  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
    
     }

  calculateMargin() {
    var footer = document.getElementsByClassName('revealFooter');
    var outerHeight = footer[0].clientHeight;
    return `${outerHeight}px`;
  }

  registerToggle() {
    this.registerMode = true;
  }

  forgotUsernameToggle() {
    this.forgotUsernameMode = !this.forgotUsernameMode;
  }

  forgotPasswordToggle() {
    this.forgotPasswordMode = !this.forgotPasswordMode;
  }

  tempPasswordToggle() {
    this.tempPasswordMode = !this.tempPasswordMode;
  }

  sendEmail() {
    this.auth.forgotUsername(this.email).subscribe(() => {
      this.alertify.success('Check your email to receive your username.');
      this.forgotUsernameToggle();
      this.email = '';
    }, error => {
      this.alertify.error(error);
    });
  }

  sendUsername() {
    this.auth.forgotPassword(this.username).subscribe((res: User) => {
      console.log(res);
      this.alertify.success(`An email has been sent to ${res.email} with a temporary password`);
      this.forgotPasswordToggle();
      this.tempPasswordToggle();
    }, error => {
      this.alertify.error(error);
      console.log(error);
    });
  }

  sendNewPassword() {
    this.auth.changeTempPassword(this.username, this.newPassword, this.tempPassword).subscribe(() => {
      this.alertify.success('Password successfully changed');
      this.tempPasswordToggle();
    }, error => {
      this.alertify.error(error);
    });
  }

  cancelRegisterMode(registerMode: boolean) {
    this.registerMode = registerMode;
  }

  login() {
    this.auth.login(this.model).subscribe(
      next => {
        this.alertify.success('logged in successfully');
      },
      error => {
        this.alertify.error('failed to log in');
      }, () => {

        this.renderer.setStyle(this.document.body, 'background-color', 'white');
        this.router.navigate(['/feed']);
      }
    );
    this.username = localStorage.getItem('username');
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.renderer.setStyle(this.document.body, 'background-color', 'white');
  }

  loggedIn() {
    return this.auth.loggedIn();
  }

}
