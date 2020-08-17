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
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
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
import { NotificationsComponent } from './notifications/notifications.component';
import { NotificationsResolver } from './_resolvers/notifications.resolver';
import { SearchComponent } from './search/search.component';
import { MessagesTimePipe } from './_pipes/messages-time.pipe';
import { TermsAndConditionsComponent } from './Terms and privacy/terms-and-conditions/terms-and-conditions.component';
import { PrivacyPolicyComponent } from './Terms and privacy/privacy-policy/privacy-policy.component';
import { AdminPanelComponent } from './admin/admin-panel/admin-panel.component';
import { UserManagementComponent } from './admin/user-management/user-management.component';
import { PostManagementComponent } from './admin/post-management/post-management.component';
import { AdminManagementComponent } from './admin/admin-management/admin-management.component';
import { AdminService } from './_services/admin.service';
import { BannedComponentComponent } from './banned-component/banned-component.component';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';
import {MatBadgeModule} from '@angular/material/badge';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { ResizableModule } from 'angular-resizable-element';
import { RichTextEditorAllModule, RichTextEditorModule } from '@syncfusion/ej2-angular-richtexteditor';
import { SafeHtmlPipe } from './_pipes/safeHtml.pipe';

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
      GroupManagerComponent,
      NotificationsComponent,
      SearchComponent,
      MessagesTimePipe,
      TermsAndConditionsComponent,
      PrivacyPolicyComponent,
      AdminPanelComponent,
      UserManagementComponent,
      PostManagementComponent,
      AdminManagementComponent,
      BannedComponentComponent,
      SafeHtmlPipe
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
      ModalModule.forRoot(),
      JwtModule.forRoot({
         config: {
            tokenGetter: tokenGetter,
            whitelistedDomains: ['localhost:5000'],
            blacklistedRoutes: ['localhost:5000/api/auth/register']
         }}),
      IconsModule,
      RecaptchaFormsModule,
      RecaptchaModule,
      MatBadgeModule,
      InfiniteScrollModule,
      DragDropModule,
      ResizableModule,
      RichTextEditorAllModule,
      RichTextEditorModule,

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
      GroupManagerResolver,
      NotificationsResolver,
      AdminService
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
