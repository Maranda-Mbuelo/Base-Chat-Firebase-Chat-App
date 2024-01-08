import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { StartUpComponent } from './components/start-up.component';
import { MessagesComponent } from './components/messages.component';


@NgModule({
  declarations: [
    LayoutComponent,
    StartUpComponent,
    MessagesComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule
  ]
})
export class MainModule { }
