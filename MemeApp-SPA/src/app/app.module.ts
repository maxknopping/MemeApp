import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import { AppComponent } from './app.component';
import { HttpClient } from 'selenium-webdriver/http';
import { NavComponent } from './nav/nav.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './_services/auth.service';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { ErrorInterceptorProvider } from './_services/error.interceptor';
import { BsDropdownModule, TabsModule, BsDatepickerModule, ModalModule } from 'ngx-bootstrap';
import { FeedComponent } from './Posts/feed/feed.component';
import { FeaturedComponent } from './featured/featured.component';
import { MessagesComponent } from './messages/messages.component';
import { RouterModule, ActivatedRouteSnapshot } from '@angular/router';
import { appRoutes } from './routes';
import { UserService } from './_services/User.service';
import { PostCardComponent } from './Posts/Post-Card/Post-Card.component';
import { JwtModule } from '@auth0/angular-jwt';
import { ProfileComponent } from './profile/profile.component';
import { ProfileResolver } from './_resolvers/profile.resolver';
import { FeedResolver } from './_resolvers/feed.resolver';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { ProfileEditResolver } from './_resolvers/profile-edit.resolver';
import { PreventUnsavedChanges } from './_guards/preventUnsavedChanges.guard';
import { UploadPostComponent } from './Posts/uploadPost/uploadPost.component';
import { FileUploadModule } from 'ng2-file-upload';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {TimeAgoPipe} from 'time-ago-pipe';
import { FollowerListResolver } from './_resolvers/followerList.resolver';
import { FollowingListComponent } from './followingList/followingList.component';
import { FollowingListResolver } from './_resolvers/followingList.resolver';
import { CommentListComponent } from './CommentList/CommentList.component';
import { CommentListResolver } from './_resolvers/commentList.resolver';
import { NgxCroppieModule } from 'ngx-croppie';
import { CroppingModalComponent } from './Posts/CroppingModal/CroppingModal.component';
import { CustomImageFormControlComponent } from './Posts/CustomImageFormControl/CustomImageFormControl.component';

export function tokenGetter() {
   return localStorage.getItem('token');
}

@NgModule({
   declarations: [
      AppComponent,
      NavComponent,
      HomeComponent,
      RegisterComponent,
      FeedComponent,
      FeaturedComponent,
      MessagesComponent,
      PostCardComponent,
      ProfileComponent,
      ProfileEditComponent,
      UploadPostComponent,
      TimeAgoPipe,
      FollowingListComponent,
      CommentListComponent,
      CroppingModalComponent,
      CustomImageFormControlComponent
   ],
   imports: [
      HttpClientModule,
      BrowserModule,
      FormsModule,
      ReactiveFormsModule,
      BsDropdownModule.forRoot(),
      TabsModule.forRoot(),
      RouterModule.forRoot(appRoutes),
      FileUploadModule,
      BsDatepickerModule.forRoot(),
      BrowserAnimationsModule,
      NgxCroppieModule,
      JwtModule.forRoot({
         config: {
            tokenGetter: tokenGetter,
            whitelistedDomains: ['localhost:5000'],
            blacklistedRoutes: ['localhost:5000/api/auth/register']
         }}),
      ModalModule.forRoot()
   ],
   //JwtModule.forRoot({
   //   config: {
   //      tokenGetter: tokenGetter,
   //     whitelistedDomains: ['localhost:5000'],
   //      blacklistedRoutes: ['localhost:5000/api/auth/register']
   //   }}),
   providers: [
      AuthService,
      ErrorInterceptorProvider,
      UserService,
      ProfileResolver,
      FeedResolver,
      ProfileEditResolver,
      PreventUnsavedChanges,
      FollowerListResolver,
      FollowingListResolver,
      CommentListResolver
   ],
   bootstrap: [
      AppComponent
   ],
   entryComponents: [
      CroppingModalComponent
   ]
})
export class AppModule { }
