import { getAuth, onAuthStateChanged  } from 'firebase/auth';
import { FirebaseService } from './../services/firebase.service';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { IFetchUser, IUser } from '../interfaces/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { initFlowbite, initModals, initPopovers } from 'flowbite';

@Component({
  selector: 'app-setup',
  template: `
<div class="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
  <div class="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]" aria-hidden="true">
    <div class="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-gray-300 to-gray-600 opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]" style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"></div>
  </div>
  <div class="absolute inset-x-0 bottom-[10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:bottom-[20rem]" aria-hidden="true">
    <div class="relative right-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[-30deg] bg-gradient-to-bl from-gray-500 to-gray-800 opacity-30 sm:right-[calc(90%-40rem)] sm:w-[72.1875rem]" style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"></div>
  </div>

  <div class="mx-auto max-w-2xl text-center">
    <h1 class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-700 md:text-5xl lg:text-6xl dark:text-white">Welcome to <span class="text-indigo-500 dark:text-gray-700">Base Chat</span> initial set up page.</h1>
    <p class="text-lg font-normal text-gray-500 lg:text-xl dark:text-gray-400">Please continue filling all the required informations, for better use and good experience</p>
  </div>
  <form #myForm="ngForm" (ngSubmit)="onContinueClick(myForm.value)" class="mx-auto mt-16 max-w-xl sm:mt-20">
    <div class="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
      <div>
        <label for="first-name" class="block text-sm font-semibold leading-6 text-black">First name</label>
        <div class="mt-2.5">
          <input type="text" name="firstname" ngModel autocomplete="given-name" class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm shadow-gray-500 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-400 sm:text-sm sm:leading-6">
        </div>
      </div>
      <div>
        <label for="last-name" class="block text-sm font-semibold leading-6 text-black">Last name</label>
        <div class="mt-2.5">
          <input type="text" name="lastname" ngModel autocomplete="family-name" class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset shadow-gray-500 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-400 sm:text-sm sm:leading-6">
        </div>
      </div>

      <div class="sm:col-span-2">
        <label for="company" class="block text-sm font-semibold leading-6 text-black">Username</label>
        <div class="mt-2.5">
          <input type="text" [(ngModel)]="username" name="username" ngModel class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset shadow-gray-500 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-400 sm:text-sm sm:leading-6">
        </div>
      </div>

      <div [ngClass]="{'hidden': checkBoolean()}" class="sm:col-span-2">
        <label for="company" class="block text-sm font-semibold leading-6 text-black">Upload Profile Picture(*)</label>
        <div class="mt-2.5">
          <button data-modal-target="popup-modal" data-modal-toggle="popup-modal" [disabled]="checkBoolean()" [ngClass]="{'bg-white hover:bg-red-200': checkBoolean()}" type="button" class="mb-2 w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md">Choose Photo</button>
        </div>
      </div>

      <div class="sm:col-span-2">
        <label class="block text-sm font-medium text-gray-700">Choose your preferred mode:</label>
        <div class="mt-1">
          <label class="inline-flex items-center">
            <input type="radio" ngModel name="isDarkMode" value="true" class="form-radio text-gray-500">
            <span class="ml-2">Dark Mode</span>
          </label>
          <label class="inline-flex items-center ml-6">
            <input type="radio" ngModel name="isDarkMode" value="false" class="form-radio text-gray-500">
            <span class="ml-2">Light Mode</span>
          </label>
        </div>
      </div>
      
      <div class="sm:col-span-2">
        <label for="message" class="block text-sm font-semibold leading-6 text-gray-600">About</label>
        <div class="mt-2.5">
          <textarea name="about" ngModel rows="4" placeholder="Ex: Hi, I am Sasha from Indiana" class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"></textarea>
        </div>
      </div>
      
    </div>
    <div class="mt-10">
      <button type="submit" class="block w-full rounded-md bg-gray-700 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600">Submit</button>
    </div>
  </form>
</div>

<!-- Modal -->

<div id="popup-modal" tabindex="-1" class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
    <div class="fixed inset-0 bg-black opacity-90"></div>
      <div class="relative p-4 w-full max-w-md max-h-full">
        <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <button type="button" class="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="popup-modal">
                <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                </svg>
                <span class="sr-only">Close modal</span>
            </button>
            <div class="p-4 md:p-5 text-center">
                <svg *ngIf="uploadSuccessMessage == null" class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                </svg>
                <svg *ngIf="uploadSuccessMessage !== null" class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" height="30px" width="30px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve" fill="#000000" stroke="#000000" stroke-width="1.024"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="1.024"></g><g id="SVGRepo_iconCarrier"> <g transform="translate(1 1)"> <path style="fill:#E2E3E5;" d="M511,255c0,130.844-106.193,237.037-237.037,237.037S36.926,385.844,36.926,255 S143.119,17.963,273.963,17.963S511,124.156,511,255"></path> <path style="fill:#CCCCCC;" d="M482.556,255c0,130.844-106.193,237.037-237.037,237.037S8.481,385.844,8.481,255 S114.674,17.963,245.519,17.963S482.556,124.156,482.556,255"></path> <path style="fill:#E2E3E5;" d="M454.111,255c0,130.844-92.919,237.037-208.593,237.037S36.926,385.844,36.926,255 S130.793,17.963,245.519,17.963S454.111,124.156,454.111,255"></path> <path style="fill:#FFFFFF;" d="M36.926,255c0-130.844,93.867-237.037,208.593-237.037C114.674,17.963,8.481,124.156,8.481,255 s106.193,237.037,237.037,237.037C130.793,492.037,36.926,385.844,36.926,255"></path> <g> <path style="fill:#B6B6B6;" d="M245.519,501.519C109.933,501.519-1,390.585-1,255S109.933,8.481,245.519,8.481 S492.037,119.415,492.037,255S381.104,501.519,245.519,501.519z M245.519,27.444c-125.156,0-227.556,102.4-227.556,227.556 s102.4,227.556,227.556,227.556S473.074,380.156,473.074,255S370.674,27.444,245.519,27.444z"></path> <path style="fill:#B6B6B6;" d="M217.074,340.333c-1.896,0-3.793-0.948-5.689-1.896l-94.815-75.852 c-3.793-2.844-4.741-9.481-1.896-13.274s9.481-4.741,13.274-1.896l88.178,70.163l146.015-164.03 c3.793-3.793,9.481-4.741,13.274-0.948s4.741,9.481,0.948,13.274L224.659,336.541 C222.763,339.385,219.919,340.333,217.074,340.333z"></path> </g> </g> </g></svg>
    <!-- InPut Area -->
                <p *ngIf="uploadSuccessMessage !== null" class="block text-sm font-medium text-gray-700">{{uploadSuccessMessage}}</p>
                <div *ngIf="uploadSuccessMessage == null" class="flex items-center justify-center w-full">
                    <label for="profilePic" class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                        <div class="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                            </svg>
                            <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to upload</span> or drag and drop</p>
                            <p class="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                        </div>
                        <input type="file" id="profilePic" (change)="onFileSelected($event)" name="profilePic" class="hidden" />
                    <!-- Message for drag and drop -->
                      
                    </label>
                </div> 
    <!-- InPut Area -->
                <ng-container *ngIf="uploadSuccessMessage !== null">
                  <button type="button" class="w-full mt-1 text-center text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2">
                      Continue
                  </button>
                </ng-container>         
            </div>
        </div>
    </div>
</div>


<!-- Modal -->

  `,
  styles: [
  ]
})
export class SetupComponent implements OnInit, AfterViewInit {

  username: string| null = null;
  selectedFile: any;
  uploadButtonEnabled: boolean = false;
  uploadSuccessMessage: string | null = null;
  uploadedImage!: string;
  userUrlId: string = '';

  constructor(private firebaseService: FirebaseService, private route: ActivatedRoute, private router: Router){}

  ngOnInit(): void {
    initFlowbite();
    initModals();
    this.route.params.subscribe(params => {
      // Get the userId from the route parameters
      this.userUrlId = params['id']; 
    });
  }

  ngAfterViewInit(): void {
    initFlowbite();
    initModals();
    initPopovers();
  }

  checkBoolean(): boolean{
    (this.username?.trim() == '') ? this.username = null : null;
    return (this.username == null)? true: false;
  }

  consoleLog(form: any){
    console.log('Form: ', form);
  }

  async uploadImage(): Promise<string> {
    if (this.selectedFile && this.username !== null) {
      try {
        const imageUrlPromise = this.firebaseService.uploadImage(this.selectedFile, this.username);
        const imageUrl = await imageUrlPromise;
        console.log('Image uploaded successfully. URL:', imageUrl);
        this.uploadSuccessMessage = 'Image uploaded successfully!';
        this.uploadedImage = imageUrl;
        return imageUrl;
      } catch (error) {
        console.error('Error uploading image:', error);
        return 'demo image';
      } finally {
        // Reset the file input and button state
        this.selectedFile = null;
        this.uploadButtonEnabled = false;
      }
    }
    return 'demo image';
  }
  

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    // Reset success message when a new file is selected
    this.uploadSuccessMessage = null;
    this.uploadImage();
  }

  isFormComplete(form: IUser): boolean {
    // Return true if complete, false otherwise
    return form.username.trim() !== '' && form.lastname.trim() !== '' && form.firstname.trim() !== '' && form.isDarkMode !== null;
  }

  async onContinueClick(myUser: IUser) {
    if (this.isFormComplete(myUser)) {
      // Proceed with the next step or any desired action
      console.log('Continue button clicked!');
  
      try {
        // Upload the image and get the URL
        const imageUrl = await this.uploadImage();
  
        // Check if all required information is available
        if (myUser.username !== '' && myUser.about !== '' && imageUrl !== null) {
          var userEmail;
          var userId: string;
          const auth = getAuth();
          const onlineUser = auth.currentUser;
          onAuthStateChanged(auth, (user) => {
            if (user !== null && onlineUser !== null) {
              userEmail = onlineUser.email;
              userId = this.userUrlId;
              console.log('user email: ' + userEmail + ' userid: ' + userId + ' username: ' + myUser.username)
  
              if (userEmail !== null && userId !== null) {
                // Fetch the email:
                this.firebaseService.getUserEmailById(userId)
                  .then(email => {
                    if (email !== null) {
                      userEmail = email;
                      myUser.email = email;
                      myUser.image = imageUrl; // Use the uploaded image URL here
                      console.log('User :', myUser);
                      var newUser:IFetchUser = {
                        username : myUser.username,
                        firstname : myUser.firstname,
                        lastname : myUser.lastname,
                        email : myUser.email,
                        image : this.uploadedImage,
                        isDarkMode : myUser.isDarkMode,
                        followers:[],
                        following: [],
                        followersCount: 0,
                        followingCount: 0,
                        postsCount: 0
                      }

                      console.log('User: ', newUser)
  
                      // Update the user in the database
                      this.firebaseService.updateUser(userId, newUser)
                        .then((updatedUser) => {
                          setTimeout(() => {
                            this.router.navigate(['/firebaseapp/start-up/', userId]);
                          }, 1000);
                          console.log(updatedUser);
                        })
                        .catch((err) => {
                          console.log(err);
                        });
                    } else {
                      console.log('User not found or error fetching email');
                    }
                  });
              }
            } else {
              // User is signed out
            }
          });
        }
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    } else {
      console.log('Please fill in all required information.');
    }
  }  
  
}
