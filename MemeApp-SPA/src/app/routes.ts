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

export const appRoutes: Routes = [
    {path: '', component: HomeComponent},
    {
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [AuthGuard],
        children: [
            {path: 'feed', component: FeedComponent, canActivate: [AuthGuard], resolve: {posts: FeedResolver}},
            {path: 'featured', component: FeaturedComponent},
            {path: 'profile/:username', component: ProfileComponent, resolve: {user: ProfileResolver}},
            {path: 'edit/profile', component: ProfileEditComponent, resolve: {user: ProfileEditResolver},
                canDeactivate: [PreventUnsavedChanges]},
            {path: 'messages', component: MessagesComponent},
            {path: 'upload', component: UploadPostComponent},
        ] 
    },
    {path: '**', redirectTo: '', pathMatch: 'full'}
];

