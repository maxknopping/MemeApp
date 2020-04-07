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
import { BsDropdownModule, TabsModule, BsDatepickerModule, ModalModule, ButtonsModule } from 'ngx-bootstrap';
import { FeedComponent } from './Posts/feed/feed.component';
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
import { FeaturedComponent } from './Posts/featured/featured.component';
import { PasswordModalComponent } from './PasswordModal/PasswordModal.component';
import { MessagesListResolver } from './_resolvers/messagesList.resolver';
import { MessageThreadComponent } from './message-thread/message-thread.component';
import { MessageThreadResolver } from './_resolvers/messageThread.resolver';
import { SendPostModalComponent } from './Posts/SendPostModal/SendPostModal.component';
import { PostCardMessageComponent } from './Posts/post-card-message/post-card-message.component';
import { SinglePostComponent } from './Posts/singlePost/singlePost.component';
import { SinglePostResolver } from './_resolvers/singlePost.resolver';
import { IconsModule } from './icons/icons.module';
import { GroupMessageThreadComponent } from './group-message-thread/group-message-thread.component';
import { GroupMessageThreadResolver } from './_resolvers/groupMessageThread.resolver';
import { GroupManagerComponent } from './group-manager/group-manager.component';
import { GroupManagerResolver } from './_resolvers/groupManager.resolver';

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
      CustomImageFormControlComponent,
      PasswordModalComponent,
      MessageThreadComponent,
      SendPostModalComponent,
      PostCardMessageComponent,
      SinglePostComponent,
      GroupMessageThreadComponent,
      GroupManagerComponent
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
      ButtonsModule.forRoot(),
      BrowserAnimationsModule,
      NgxCroppieModule,
      JwtModule.forRoot({
         config: {
            tokenGetter: tokenGetter,
            whitelistedDomains: ['localhost:5000'],
            blacklistedRoutes: ['localhost:5000/api/auth/register']
         }}),
      ModalModule.forRoot(),
      IconsModule
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
      CommentListResolver,
      MessagesListResolver,
      MessageThreadResolver,
      SinglePostResolver,
      GroupMessageThreadResolver,
      GroupManagerResolver
   ],
   bootstrap: [
      AppComponent
   ],
   entryComponents: [
      CroppingModalComponent,
      PasswordModalComponent,
      SendPostModalComponent
   ]
})
export class AppModule { }
