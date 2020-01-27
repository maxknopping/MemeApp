import { Injectable } from "@angular/core";
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { User } from '../_models/User';
import { UserService } from '../_services/User.service';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class FollowingListResolver implements Resolve<User[]> {
    constructor(private userService: UserService, private router: Router, private alertify: AlertifyService) {

    }

    resolve(route: ActivatedRouteSnapshot): Observable<User[]> {
        if (route.params['type'] === 'following')
        { 
            return this.userService.getFollowing(route.params['username']).pipe(
                catchError(error => {
                    this.alertify.error('Problem retreiving data');
                    this.router.navigate(['/feed']);
                    return of(null);
                })
            );
        } else if (route.params['type'] === 'followers') {
            return this.userService.getFollowers(route.params['username']).pipe(
                catchError(error => {
                    this.alertify.error('Problem retreiving data');
                    this.router.navigate(['/feed']);
                    return of(null);
                })
            );
        } else if (route.params['type'] === 'likers') {
            return this.userService.getLikers(route.params['username']).pipe(
                catchError(error => {
                    this.alertify.error('Problem retreiving data');
                    this.router.navigate(['/feed']);
                    return of(null);
                })
            );
        } else if (route.params['type'] === 'commentLikers') {
            return this.userService.getCommentLikers(route.params['username']).pipe(
                catchError(error => {
                    this.alertify.error('Problem retreiving data');
                    this.router.navigate(['/feed']);
                    return of(null);
                })
            );
        }

    }
}