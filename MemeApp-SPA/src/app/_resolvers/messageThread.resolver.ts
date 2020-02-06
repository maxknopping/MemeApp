import { Injectable } from "@angular/core";
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Message } from '../_models/Message';
import { UserService } from '../_services/User.service';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from '../_services/auth.service';

@Injectable()
export class MessageThreadResolver implements Resolve<Message[]> {
    constructor(private userService: UserService, private router: Router,
                private auth: AuthService, private alertify: AlertifyService) {

    }

    resolve(route: ActivatedRouteSnapshot): Observable<Message[]> {
        return this.userService.getMessageThread(this.auth.decodedToken.nameid, route.params['recipientId']).pipe(
            catchError(error => {
                this.alertify.error('Problem retreiving data');
                this.router.navigate(['/feed']);
                return of(null);
            })
        );
    }
}