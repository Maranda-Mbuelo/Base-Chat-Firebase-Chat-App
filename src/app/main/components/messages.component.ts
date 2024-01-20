import { Component, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-messages',
  template: `
<div class="bg-white mt-12 p-6 sm:p-8 rounded-md h-screen w-full">
  <div class="flex flex-col sm:flex-row items-center justify-between pb-4">
    <div class="mb-2 sm:mb-0">
      <h2 class="text-gray-600 font-semibold text-lg">Friends</h2>
      <span class="text-xs">All friends</span>
    </div>
    <div class="flex items-center space-x-4 sm:space-x-8">
      <div class="flex bg-gray-50 items-center px-4 p-2 rounded-full">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20"
          fill="currentColor">
          <path fill-rule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clip-rule="evenodd" />
        </svg>
        <input class="bg-gray-50 outline-dashed outline-transparent border-0 focus:border-0 focus:outline-none outline-none ml-1 block " type="text" name="" id="" placeholder="Search friends...">
      </div>
      <button
        class="bg-indigo-600 px-3 sm:px-4 py-1.5 rounded-md text-white font-semibold tracking-wide cursor-pointer text-sm">Add
        Friend</button>
    </div>
  </div>
  <ul class="grid grid-cols-1 sm:grid-cols-3 gap-4">
    <li class="flex flex-col items-center">
      <hr class="w-full my-2">
      <div class="w-16 h-16 rounded-full overflow-hidden mb-2">
        <img class="w-full h-full object-cover" src="https://placekitten.com/200/200" alt="Profile" />
      </div>
      <p class="text-gray-900 text-sm font-semibold">John Doe</p>
      <div class="flex items-center mt-1">
        <span
          class="mr-1 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Active
        </span>
        <span class="text-xs text-gray-500">Last seen 5 min ago</span>
      </div>
      <span class="text-xs text-gray-500 mt-1">Unread messages: 2</span>
    </li>
    <li class="flex flex-col items-center">
      <hr class="w-full my-2">
      <div class="w-16 h-16 rounded-full overflow-hidden mb-2">
        <img class="w-full h-full object-cover" src="https://placekitten.com/201/201" alt="Profile" />
      </div>
      <p class="text-gray-900 text-sm font-semibold">Jane Smith</p>
      <div class="flex items-center mt-1">
        <span
          class="mr-1 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          Offline
        </span>
        <span class="text-xs text-gray-500">Last seen 1 hour ago</span>
      </div>
      <span class="text-xs text-gray-500 mt-1">Unread messages: 1</span>
    </li>
    <li class="flex flex-col items-center">
      <hr class="w-full my-2">
      <div class="w-16 h-16 rounded-full overflow-hidden mb-2">
        <img class="w-full h-full object-cover" src="https://placekitten.com/202/202" alt="Profile" />
      </div>
      <p class="text-gray-900 text-sm font-semibold">Mark Johnson</p>
      <div class="flex items-center mt-1">
        <span
          class="mr-1 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Active
        </span>
        <span class="text-xs text-gray-500">Last seen 30 min ago</span>
      </div>
      <span class="text-xs text-gray-500 mt-1">Unread messages: 0</span>
    </li>
  </ul>
</div>

  `,
  styles: [
  ]
})
export class MessagesComponent implements OnInit {

  ngOnInit(): void {
    initFlowbite();
  }
}
