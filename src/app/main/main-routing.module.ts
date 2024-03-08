import { AuthenticationModule } from './authentication/authentication.module';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { StartUpComponent } from './components/start-up.component';
import { MessagesComponent } from './components/messages.component';
import { MessageComponent } from './components/message.component';
import { SetupComponent } from './components/setup.component';
import { AuthGuard } from './authentication/auth.guard';
import { ProfileComponent } from './components/profile.component';
import { UsersComponent } from './components/users.component';
import { ProUpgradeComponent } from './components/pro-upgrade.component';
import { PostsComponent } from './components/posts.component';
import { SingleUserComponent } from './components/single-user.component';
import { EditPostComponent } from './components/edit-post.component';
import { ViewPostComponent } from './components/view-post.component';
import { CatchUpComponent } from './components/catch-up.component';
import { EditUserComponent } from './components/edit-user.component';
import { LogoutComponent } from './components/logout.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'basic/setup/:id', component: SetupComponent, },
  { path: 'selecteduser/:id', component: SingleUserComponent,  },
  { path: 'firebaseapp', component: LayoutComponent, children: [
    { path: '', redirectTo: 'start-up', pathMatch: 'full'},
    { path: 'start-up/:userId', component: StartUpComponent,  },
    { path: 'messages', component: MessagesComponent, canActivate: [AuthGuard] },
    { path: 'profile/:userID', component: ProfileComponent, canActivate: [AuthGuard] },
    { path: 'message/:receiverId', component: MessageComponent, canActivate: [AuthGuard] },
    { path: 'users', component: UsersComponent, canActivate: [AuthGuard] },
    { path: 'logout', component: LogoutComponent, canActivate: [AuthGuard] },
    { path: 'pro-upgrade', component: ProUpgradeComponent, canActivate: [AuthGuard] },
    { path: 'edit/:postId/post/:userId', component: EditPostComponent, canActivate: [AuthGuard] },
    { path: 'view/:postId/post/:userId', component: ViewPostComponent,  },
    { path: 'edit/user/:userId', component: EditUserComponent,  },
    { path: 'news/catchup', component: CatchUpComponent, canActivate: [AuthGuard] },
    { path: 'posts', component: PostsComponent,  },
  ]},
  {path: '',  loadChildren:() => import('./authentication/authentication.module').then(module => module.AuthenticationModule)},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
