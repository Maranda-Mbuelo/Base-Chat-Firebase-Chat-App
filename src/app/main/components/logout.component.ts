import { AuthService } from '../services/auth.service';
import { DialogComponent } from './dialog.component';
import { Component } from '@angular/core';

@Component({
  selector: 'app-logout',
  template: `
  <section class="flex items-center justify-center bg-center min-h-[100dvh] bg-no-repeat bg-[url('https://img.freepik.com/premium-photo/black-dots-white-background_664601-2305.jpg?w=2000')] bg-gray-500 bg-blend-multiply">
    <div class="px-4 mx-auto max-w-screen-xl text-center py-24 lg:py-56">
    <app-dialog [buttonText]="'Sign Out'" [heading]="'Sign Out'" [bodyText]="'Are you sure you want to sign out? Your log in information will be removed. You will be required to enter your log in information next time you use this app.'" (actionClicked)="signOut()"></app-dialog>
    </div>
  </section>
  `,
  styles: [
  ]
})
export class LogoutComponent {
 constructor(private authService: AuthService) {}

 signOut(): void {
  console.log("Function Envoked")
  this.authService.logOut();
 }
}
/**
 * 
 */