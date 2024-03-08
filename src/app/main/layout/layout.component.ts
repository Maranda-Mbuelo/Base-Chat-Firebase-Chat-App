import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef  } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FirebaseService } from '../services/firebase.service';
import { IUser, LoginForm } from '../interfaces/user.model';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent implements OnInit {
  userId!: string;
  user: IUser = {
    username : '',
    lastname : '',
    firstname : '',
    email : '',
    image : '',
    about : '',
    isDarkMode : false
  };

  constructor(private authService: AuthService, private router: Router, private firebaseService: FirebaseService, private cdr: ChangeDetectorRef) {}

  async ngOnInit(): Promise<void> {
    if(this.authService.userId === null) {
      const formData = localStorage.getItem("form");
      if (formData !== null) {
        const loginForm: LoginForm = JSON.parse(formData);
        console.log("Hey Mbuelo Here");
        console.log(loginForm);
        await this.authService.reLogIn(loginForm);
        if(this.authService.userId !== null){
          this.userId = this.authService.userId;
          console.log("Interesting")
          if (this.userId !== null) {
            const user = await this.firebaseService.getUserById(this.userId);
            if (user !== null) {
              this.user.username = user.username;
              this.user.about = user.about;
              this.user.image = user.image;
              this.user.email = user.email;
              this.user.isDarkMode = user.isDarkMode;
            }
          }
        }
      } else {
        // Redirect to login page if form data is not available
        this.router.navigate(['/login']);
      }
    } else {
      this.userId = this.authService.userId;
      console.log("Interesting")
      if (this.userId !== null) {
        const user = await this.firebaseService.getUserById(this.userId);
        if (user !== null) {
          this.user.username = user.username;
          this.user.about = user.about;
          this.user.image = user.image;
          this.user.email = user.email;
          this.user.isDarkMode = user.isDarkMode;
        }
      }
    }

    console.log(this.userId);
    console.log(this.user);

    // Trigger change detection manually
    this.cdr.detectChanges();
  }

  routeToProfile(): void{
    this.router.navigate(['selecteduser', this.userId]);
  }
  

}
