import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { IMessage } from '../interfaces/message.model';
import { Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-message',
  template: `
<nav class="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
  <div class="px-3 py-3 lg:px-5 lg:pl-3">
    <div class="flex items-center justify-between">
      <div class="flex items-center justify-start rtl:justify-end">
        <a href="https://flowbite.com" class="flex ms-2 md:me-24 gap-x-6">
          <!-- <svg width="46px" height="46px" viewBox="-409.6 -409.6 1843.20 1843.20" class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"><path transform="translate(-409.6, -409.6), scale(57.6)" d="M16,30.097427585407306C19.750679654497812,29.996656755149466,23.81866504071083,29.06324349242888,26.037871729871693,26.037871729871696C28.09613734537485,23.23190565947371,26.189585738315504,19.476636744219572,26.340912804399665,16C26.50619403273122,12.202775839005225,29.27906613336736,8.053280061677757,26.95147186076982,5.048528139230182C24.57243112987115,1.977362647071017,19.875069793216703,2.375462720982515,16,2.6506469814400937C12.457141311578411,2.9022395978584163,8.97761478732196,3.955110812322501,6.500811611978008,6.500811611978007C4.055463730534557,9.014182120864735,3.202417372066293,12.498503867456677,3.011937950590724,15.999999999999998C2.8075275098647907,19.757583691239482,2.858037357580134,23.824537996731028,5.407854332366838,26.592145667633154C8.027486465867891,29.435531706439214,12.135218677041479,30.201264025347598,16,30.097427585407306" fill="#d7e1e5" strokewidth="0"></path></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M885.8 383.8h-90.4c12.3 15.8 19.7 35.6 19.7 57.1v194c0 51.3-42 93.2-93.2 93.2H494.1c12.1 31 42.2 53.1 77.4 53.1h314.3c45.6 0 83-37.3 83-83V466.8c-0.1-45.7-37.4-83-83-83z" fill="#FFB89A"></path><path d="M780.7 582.4V286.3c0-74.2-60.7-134.9-134.9-134.9H198.2c-74.2 0-134.9 60.7-134.9 134.9v296.1c0 70.5 54.8 128.7 123.8 134.4 0 0-20 155.4 4.9 155.4s188.4-154.9 188.4-154.9h265.3c74.3 0 135-60.7 135-134.9z m-424.1 74.9l-17.4 16.4c-0.3 0.3-34.5 32.7-73.2 67.1-8.5 7.5-16.2 14.3-23.3 20.5 1.9-20.9 3.9-36.6 3.9-36.8l8-62.3L192 657c-38.5-3.2-68.7-36-68.7-74.6V286.3c0-19.9 7.8-38.6 22.1-52.8 14.2-14.2 33-22.1 52.8-22.1h447.6c19.9 0 38.6 7.8 52.8 22.1 14.2 14.2 22.1 33 22.1 52.8v296.1c0 19.9-7.8 38.6-22.1 52.8-14.2 14.2-33 22.1-52.8 22.1H356.6z" fill="#45484C"></path><path d="M830.3 337.9c-16.2-3.3-32.1 7.1-35.4 23.3-3.3 16.2 7.1 32.1 23.3 35.4 39 8 67.3 42.7 67.3 82.5v177c0 41.6-31.1 77.5-72.3 83.4l-32.7 4.7 7.8 32.1c2 8.1 3.9 16.8 5.8 25.3-17.6-16.4-37.3-35.2-55.2-52.7l-8.7-8.6H562.5c-21.9 0-36.6-1.4-47.2-8.6-13.7-9.3-32.4-5.8-41.7 7.9-9.3 13.7-5.8 32.4 7.9 41.7 25.7 17.5 55.3 19 81 19h143.2c10 9.7 27.3 26.3 45 42.8 16.2 15.1 29.6 27.1 39.8 35.9 20 17 29.3 23.1 41.6 23.1 9.7 0 18.7-4.4 24.8-12.1 10.1-12.9 10.2-29.1 0.5-78.7-1.4-7.2-2.9-14.2-4.3-20.6 54.4-21.1 92.4-74.3 92.4-134.6v-177c0.1-68-48.4-127.4-115.2-141.2z" fill="#45484C"></path><path d="M434.6 602.8c-35.9 0-71-17.1-98.8-48.1-24.6-27.5-39.3-61.6-39.3-91.4v-29.7l29.7-0.3c0.4 0 36.2-0.4 95.4-0.4 16.6 0 30 13.4 30 30s-13.4 30-30 30c-22.3 0-41.2 0.1-56.2 0.1 3.8 7.1 8.8 14.5 15.1 21.6 16 17.9 35.7 28.1 54.1 28.1s38.1-10.3 54.1-28.1c6.5-7.3 11.6-14.9 15.4-22.2-13.7-2.8-24.1-15-24-29.5 0.1-16.5 13.5-29.9 30-29.9h0.1c27.1 0.1 32.5 0.2 33.6 0.3l28.9 1.1v28.9c0 29.8-14.7 63.9-39.3 91.4-27.9 31-62.9 48.1-98.8 48.1z m107.1-109.5z" fill="#33CC99"></path></g></svg> -->
          <span class="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">Mbuelo</span>
          <div class="relative">
            <img class="w-10 h-10 rounded ring-2 ring-transparent hover:ring-blue-200 shadow-md shadow-gray-500" src="https://avatars.githubusercontent.com/u/103327479?v=4" alt="">
            <span class="top-0 left-7 absolute  w-3.5 h-3.5 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full"></span>
          </div>
        </a>
      </div>
    </div>
  </div>
</nav>

<div class="bg-white min-h-[100dvh] mt-12 p-6 sm:p-8 rounded-md w-full relative">
  <!-- Your chat messages go here -->
<div class="w-full h-auto max-h-[79dvh] overflow-x-visible overflow-y-scroll">

<ng-container *ngFor="let item of [1, 2, 3, 4, 5, 6]">
<!-- Receiver message -->
<div class="flex items-start mb-4">
    <div class="flex-shrink-0">
      <!-- <img src="receiver-avatar.jpg" alt="Receiver Avatar" class="w-8 h-8 rounded-full"> -->
      <img class="w-10 h-10 p-1 rounded-full ring-2 ring-gray-300 hover:ring-blue-200 dark:ring-gray-500" src="https://avatars.githubusercontent.com/u/103327479?v=4" alt="Bordered avatar">

    </div>
    <div class="max-w-[70%] ml-2 p-3 bg-gray-200 rounded-lg">
      <p class="text-gray-800">Hello there! How are you doing? knew what i was doingknew what i was doingknew what i was doingknew what i was doingknew what i was doingknew what i was doingknew what i was doing</p>
      <p class="text-sm text-gray-500">10:30 AM</p>
    </div>
  </div>

  <!-- Sender message -->
  <div class="flex items-end justify-end mb-4">
    <div class="max-w-[70%] mr-2 p-3 bg-gray-400 rounded-lg">
      <p class="text-white">Hi! I'm doing great, thanks!, knew what i was doing, knew what i was doing Lorem I wish i knew what i was doing, knew what i was doing, knew what i was doing</p>
      <p class="text-sm text-gray-300">10:35 AM</p>
    </div>
    <div class="flex-shrink-0">
    <img class="w-10 h-10 p-1 rounded-full ring-2 ring-gray-300 hover:ring-blue-200 dark:ring-gray-500" src="data:image/jpeg;base64,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" alt="Bordered avatar">
    <!-- <img src="" alt="Sender Avatar" class="w-8 h-8 rounded-full"> -->
    </div>
  </div>

  <!-- Your chat messages go here -->
</ng-container>


</div>



  <!-- Message input field -->
  <div class="absolute bottom-12 left-0 right-0 p-4 bg-gray-300">
    <form class="flex items-center">
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
      <textarea id="chat" rows="1" class="flex-1 p-2.5 text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-gray-500 focus:border-gray-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Your message..."></textarea>
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
export class MessageComponent implements OnInit {

  constructor(private firebaseService: FirebaseService){}

  ngOnInit(): void {
    // Example sender and receiver IDs
    const senderId = 'FhAfVTYRPpQBqIgUWIWY4tEsKyw1';
    const receiverId = 'WKCemYbo9mg1x8h71msEJfc7hQf2';

    // Example message
    const message: IMessage = {
      // id: '', // Firestore will automatically generate an ID
      senderId: senderId,
      receiverId: receiverId,
      content: 'Hello, this is a receiver test message.',
      timestamp: new Date() // You can use Firestore Timestamp here if needed
    };

    // Send the message
    this.firebaseService.addMessage(message, senderId, receiverId).then(() => {
      // Message sent successfully, now retrieve the messages
      this.firebaseService.getMessagesByUserId(senderId, receiverId).subscribe(
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


/* 

<form>
    <label for="chat" class="sr-only">Your message</label>
    <div class="flex items-center px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700">
        <button type="button" class="inline-flex justify-center p-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
            <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 18">
                <path fill="currentColor" d="M13 5.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0ZM7.565 7.423 4.5 14h11.518l-2.516-3.71L11 13 7.565 7.423Z"/>
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 1H2a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z"/>
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0ZM7.565 7.423 4.5 14h11.518l-2.516-3.71L11 13 7.565 7.423Z"/>
            </svg>
            <span class="sr-only">Upload image</span>
        </button>
        <button type="button" class="p-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
            <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.408 7.5h.01m-6.876 0h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM4.6 11a5.5 5.5 0 0 0 10.81 0H4.6Z"/>
            </svg>
            <span class="sr-only">Add emoji</span>
        </button>
        <textarea id="chat" rows="1" class="block mx-4 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Your message..."></textarea>
            <button type="submit" class="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600">
            <svg class="w-5 h-5 rotate-90 rtl:-rotate-90" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z"/>
            </svg>
            <span class="sr-only">Send message</span>
        </button>
    </div>
</form>


*/ 