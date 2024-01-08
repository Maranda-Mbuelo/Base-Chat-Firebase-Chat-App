import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthformComponent } from './authform.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: AuthformComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule { }
