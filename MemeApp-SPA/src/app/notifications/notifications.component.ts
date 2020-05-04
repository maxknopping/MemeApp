import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../_services/User.service';
import { AuthService } from '../_services/auth.service';
import { Notification } from '../_models/notification';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  notifications: Notification[];


  constructor(private route: ActivatedRoute, private userService: UserService, private authService: AuthService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.notifications = data['notifications'];
      console.log(this.notifications);
      this.userService.markNotificationsAsRead(this.authService.decodedToken.nameid).subscribe();
    });
  }

}
