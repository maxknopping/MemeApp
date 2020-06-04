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

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    public authService: AuthService,
    private alertify: AlertifyService,
    private router: Router
  ) {}

  canActivate(next: ActivatedRouteSnapshot): boolean {
    let roles = null;
    if (next.firstChild.data['roles']) {
      roles = next.firstChild.data['roles'] as string;
    }
    if (roles) {
       if (this.authService.roleMatch()) {
         return true;
       } else {
         this.router.navigate(['/feed']);
         this.alertify.error('You are not authorized to access this page.');
       }
    }

    if (this.authService.currentUser.isBanned) {
      this.router.navigate(['/banned']);
      this.alertify.error('You are banned');
      return false;
    }

    if (this.authService.loggedIn()) {
      return true;
    }

    this.alertify.error('Please login or register');
    this.router.navigate(['/home']);
    return false;
  }
}
