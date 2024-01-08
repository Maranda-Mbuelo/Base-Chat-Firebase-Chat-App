import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { StartUpComponent } from './components/start-up.component';
import { MessagesComponent } from './components/messages.component';
import { MessageComponent } from './components/message.component';
import { AsideComponent } from './components/aside.component';
import { SetupComponent } from './components/setup.component';


@NgModule({
  declarations: [
    LayoutComponent,
    StartUpComponent,
    MessagesComponent,
    MessageComponent,
    AsideComponent,
    SetupComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    
  ]
})
export class MainModule { }
