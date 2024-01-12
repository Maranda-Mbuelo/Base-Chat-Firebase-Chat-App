import { getAuth, onAuthStateChanged  } from 'firebase/auth';
import { FirebaseService } from './../services/firebase.service';
import { Component, OnInit } from '@angular/core';
import { IUser } from '../interfaces/user.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-setup',
  template: `
<div class="bg-white min-h-[100dvh] w-full flex justify-center items-center">
  <div class="max-w-[70%] w-[60%] p-6 bg-gray-100 rounded-md shadow-md">
    <h2 class="text-2xl font-semibold mb-4">Welcome to BaseChat!</h2>
    <!-- Display the uploaded image if available -->
    <div *ngIf="profilePic" class="mt-2">
      <img [src]="profilePic" alt="Profile" class="rounded-full h-16 w-16 object-cover">
    </div>

    <!-- Username -->
    <div class="mb-4">
      <label for="username" class="block text-sm font-medium text-gray-700">Choose your desired username:</label>
      <input type="text" id="username" [(ngModel)]="username" name="username" placeholder="Ex: Mbuelo Maranda" class="mt-1 p-2 block w-full rounded-md border-gray-300 focus:ring focus:ring-blue-200 focus:border-blue-500">
    </div>

    <!-- Username -->
    <div class="mb-4">
      <label for="username" class="block text-sm font-medium text-gray-700">Tell us a bit about yourself:</label>
      <input type="text" id="abot" [(ngModel)]="about" name="about" placeholder="Ex: I'm Mbuelo Maranda, from hillcrest" class="mt-1 p-2 block w-full rounded-md border-gray-300 focus:ring focus:ring-blue-200 focus:border-blue-500">
    </div>

    <!-- Dark/Light Mode Preference -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700">Choose your preferred mode:</label>
      <div class="mt-1">
        <label class="inline-flex items-center">
          <input type="radio" [(ngModel)]="isDarkMode" name="modePreference" value="true" class="form-radio text-blue-500">
          <span class="ml-2">Dark Mode</span>
        </label>
        <label class="inline-flex items-center ml-6">
          <input type="radio" [(ngModel)]="isDarkMode" name="modePreference" value="false" class="form-radio text-blue-500">
          <span class="ml-2">Light Mode</span>
        </label>
      </div>
    </div>

    <!-- Continue Button -->
    <button (click)="toggleModal()" type="button" data-modal-target="popup-modal" data-modal-toggle="popup-modal" class="mb-2 w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md">Upload Profile Picture</button>
    <button (click)="onContinueClick()" type="button" class="w-full bg-gray-500 hover:bg-gray-700 text-white py-2 px-4 rounded-md">Continue</button>
  </div>
</div>



<!-- Modal -->

<div id="popup-modal" [hidden]="!isModalVisible" tabindex="-1" class="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
    <div class="fixed inset-0 bg-black opacity-90"></div>
      <div class="relative p-4 w-full max-w-md max-h-full">
        <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <button (click)="toggleModal()" type="button" class="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="popup-modal">
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
                  <button (click)="toggleModal()" type="button" class="w-full mt-1 text-center text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2">
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
export class SetupComponent implements OnInit {
  username: string = '';
  about: string = '';
  isDarkMode: boolean = false; // 'true' if dark mode, 'false' if light mode
  profilePic: string | null = null;
  selectedFile: any;
  uploadButtonEnabled: boolean = false;
  uploadSuccessMessage: string | null = null;
  uploadedImage!: string;
  isModalVisible: boolean = false;
  userUrlId: string = '';

  constructor(private firebaseService: FirebaseService, private route: ActivatedRoute, private router: Router){}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      // Get the userId from the route parameters
      this.userUrlId = params['id'];
      
      // Now you can use this.userId in your component
      console.log('User ID from route: ', this.userUrlId);
    });
  }

  toggleModal() {
    this.isModalVisible = !this.isModalVisible;
  }

  async uploadImage(): Promise<string> {
    if (this.selectedFile) {
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

  isFormComplete(): boolean {
    // Return true if complete, false otherwise
    return this.username.trim() !== '' && this.isDarkMode !== null;
  }

  onContinueClick() {
    if (this.isFormComplete()) {
      // Proceed with the next step or any desired action
      console.log('Continue button clicked!');
      
      // Check if all required information is available
      if (this.username !== '' && this.about !== '' && this.uploadedImage !== null) {
        var userEmail;
        var userId: string;
        const auth = getAuth();
        const onlineUser = auth.currentUser;
        onAuthStateChanged(auth, (user) => {
          if (user !== null && onlineUser !== null) {
            userEmail = onlineUser.email;
            userId = this.userUrlId;
            console.log('user email: ' + userEmail + ' userid: '+ userId + ' username: ' + this.username)

            if(userEmail !== null && userId !== null){

              // fetch the email:
              this.firebaseService.getUserEmailById(userId)
                .then(email => {
                  if (email !== null) {
                    userEmail = email;
                    console.log('User email:', email);
                  } else {
                    console.log('User not found or error fetching email');
                  }
                });


              const user: IUser = {
                username: this.username,
                email: userEmail,
                about: this.about.toLowerCase(),
                isDarkMode: this.isDarkMode,
                image: this.uploadedImage
              };
              // const newUser = JSON.stringify(user);
              // console.log(`this is the user added: ${JSON.stringify(user)}`);


              this.firebaseService.updateUser(userId, user).then((updatedUser) => {
                setTimeout(() => {
                  this.router.navigate(['/firebaseapp/start-up/', userId]);
                }, 1000);
                  console.log(updatedUser);
                }).catch((err) => {
                  console.log(err);
                })
            }
            // ...
          } else {
            // User is signed out
          }
        });
        
      }
    } else {
      console.log('Please fill in all required information.');
    }
  }
  
}
