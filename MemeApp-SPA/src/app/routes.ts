import {Routes} from '@angular/router';
import { HomeComponent } from './home/home.component';
import { FeedComponent } from './Posts/feed/feed.component';
import { FeaturedComponent } from './featured/featured.component';
import { MessagesComponent } from './messages/messages.component';
import { AuthGuard } from './_guards/auth.guard';
import { ProfileComponent } from './profile/profile.component';
import { ProfileResolver } from './_resolvers/profile.resolver';
import { FeedResolver } from './_resolvers/feed.resolver';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { ProfileEditResolver } from './_resolvers/profile-edit.resolver';
import { PreventUnsavedChanges } from './_guards/preventUnsavedChanges.guard';
import { UploadPostComponent } from './Posts/uploadPost/uploadPost.component';
import { FollowerListComponent } from './listFollowers/FollowerList.component';
import { FollowerListResolver } from './_resolvers/followerList.resolver';
import { FollowerListGuard } from './_guards/followerList.guard';
import { FollowingListComponent } from './followingList/followingList.component';
import { FollowingListResolver } from './_resolvers/followingList.resolver';

export const appRoutes: Routes = [
    {path: '', component: HomeComponent},
    {
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [AuthGuard],
        children: [
            {path: 'feed', component: FeedComponent, canActivate: [AuthGuard]},
            {path: 'featured', component: FeaturedComponent},
            {path: 'profile/:username', component: ProfileComponent, resolve: {user: ProfileResolver}},
            {path: 'edit/profile', component: ProfileEditComponent, resolve: {user: ProfileEditResolver},
                canDeactivate: [PreventUnsavedChanges]},
            {path: 'messages', component: MessagesComponent},
            {path: 'upload', component: UploadPostComponent},
            {path: 'list/:username/:type', component: FollowingListComponent, resolve: {users: FollowingListResolver}},
        ]
    },
    {path: '**', redirectTo: '', pathMatch: 'full'}
];

