import {Routes} from '@angular/router';
import { HomeComponent } from './home/home.component';
import { FeedComponent } from './Posts/feed/feed.component';
import { MessagesComponent } from './messages/messages.component';
import { AuthGuard } from './_guards/auth.guard';
import { ProfileComponent } from './profile/profile.component';
import { ProfileResolver } from './_resolvers/profile.resolver';
import { FeedResolver } from './_resolvers/feed.resolver';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { ProfileEditResolver } from './_resolvers/profile-edit.resolver';
import { PreventUnsavedChanges } from './_guards/preventUnsavedChanges.guard';
import { UploadPostComponent } from './Posts/uploadPost/uploadPost.component';
import { FollowerListResolver } from './_resolvers/followerList.resolver';
import { FollowerListGuard } from './_guards/followerList.guard';
import { FollowingListComponent } from './followingList/followingList.component';
import { FollowingListResolver } from './_resolvers/followingList.resolver';
import { CommentListComponent } from './CommentList/CommentList.component';
import { CommentListResolver } from './_resolvers/commentList.resolver';
import { FeaturedComponent } from './Posts/featured/featured.component';
import { MessagesListResolver } from './_resolvers/messagesList.resolver';
import { MessageThreadComponent } from './message-thread/message-thread.component';
import { MessageThreadResolver } from './_resolvers/messageThread.resolver';
import { SinglePostComponent } from './Posts/singlePost/singlePost.component';
import { SinglePostResolver } from './_resolvers/singlePost.resolver';
import { GroupMessageThreadComponent } from './group-message-thread/group-message-thread.component';
import { GroupMessageThreadResolver } from './_resolvers/groupMessageThread.resolver';
import { GroupManagerComponent } from './group-manager/group-manager.component';
import { GroupManagerResolver } from './_resolvers/groupManager.resolver';
import { NotificationsComponent } from './notifications/notifications.component';
import { NotificationsResolver } from './_resolvers/notifications.resolver';
import { SearchComponent } from './search/search.component';
import { TermsAndConditionsComponent } from './Terms and privacy/terms-and-conditions/terms-and-conditions.component';
import { PrivacyPolicyComponent } from './Terms and privacy/privacy-policy/privacy-policy.component';
import { AdminPanelComponent } from './admin/admin-panel/admin-panel.component';
import { BannedComponentComponent } from './banned-component/banned-component.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { BlockedComponent } from './blocked/blocked.component';
import { BlockedResolver } from './_resolvers/blocked.resolver';

export const appRoutes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'post/:postId', component: SinglePostComponent, resolve: {post: SinglePostResolver}},
    {path: 'contact', component: ContactUsComponent},
    {path: 'terms', component: TermsAndConditionsComponent},
    {path: 'privacy', component: PrivacyPolicyComponent},
    {path: 'banned', component: BannedComponentComponent},
    {path: 'about', component: AboutUsComponent},
    {
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [AuthGuard],
        children: [
            {path: 'feed', component: FeedComponent, resolve: {FeedResolver}},
            {path: 'featured', component: FeaturedComponent},
            {path: 'profile/:username', component: ProfileComponent, resolve: {user: ProfileResolver}},
            {path: 'edit/profile', component: ProfileEditComponent, resolve: {user: ProfileEditResolver},
                canDeactivate: [PreventUnsavedChanges]},
            {path: 'messages', component: MessagesComponent},
            {path: 'upload', component: UploadPostComponent},
            {path: 'list/:username/:type', component: FollowingListComponent, resolve: {users: FollowingListResolver}},
            {path: 'comments/:postId/:myPost', component: CommentListComponent, resolve: {comments: CommentListResolver}},
            {path: 'post/:postId', component: SinglePostComponent, resolve: {post: SinglePostResolver}},
            {path: 'messages', component: MessagesComponent, resolve: {messages: MessagesListResolver}},
            {path: 'messages/thread/:recipientId', component: MessageThreadComponent, resolve: {messages: MessageThreadResolver}},
            {path: 'messages/thread/group/:recipientId', component: GroupMessageThreadComponent,
                resolve: {messages: GroupMessageThreadResolver}},
            {path: 'group/:groupId/:groupName', component: GroupManagerComponent, resolve: {users: GroupManagerResolver}},
            {path: 'notifications', component: NotificationsComponent, resolve: {notifications: NotificationsResolver}},
            {path: 'search', component: SearchComponent},
            {path: 'admin', component: AdminPanelComponent, data: {roles: 'Admin'}},
            {path: 'blocked', component: BlockedComponent, resolve: {users: BlockedResolver}}
        ]
    },
    {path: '**', redirectTo: '', pathMatch: 'full'}
];

