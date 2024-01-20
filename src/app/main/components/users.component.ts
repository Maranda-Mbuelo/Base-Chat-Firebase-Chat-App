import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { Observable, filter, map } from 'rxjs';
import { IUser } from '../interfaces/user.model';
import { Router } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-users',
  template: `
<div class="bg-white mt-12 p-6 sm:p-8 rounded-md h-screen w-full overflow-y-scroll">
  <div class="flex flex-col sm:flex-row items-center justify-between pb-4">
    <div class="mb-2 sm:mb-0">
      <h2 class="text-gray-600 font-semibold text-lg">App Users</h2>
      <span class="text-xs">Results</span>
    </div>
    <div class="flex items-center space-x-4 sm:space-x-8">
      <div class="flex bg-gray-50 items-center px-4 p-2 rounded-full">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20"
          fill="currentColor">
          <path fill-rule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clip-rule="evenodd" />
        </svg>
        <input class="bg-gray-50 outline-dashed outline-transparent border-0 focus:border-0 focus:outline-none outline-none ml-1 block " type="text" name="" id="" placeholder="Search user...">
      </div>
      <button
        class="bg-indigo-600 px-3 sm:px-4 py-1.5 rounded-md text-white font-semibold tracking-wide cursor-pointer text-sm">Add
        Friend</button>
    </div>
  </div>

  <!-- Add this HTML for the modal outside the ngFor loop -->
  <div *ngIf="selectedUser" class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
    <div class="bg-white p-6 rounded-md shadow-md w-96">
      <div class="flex flex-col items-center">
        <img class="w-20 h-20 rounded-full mb-4" [src]="selectedUser.image" alt="Profile Image">
        <h2 class="text-xl font-bold mb-2">{{selectedUser.username}}</h2>
        <p class="text-gray-600 mb-4">{{selectedUser.about}}</p>
      </div>
      <div class="flex justify-between">
        <button (click)="viewProfile(selectedUser.id)" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none">View Profile</button>
        <button (click)="addFriend()" class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none">Add Friend</button>
        <button (click)="sendMessage(selectedUser.id)" class="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 focus:outline-none">Send Message</button>
      </div>
      <button (click)="closeModal()" class="mt-4 px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none">Close</button>
    </div>
  </div>


  <ul *ngIf="users$" class="grid grid-cols-1 sm:grid-cols-3 gap-4">
    <ng-container *ngFor="let user of users$ | async">
      <li (click)="openModal(user)" class="flex flex-col items-center bg-gray-50 rounded-md p-2">
        <hr class="w-full my-2">
        <div class="w-16 h-16 rounded-full overflow-hidden mb-2">
          <img class="w-full h-full object-cover" [src]="user.image" alt="Profile" />
        </div>
        <p class="text-gray-900 text-sm font-semibold">{{user.username}}</p>
        <div class="flex items-center mt-1">
          <span
            class="mr-1 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Active
          </span>
          <span class="text-xs text-gray-500">Last seen 5 min ago</span>
        </div>
        <span class="text-xs text-gray-500 mt-1">Unread messages: 2</span>
      </li>
    </ng-container>
  </ul>
</div>

  `,
  styles: [
  ]
})
export class UsersComponent implements OnInit {
  // users$!: Observable<IUser[]>;
  userId!: string | null;
  selectedUser!: {
    about: string,
    email: string,
    id: string,
    image: string,
    isDarkMode: boolean,
    username: string
  } | undefined;

  users$!: Observable<{
    about: string,
    email: string,
    id: string,
    image: string,
    isDarkMode: boolean,
    username: string
  }[]>;

  constructor(private authService: AuthService,private firebaseService: FirebaseService, private router: Router) {}

  ngOnInit(): void {
    initFlowbite();
    this.userId = this.authService.userId;
    this.users$ = this.firebaseService.getUsers().pipe(
      map((users) => users as {
        about: string,
        email: string,
        id: string,
        image: string,
        isDarkMode: boolean,
        username: string
      }[]),
      // Filter out the user with the specified ID
      map(users => users.filter(user => user.id !== this.userId))
    );
  }

  openModal(user: {
    about: string,
    email: string,
    id: string,
    image: string,
    isDarkMode: boolean,
    username: string
  }): void {
    this.selectedUser = user;
  }

  closeModal(): void {
    this.selectedUser = undefined;
  }

  viewProfile(userId: string): void {
    this.router.navigate(['selecteduser', userId])
    // Implement the action to view the user's profile
    console.log('View Profile');
  }

  addFriend(): void {
    // Implement the action to add the user as a friend
    console.log('Add Friend');
  }

  sendMessage(userId: string): void {
    // Implement the action to send a message to the user
    console.log('Send Message');
    this.router.navigate(['/firebaseapp/message', userId]);
  }
}