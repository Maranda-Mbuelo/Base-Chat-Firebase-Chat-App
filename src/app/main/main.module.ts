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
    UsersComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
    
  ]
})
export class MainModule { }
