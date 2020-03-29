import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { User } from '../_models/User';

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

  constructor(private auth: AuthService, private alertify: AlertifyService) { }

  ngOnInit() {
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

}
