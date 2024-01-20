import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { IGetMessages, IMessage } from '../interfaces/message.model';
import { Timestamp } from '@angular/fire/firestore';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, combineLatest, from, map, pipe } from 'rxjs';
import { IUser } from '../interfaces/user.model';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-message',
  template: `
<nav *ngIf="user$ | async as user" class="fixed top-0 z-50 w-full md:w-[50%] lg:w-[50%] bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
  <div class="px-3 py-3 lg:px-5 lg:pl-3">
    <div class="flex items-center justify-end sm:justify-center">
      <div class="flex items-center justify-end rtl:justify-end">
      <button *ngIf="user.image !== ''" type="button" type="button" data-drawer-target="drawer-swipe" data-drawer-show="drawer-swipe" data-drawer-placement="bottom" data-drawer-edge="true" data-drawer-edge-offset="bottom-[60px]" aria-controls="drawer-swipe" class="flex ms-2 md:me-24 gap-x-6">
          <span class="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">{{ user.username }}</span>
          <div class="relative justify-end"> 
            <img class="w-10 h-10 rounded ring-2 ring-transparent hover:ring-blue-200 shadow-md shadow-gray-500" [src]="user.image" alt="">
            <span class="top-0 left-7 absolute w-3.5 h-3.5 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full"></span>
          </div>
        </button>
      </div>
    </div>
  </div>
</nav>


<div class="bg-white min-h-[100dvh] mt-12 p-6 sm:p-8 rounded-md w-full relative">
  <!-- Your chat messages go here -->
<div #messageContainer [scrollTop]="shouldScrollDown ? messageContainer.scrollHeight : null" class="w-full h-auto max-h-[79dvh] overflow-x-visible overflow-y-scroll">

<ng-container *ngFor="let message of mergedMessages$ | async">

    <div class="flex items-end justify-end mb-4" *ngIf="message.senderId === senderId; else receiverMessage">
      <div class="max-w-[70%] mr-2 p-3 bg-gray-400 rounded-lg">
        <p class="text-white">{{message.content}}</p>
        <p class="text-sm text-gray-300">{{message.timestamp.toDate() | date:'shortTime'}}</p>
      </div>
      <div class="flex-shrink-0">
      <img class="w-10 h-10 p-1 rounded-full ring-2 ring-gray-300 hover:ring-blue-200 dark:ring-gray-500" src="data:image/jpeg;base64,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" alt="Bordered avatar">
      <!-- <img src="" alt="Sender Avatar" class="w-8 h-8 rounded-full"> -->
      </div>
    </div>

  <!-- Sender message -->
  <ng-template #receiverMessage>
    <!-- Receiver message -->
  <div class="flex items-start mb-4">
    <div class="flex-shrink-0">
      <!-- <img src="receiver-avatar.jpg" alt="Receiver Avatar" class="w-8 h-8 rounded-full"> -->
      <img class="w-10 h-10 p-1 rounded-full ring-2 ring-gray-300 hover:ring-blue-200 dark:ring-gray-500" src="https://avatars.githubusercontent.com/u/103327479?v=4" alt="Bordered avatar">

    </div>
    <div class="max-w-[70%] ml-2 p-3 bg-gray-200 rounded-lg">
      <p class="text-gray-800">{{message.content}}</p>
      <p class="text-sm text-gray-500">{{message.timestamp.toDate() | date:'shortTime'}}</p>
    </div>
    <button id="dropdownMenuIconButton" data-dropdown-toggle="dropdownDots" data-dropdown-placement="bottom-start" class="inline-flex self-center items-center p-2 text-sm font-medium text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800 dark:focus:ring-gray-600" type="button">
      <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 4 15">
         <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"/>
      </svg>
   </button>
   <div id="dropdownDots" class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-40 dark:bg-gray-700 dark:divide-gray-600">
      <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownMenuIconButton">
         <li>
            <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Reply</a>
         </li>
         <li>
            <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Forward</a>
         </li>
         <li>
            <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Copy</a>
         </li>
         <li>
            <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Report</a>
         </li>
         <li>
            <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Delete</a>
         </li>
      </ul>
   </div>
  </div>

  </ng-template>

  <!-- Your chat messages go here -->
</ng-container>


</div>



  <!-- Message input field -->
  <div class="absolute bottom-12 left-0 right-0 p-4 bg-gray-300">
    <form #messageArea="ngForm" (ngSubmit)="sendMessage(messageArea.value)" class="flex items-center">
      <label for="chat" class="sr-only">Your message</label>
      <button type="button" class="inline-flex justify-center p-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"></path>
        </svg>
      </button>
      <button type="button" class="p-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z" clip-rule="evenodd"></path>
        </svg>
      </button>
      <textarea ngModel name="chat" id="chat" rows="1" class="flex-1 p-2.5 text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-gray-500 focus:border-gray-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Your message..."></textarea>
      <button type="submit" class="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600">
        <svg class="w-6 h-6 rotate-90" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
        </svg>
      </button>
    </form>
  </div>
  <!-- Message input field -->

</div>

  `,
  styles: [
    `
::-webkit-scrollbar{
  width: 0;
}
    `
  ]
})
export class MessageComponent implements OnInit, AfterViewInit {
  @ViewChild('messageContainer', { static: false }) messageContainer: ElementRef | undefined;
  shouldScrollDown: boolean = true;

  user$!: Observable<IUser | null>;
  senderId!: string;
  receiverId!: string;
  senderMessage$!: Observable<IGetMessages[]>; 
  receiverMessage$!: Observable<IGetMessages[]>;
  mergedMessages$!: Observable<IGetMessages[]>;

  constructor(private firebaseService: FirebaseService, private authService: AuthService, private route: ActivatedRoute){}

  ngOnInit(): void {
    initFlowbite();
    if(this.authService.userId !== null){
      this.senderId = this.authService.userId;

      this.route.params.subscribe(params => {
        // Get the userId from the route parameters
        this.receiverId = params['receiverId'];
        
        // Now you can use this.userId in your component
        console.log('User ID from route: ', this.receiverId);
      });

      this.user$ = from(this.firebaseService.getUserById(this.receiverId)).pipe(
        map((userData) => {
          if (userData) {
            return userData as IUser;
          } else {
            console.error('User not found');
            return null;
          }
        })
      );
    }

    this.senderMessage$ = this.firebaseService.getMessagesByUserId(this.senderId, this.receiverId).pipe(
      map((messages) => messages as IGetMessages[])
    )

    this.receiverMessage$ = this.firebaseService.getMessagesByUserId(this.receiverId, this.senderId).pipe(
      map((messages) => messages as IGetMessages[])
    );

    // Combine sender and receiver messages into a single observable
    this.mergedMessages$ = combineLatest([this.senderMessage$, this.receiverMessage$]).pipe(
      map(([senderMessages, receiverMessages]) => [...senderMessages, ...receiverMessages]),
      // Ensure that timestamp is always a Timestamp object
      map(messages => messages.map(message => ({
        ...message,
        timestamp: Timestamp.fromDate(message.timestamp.toDate())
      }))),
      // Sort the messages based on their timestamps in ascending order
      map(messages => messages.sort((a, b) => a.timestamp.toMillis() - b.timestamp.toMillis()))
    );
   }

   ngAfterViewInit(): void {
    this.scrollToBottom();
    this.shouldScrollDown = true
   }

   private scrollToBottom(): void {
    if (this.messageContainer) {
      this.messageContainer.nativeElement.scrollToBottom;
    }
  }

   sendMessage(textMessage: any): void {
    // Check if the message is empty or contains only space bars
    const isInvalidMessage = !textMessage || textMessage.chat.trim() === '';
  
    if (isInvalidMessage) {
      // Handle the case where the message is empty or contains only space bars
      console.error('Invalid message: Message is empty or contains only space bars');
      return;
    }
  
    // Example sender and receiver IDs
    // Example message
    const message: IMessage = {
      // id: '', // Firestore will automatically generate an ID
      senderId: this.senderId,
      receiverId: this.receiverId,
      content: textMessage.chat,
      timestamp: Timestamp.now() // You can use Firestore Timestamp here if needed
    };
  
    // Send the message
    this.firebaseService.addMessage(message, this.senderId, this.receiverId).then(() => {
      // Message sent successfully, clear the text area
      textMessage.chat = '';
      this.scrollToBottom();
  
      // Now retrieve the messages
      this.firebaseService.getMessagesByUserId(this.senderId, this.receiverId).subscribe(
        (messages) => {
          // Log the messages information
          console.log('Messages:', messages);
        },
        (error) => {
          // Handle error
          console.error('Error fetching messages:', error);
        }
      );
    }).catch((error) => {
      // Handle error if the message couldn't be sent
      console.error('Error sending message:', error);
    });
  }
}