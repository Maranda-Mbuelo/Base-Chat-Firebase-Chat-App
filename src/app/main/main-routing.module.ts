import { AuthenticationModule } from './authentication/authentication.module';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { StartUpComponent } from './components/start-up.component';
import { MessagesComponent } from './components/messages.component';
import { MessageComponent } from './components/message.component';
import { SetupComponent } from './components/setup.component';
import { AuthGuard } from './authentication/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'basic/setup/:id', component: SetupComponent, canActivate: [AuthGuard] },
  { path: 'firebaseapp', component: LayoutComponent, children: [
    { path: '', redirectTo: 'start-up', pathMatch: 'full'},
    { path: 'start-up/:userId', component: StartUpComponent,  },
    { path: 'messages', component: MessagesComponent, canActivate: [AuthGuard] },
    { path: 'message/:userId', component: MessageComponent, canActivate: [AuthGuard] },
  ]},
  {path: '',  loadChildren:() => import('./authentication/authentication.module').then(module => module.AuthenticationModule)},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
