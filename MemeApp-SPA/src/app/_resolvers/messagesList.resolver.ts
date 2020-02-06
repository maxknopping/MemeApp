import { Injectable } from "@angular/core";
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { UserService } from '../_services/User.service';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Message } from '../_models/Message';
import { AuthService } from '../_services/auth.service';

@Injectable()
export class MessagesListResolver implements Resolve<Message[]> {
    messageContainer = 'Unread';
    constructor(private userService: UserService, private auth: AuthService,
                private router: Router, private alertify: AlertifyService) {

    }

    resolve(route: ActivatedRouteSnapshot): Observable<Message[]> {
        return this.userService.getMessages(this.auth.decodedToken.nameid).pipe(
            catchError(error => {
                this.alertify.error('Problem retreiving conversations');
                this.router.navigate(['/feed']);
                return of(null);
            })
        );

    }
}