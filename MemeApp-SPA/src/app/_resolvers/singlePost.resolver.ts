import { Injectable } from "@angular/core";
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { User } from '../_models/User';
import { UserService } from '../_services/User.service';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Post } from '../_models/Post';
import { AuthService } from '../_services/auth.service';

@Injectable()
export class SinglePostResolver implements Resolve<Post> {
    constructor(private userService: UserService, private auth: AuthService, private router: Router, private alertify: AlertifyService) {

    }

    resolve(route: ActivatedRouteSnapshot): Observable<Post> {
        return this.auth.getPost(route.params['postId']).pipe(
            catchError(error => {
                this.alertify.error('Problem retreiving data');
                this.router.navigate(['/feed']);
                return of(null);
            })
        );

    }
}