import { Injectable } from '@angular/core';
import { getAuth, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, onAuthStateChanged, User } from "firebase/auth";
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { IUser, LoginForm, SignUpForm } from '../interfaces/user.model';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isAuthenticated: boolean = false;
  isLoading: boolean = false;
  private loadingSubject = new Subject<boolean>();
  public loading$ = this.loadingSubject.asObservable();
  userId: string | null = null;
  user!: IUser;
  private popupTypeSubject = new BehaviorSubject<string>('');
  public popupType$ = this.popupTypeSubject.asObservable();
  private popupMessageSubject = new BehaviorSubject<string>('');
  public popupMessage$ = this.popupMessageSubject.asObservable();
  constructor(private router: Router, private firebaseService: FirebaseService) { }

  logIn(form: LoginForm) {
    this.loadingSubject.next(true); // Start loading
    const auth = getAuth();
    signInWithEmailAndPassword(auth, form.email.toLowerCase(), form.password)
      .then(async (userCredential) => {
        this.userId = userCredential.user.uid;
        this.isAuthenticated = true;
        this.popupTypeSubject.next('success');
        this.popupMessageSubject.next('You are getting Redirectedto Star up Page');
        this.userId = await this.firebaseService.getUserIdByEmail(form.email);
        // Here i am delaying the route so that user can read the message!!!!!!
        setTimeout(() => {
          this.router.navigate(['/firebaseapp/start-up', this.userId]);
        }, 500);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        this.popupTypeSubject.next('error');
        this.popupMessageSubject.next('Credentials not found on our database!');
        this.isAuthenticated = false;
      })
      .finally(() => {
        this.isLoading = false;
        this.loadingSubject.next(false); // Loading complete
      });
  }


  signUp(form: SignUpForm) {
    console.log(form);
    this.loadingSubject.next(true); // Start loading
    this.setCookie();
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, form.email.toLowerCase(), form.password)
      .then((userCredential) => {
        console.log("Success")
        this.isAuthenticated = true;
        this.userId = userCredential.user.uid;
        localStorage.setItem("form", JSON.stringify(form));
        this.popupTypeSubject.next('success');
        this.popupMessageSubject.next('Account created successfully! You are being redirected to Home.');
        const user: IUser = {
          firstname: 'demo firstname',
          lastname: 'demo lastname',
          username: 'demo username'.toLowerCase(),
          email: form.email.toLowerCase(),
          image: 'demo image',
          about: 'demo about',
          isDarkMode: false,
          followers:[],
          following: []
        };
        
        this.firebaseService.addUser(user)
          .then((userId) => {
            this.userId = userId;
            console.log('User added successfully with ID:', userId);
            // Introduce a delay of 2 seconds before navigating
            setTimeout(() => {
              this.router.navigate(['/basic/setup/', userId]);
            }, 1000);
            })
          .catch((error) => {
            console.error('Error adding user:', error);
          });
      })
      .catch((error) => {
        console.error('Error creating user:', error.code, error.message);
        this.popupTypeSubject.next('error');
        this.popupMessageSubject.next('An error occurred while creating your account. Try Again');
        this.isAuthenticated = false;
      })
      .finally(() => {
        this.loadingSubject.next(false); // Loading complete
      });
  }


  logOut() {
    const auth = getAuth();
    signOut(auth).then(() => {
      this.router.navigate(['/login']);
      localStorage.removeItem("form");
      this.isAuthenticated = false;
    }).catch((error) => {
      console.log(error);
    });
  }

  setCookie() {
    document.cookie = "myCookie=myValue; SameSite=None; Secure";
  }

  getUserEmail(userId: string): Promise<string> {
    const auth = getAuth();
    return new Promise<string>((resolve, reject) => {
      onAuthStateChanged(auth, (user: User | null) => {
        if (user) {
          if (user.uid === userId) {
            resolve(user.email || '');
          } else {
            resolve('');
          }
        } else {
          resolve('');
        }
      });
    });
  }

  reLogIn(form: LoginForm) {
    this.loadingSubject.next(true); // Start loading
    const auth = getAuth();
    signInWithEmailAndPassword(auth, form.email.toLowerCase(), form.password)
      .then(async (userCredential) => {
        this.userId = userCredential.user.uid;
        this.isAuthenticated = true;
        this.userId = await this.firebaseService.getUserIdByEmail(form.email);
        // Here i am delaying the route so that user can read the message!!!!!!
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        this.popupTypeSubject.next('error');
        this.popupMessageSubject.next('Credentials not found on our database!');
        this.isAuthenticated = false;
      })
      .finally(() => {
        this.isLoading = false;
        this.loadingSubject.next(false); // Loading complete
      });
  }
}