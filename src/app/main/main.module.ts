import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { StartUpComponent } from './components/start-up.component';
import { MessagesComponent } from './components/messages.component';
import { MessageComponent } from './components/message.component';
import { AsideComponent } from './components/aside.component';
import { SetupComponent } from './components/setup.component';
import { DocumentationComponent } from './components/documentation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent } from './components/profile.component';
import { UsersComponent } from './components/users.component';
import { ProUpgradeComponent } from './components/pro-upgrade.component';
import { PostsComponent } from './components/posts.component';
import { SingleUserComponent } from './components/single-user.component';
import { EditPostComponent } from './components/edit-post.component';
import { ViewPostComponent } from './components/view-post.component';
import { CatchUpComponent } from './components/catch-up.component';
import { BlockComponent } from './components/block.component';
import { EditUserComponent } from './components/edit-user.component';
import { LogoutComponent } from './components/logout.component';
import { DialogComponent } from './components/dialog.component';
import { DeactivateComponent } from './components/deactivate.component';


@NgModule({
  declarations: [
    LayoutComponent,
    StartUpComponent,
    MessagesComponent,
    MessageComponent,
    AsideComponent,
    SetupComponent,
    DocumentationComponent,
    ProfileComponent,
    UsersComponent,
    ProUpgradeComponent,
    PostsComponent,
    SingleUserComponent,
    EditPostComponent,
    ViewPostComponent,
    CatchUpComponent,
    BlockComponent,
    EditUserComponent,
    LogoutComponent,
    DialogComponent,
    DeactivateComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    
  ]
})
export class MainModule { }
