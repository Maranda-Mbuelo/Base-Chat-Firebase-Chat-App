import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FirebaseService } from '../services/firebase.service';
import { IUser } from '../interfaces/user.model';

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
    email : '',
    image : '',
    about : '',
    isDarkMode : false
  };

  constructor(private authService: AuthService, private firebaseService: FirebaseService, private cdr: ChangeDetectorRef) {}

  async ngOnInit(): Promise<void> {
    if (this.authService.userId !== null) {
      this.userId = this.authService.userId;

      if (this.userId !== null) {
        var user = await this.firebaseService.getUserById(this.userId);

        if(user !== null){
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
  

}
