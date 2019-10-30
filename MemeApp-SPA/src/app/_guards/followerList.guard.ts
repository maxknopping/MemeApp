import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { User } from '../_models/User';
import { ProfileComponent } from '../profile/profile.component';

@Injectable({
  providedIn: 'root'
})
export class FollowerListGuard implements CanActivate {
  constructor(
    public authService: AuthService,
    private alertify: AlertifyService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (1 > 0) {
      return true;
    }
    return false;
  }
}