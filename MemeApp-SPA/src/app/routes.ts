import {Routes} from '@angular/router';
import { HomeComponent } from './home/home.component';
import { FeedComponent } from './Posts/feed/feed.component';
import { FeaturedComponent } from './featured/featured.component';
import { MessagesComponent } from './messages/messages.component';
import { AuthGuard } from './_guards/auth.guard';

export const appRoutes: Routes = [
    {path: '', component: HomeComponent},
    {
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [AuthGuard],
        children: [
            {path: 'feed', component: FeedComponent, canActivate: [AuthGuard]},
            {path: 'featured', component: FeaturedComponent},
            {path: 'messages', component: MessagesComponent},
        ]
    },
    {path: '**', redirectTo: '', pathMatch: 'full'}
];

