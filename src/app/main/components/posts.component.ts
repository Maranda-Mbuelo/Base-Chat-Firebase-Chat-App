import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, map, take } from 'rxjs';
import { IMediaPost, IPost } from '../interfaces/others.model';
import { IFetchUser } from '../interfaces/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FirebaseService } from '../services/firebase.service';
import { PostService } from '../services/post.service';
import { UserService } from '../services/user.service';
import { Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-posts',
  template: `
<div *ngIf="mergedPost$" class="h-screen mt-8 overflow-y-scroll bg-gray-100">
   <div class="flex flex-col pt-12 lg:flex-row">
   <ng-container *ngFor="let post of mergedPost$ | async">
            <div *ngIf="isMediaPost(post) && post.title !== undefined; else withoutImageTemplate" class="bg-white shadow rounded-lg my-4">
               <ng-container *ngIf="data$ | async as data">
                  <div class="relative">
                     <button (click)="toggleDropdown(post.id)" class="absolute top-4 right-6 p-2 text-sm font-medium text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800 dark:focus:ring-gray-600" type="button">
                        <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 4 15">
                           <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"/>
                        </svg>
                     </button>
                     <!-- Dropdown content -->
                     <div *ngIf="isDropdownOpen(post.id)" class="dropdown-content flex justify-evenly pl-2 pt-4 pb-2">
                        <!-- Add your dropdown buttons here -->
                        <button (click)="viewPost(post.id)" class="w-full text-center py-2 px-4 text-left hover:bg-gray-100"><svg fill="#8c8c8c" width="30px" height="30px" viewBox="-3.5 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" stroke="#8c8c8c"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>view</title> <path d="M12.406 13.844c1.188 0 2.156 0.969 2.156 2.156s-0.969 2.125-2.156 2.125-2.125-0.938-2.125-2.125 0.938-2.156 2.125-2.156zM12.406 8.531c7.063 0 12.156 6.625 12.156 6.625 0.344 0.438 0.344 1.219 0 1.656 0 0-5.094 6.625-12.156 6.625s-12.156-6.625-12.156-6.625c-0.344-0.438-0.344-1.219 0-1.656 0 0 5.094-6.625 12.156-6.625zM12.406 21.344c2.938 0 5.344-2.406 5.344-5.344s-2.406-5.344-5.344-5.344-5.344 2.406-5.344 5.344 2.406 5.344 5.344 5.344z"></path> </g></svg></button>
                        <button (click)="editPost(post.id)" class="w-full text-center py-2 px-4 text-left hover:bg-gray-100"><svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#7a7a7a"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill-rule="evenodd" clip-rule="evenodd" d="m3.99 16.854-1.314 3.504a.75.75 0 0 0 .966.965l3.503-1.314a3 3 0 0 0 1.068-.687L18.36 9.175s-.354-1.061-1.414-2.122c-1.06-1.06-2.122-1.414-2.122-1.414L4.677 15.786a3 3 0 0 0-.687 1.068zm12.249-12.63 1.383-1.383c.248-.248.579-.406.925-.348.487.08 1.232.322 1.934 1.025.703.703.945 1.447 1.025 1.934.058.346-.1.677-.348.925L19.774 7.76s-.353-1.06-1.414-2.12c-1.06-1.062-2.121-1.415-2.121-1.415z" fill="#575757"></path></g></svg></button>
                        <button (click)="deletePost(post)" class="w-full text-center py-2 px-4 text-left hover:bg-gray-100"><svg width="30px" height="30px" viewBox="0 0 1024 1024" class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M154 260h568v700H154z" fill="#b92f27"></path><path d="M624.428 261.076v485.956c0 57.379-46.737 103.894-104.391 103.894h-362.56v107.246h566.815V261.076h-99.864z" fill="#696969"></path><path d="M320.5 870.07c-8.218 0-14.5-6.664-14.5-14.883V438.474c0-8.218 6.282-14.883 14.5-14.883s14.5 6.664 14.5 14.883v416.713c0 8.219-6.282 14.883-14.5 14.883zM543.5 870.07c-8.218 0-14.5-6.664-14.5-14.883V438.474c0-8.218 6.282-14.883 14.5-14.883s14.5 6.664 14.5 14.883v416.713c0 8.219-6.282 14.883-14.5 14.883z" fill="#152B3C"></path><path d="M721.185 345.717v-84.641H164.437z" fill="#696969"></path><path d="M633.596 235.166l-228.054-71.773 31.55-99.3 228.055 71.773z" fill="#b92f27"></path><path d="M847.401 324.783c-2.223 0-4.475-0.333-6.706-1.034L185.038 117.401c-11.765-3.703-18.298-16.239-14.592-27.996 3.706-11.766 16.241-18.288 27.993-14.595l655.656 206.346c11.766 3.703 18.298 16.239 14.592 27.996-2.995 9.531-11.795 15.631-21.286 15.631z" fill="#b92f27"></path></g></svg></button>
                     </div>
                     <div class="flex flex-row px-2 py-3 mx-3">
                        <div class="w-auto h-auto rounded-full border-2 border-green-500">
                           <img class="w-12 h-12 object-cover rounded-full shadow cursor-pointer" alt="User avatar" [src]="data.user?.image">
                        </div>
                        <div class="flex flex-col mb-2 ml-4 mt-1">
                           <div class="text-gray-600 text-sm font-semibold">{{data.user?.username}}</div>
                           <div class="flex w-full mt-1">
                              <div class="text-blue-700 font-base text-xs mr-1 cursor-pointer">
                                 UX Design
                              </div>
                              <div class="text-gray-400 font-thin text-xs">
                                 • {{post.timestamp.toDate() | date:"MMM dd, yyyy 'at' hh:mm a"}}
                              </div>
                           </div>
                        </div>
                     </div>
                     <div class="border-b border-gray-100"></div>
                     <div class="text-gray-400 font-medium text-sm mb-7 mt-6 mx-3 px-2">
                        <img class="rounded w-full" [src]="post.images[0]">
                     </div>
                     <div class="text-gray-600 font-semibold  mb-2 mx-3 px-2" [innerText]="post.title"></div>
                     <div class="text-gray-500 text-sm mb-6 mx-3 px-2" [innerText]="post.content"></div>
                     <div class="flex justify-start mb-4 border-t border-gray-100">
                        <div class="flex w-full mt-1 pt-2 pl-5">
                           <span class="bg-white transition ease-out duration-300 hover:text-red-500 border w-8 h-8 px-2 pt-2 text-center rounded-full text-gray-400 cursor-pointer mr-2">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="14px" viewBox="0 0 24 24" stroke="currentColor">
                                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                              </svg>
                           </span>
                           <img class="inline-block object-cover w-8 h-8 text-white border-2 border-white rounded-full shadow-sm cursor-pointer" src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=2&amp;w=256&amp;h=256&amp;q=80" alt="">
                           <img class="inline-block object-cover w-8 h-8 -ml-2 text-white border-2 border-white rounded-full shadow-sm cursor-pointer" src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&amp;auto=format&amp;fit=facearea&amp;facepad=2&amp;w=256&amp;h=256&amp;q=80" alt="">
                           <img class="inline-block object-cover w-8 h-8 -ml-2 text-white border-2 border-white rounded-full shadow-sm cursor-pointer" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=634&amp;q=80" alt="">
                           <img class="inline-block object-cover w-8 h-8 -ml-2 text-white border-2 border-white rounded-full shadow-sm cursor-pointer" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=2.25&amp;w=256&amp;h=256&amp;q=80" alt="">
                        </div>
                        <div class="flex justify-end w-full mt-1 pt-2 pr-5">
                           <span class="transition ease-out duration-300 hover:bg-blue-50 bg-blue-100 w-8 h-8 px-2 py-2 text-center rounded-full text-blue-400 cursor-pointer mr-2">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="14px" viewBox="0 0 24 24" stroke="currentColor">
                                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
                              </svg>
                           </span>
                           <span class="transition ease-out duration-300 hover:bg-gray-50 bg-gray-100 h-8 px-2 py-2 text-center rounded-full text-gray-100 cursor-pointer">
                              <svg class="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                 <path stroke-linecap="round" stroke-linejoin="round" d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path>
                              </svg>
                           </span>
                        </div>
                     </div>
                     <div class="flex w-full border-t border-gray-100">
                        <div class="mt-3 mx-5 flex flex-row text-xs">
                           <div class="flex text-gray-700 font-normal rounded-md mb-2 mr-4 items-center">
                              Comments:
                              <div class="ml-1 text-gray-400 text-ms"> 0</div>
                           </div>
                           <div class="flex text-gray-700 font-normal rounded-md mb-2 mr-4 items-center">
                              Views: 
                              <div class="ml-1 text-gray-400 text-ms"> 1</div>
                           </div>
                        </div>
                        <div class="mt-3 mx-5 w-full flex justify-end text-xs">
                           <div class="flex text-gray-700  rounded-md mb-2 mr-4 items-center">
                              Likes: 
                              <div class="ml-1 text-gray-400 text-ms">{{post?.likes}}</div>
                           </div>
                        </div>
                     </div>
                     <div class="relative flex items-center self-center w-full max-w-xl p-4 overflow-hidden text-gray-600 focus-within:text-gray-400">
                        <img class="w-10 h-10 object-cover rounded-full shadow mr-2 cursor-pointer" alt="User avatar" [src]="data.user?.image">
                        <span class="absolute inset-y-0 right-0 flex items-center pr-6">
                           <button type="submit" class="p-1 focus:outline-none focus:shadow-none hover:text-blue-500">
                              <svg class="w-6 h-6 transition ease-out duration-300 hover:text-blue-500 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                              </svg>
                           </button>
                        </span>
                        <input type="search" class="w-full py-2 pl-4 pr-10 text-sm bg-gray-100 border border-transparent appearance-none rounded-tg placeholder-gray-400 focus:bg-white focus:outline-none focus:border-blue-500 focus:text-gray-900 focus:shadow-outline-blue" style="border-radius: 25px" placeholder="Post a comment..." autocomplete="off">
                     </div>
                  </div>
               </ng-container>
            </div>
            <ng-template #withoutImageTemplate let-postIndex="index">
               hello
               <div class="relative rounded-xl border p-5 shadow-md w-full bg-white my-2">
                  <!-- Button in the top right -->
                  <button (click)="toggleDropdown(post.id)" class="absolute top-4 right-6 p-2 text-sm font-medium text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800 dark:focus:ring-gray-600" type="button">
                  <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 4 15">
                     <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"/>
                  </svg>
                  </button>
                  <!-- Dropdown content -->
                  <div *ngIf="isDropdownOpen(post.id)" class="dropdown-content flex justify-evenly mt-2 pb-2">
                     <!-- Add your dropdown buttons here -->
                     <button (click)="viewPost(post.id)" class="w-full text-center py-2 px-4 text-left hover:bg-gray-100"><svg fill="#8c8c8c" width="30px" height="30px" viewBox="-3.5 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" stroke="#8c8c8c"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>view</title> <path d="M12.406 13.844c1.188 0 2.156 0.969 2.156 2.156s-0.969 2.125-2.156 2.125-2.125-0.938-2.125-2.125 0.938-2.156 2.125-2.156zM12.406 8.531c7.063 0 12.156 6.625 12.156 6.625 0.344 0.438 0.344 1.219 0 1.656 0 0-5.094 6.625-12.156 6.625s-12.156-6.625-12.156-6.625c-0.344-0.438-0.344-1.219 0-1.656 0 0 5.094-6.625 12.156-6.625zM12.406 21.344c2.938 0 5.344-2.406 5.344-5.344s-2.406-5.344-5.344-5.344-5.344 2.406-5.344 5.344 2.406 5.344 5.344 5.344z"></path> </g></svg></button>
                     <button (click)="editPost(post.id)" class="w-full text-center py-2 px-4 text-left hover:bg-gray-100"><svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#7a7a7a"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill-rule="evenodd" clip-rule="evenodd" d="m3.99 16.854-1.314 3.504a.75.75 0 0 0 .966.965l3.503-1.314a3 3 0 0 0 1.068-.687L18.36 9.175s-.354-1.061-1.414-2.122c-1.06-1.06-2.122-1.414-2.122-1.414L4.677 15.786a3 3 0 0 0-.687 1.068zm12.249-12.63 1.383-1.383c.248-.248.579-.406.925-.348.487.08 1.232.322 1.934 1.025.703.703.945 1.447 1.025 1.934.058.346-.1.677-.348.925L19.774 7.76s-.353-1.06-1.414-2.12c-1.06-1.062-2.121-1.415-2.121-1.415z" fill="#575757"></path></g></svg></button>
                     <button (click)="deletePost(post)" class="w-full text-center py-2 px-4 text-left hover:bg-gray-100"><svg width="30px" height="30px" viewBox="0 0 1024 1024" class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M154 260h568v700H154z" fill="#b92f27"></path><path d="M624.428 261.076v485.956c0 57.379-46.737 103.894-104.391 103.894h-362.56v107.246h566.815V261.076h-99.864z" fill="#696969"></path><path d="M320.5 870.07c-8.218 0-14.5-6.664-14.5-14.883V438.474c0-8.218 6.282-14.883 14.5-14.883s14.5 6.664 14.5 14.883v416.713c0 8.219-6.282 14.883-14.5 14.883zM543.5 870.07c-8.218 0-14.5-6.664-14.5-14.883V438.474c0-8.218 6.282-14.883 14.5-14.883s14.5 6.664 14.5 14.883v416.713c0 8.219-6.282 14.883-14.5 14.883z" fill="#152B3C"></path><path d="M721.185 345.717v-84.641H164.437z" fill="#696969"></path><path d="M633.596 235.166l-228.054-71.773 31.55-99.3 228.055 71.773z" fill="#b92f27"></path><path d="M847.401 324.783c-2.223 0-4.475-0.333-6.706-1.034L185.038 117.401c-11.765-3.703-18.298-16.239-14.592-27.996 3.706-11.766 16.241-18.288 27.993-14.595l655.656 206.346c11.766 3.703 18.298 16.239 14.592 27.996-2.995 9.531-11.795 15.631-21.286 15.631z" fill="#b92f27"></path></g></svg></button>
                  </div>
                  <!-- Existing content for posts without images -->
                  <div class="flex w-full items-center justify-between border-b">
                     <div *ngIf="data$ | async as data" class="flex flex-col items-start">
                        <div class="flex items-center">
                           <img *ngIf="data.user?.image" [src]="data.user?.image" alt="User Image" class="h-8 w-8 rounded-full">
                           <div class="text-lg font-bold text-slate-700 px-4" [innerText]="data.user?.username"></div>
                        </div>
                        <div class="ml-12 text-xs text-neutral-500">{{ post.timestamp.toDate() | date:"MMM dd, yyyy 'at' hh:mm a" }}</div>
                     </div>
                  </div>
                  <div class="mt-4 mb-6">
                     <div class="mb-3 text-xl font-bold" [innerText]="post.title"></div>
                     <div class="text-sm text-neutral-600" [innerText]="post.content"></div>
                  </div>
                  <div>
                     <div class="flex items-center justify-between text-slate-500">
                        <div class="flex space-x-4 md:space-x-8">
                           <div class="flex cursor-pointer items-center transition hover:text-slate-600">
                              <svg xmlns="http://www.w3.org/2000/svg" class="mr-1.5 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                 <path stroke-linecap="round" stroke-linejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                              </svg>
                              <span>0</span>
                           </div>
                           <div class="flex cursor-pointer items-center transition hover:text-slate-600">
                              <svg xmlns="http://www.w3.org/2000/svg" class="mr-1.5 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                 <path stroke-linecap="round" stroke-linejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                              </svg>
                              <span>{{post?.likes}}</span>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </ng-template>
         </ng-container>
   </div>
</div>
  `,
  styles: [
  ]
})
export class PostsComponent implements OnInit {

   userId!: string;
   mainUserId!: string;
   selectedPostId: string | null = null;
   user$ = new BehaviorSubject<IFetchUser | null>(null);
   textPosts$ = new BehaviorSubject<IPost[]>([]);
   mediaPosts$ = new BehaviorSubject<IMediaPost[]>([]);
   mergedPost$ = new BehaviorSubject<(IMediaPost | IPost)[]>([
      {
         title: "yellow",
         id: "www",
         content: "ee",
         timestamp: Timestamp.now(),
         likes: 7,
         images: ['heey']
      }
   ]);
   data$ = combineLatest([this.user$, this.textPosts$]).pipe(
   map(([user, textPosts]) => ({ user, textPosts }))
   );

   constructor(private router: Router, private postService: PostService, private userService: UserService) {
      this.postService.getAllPosts()
        .pipe(
          take(1),
          map(posts => {
            this.mergedPost$.next(posts);
            console.log('All posts:', this.mergedPost$.value);
          })
        )
        .subscribe(
          () => {},
          error => console.error('Error fetching all posts:', error)
        );
   }

   ngOnInit(): void {
      
    }

   isMediaPost(post: IPost | IMediaPost): post is IMediaPost {
      return (post as IMediaPost).images !== undefined;
    }


   toggleDropdown(postId: string) {
      // If the dropdown is already open for the selected post, close it
      this.selectedPostId = this.selectedPostId === postId ? null : postId;
    }
  
    isDropdownOpen(postId: string): boolean {
      // Check if the dropdown should be open based on the selected post
      return this.selectedPostId === postId;
    }
  
    deletePost(post: IPost | IMediaPost): void {
      if ('images' in post) {
          // It's a media post (IMediaPost)
          this.postService.deleteMediaPost(post.id, this.mainUserId)
            .then(() => this.postService.deleteImageByUrl(post.images[0]))
            .catch((err) => {
              // I'll handle errors, if needed
              console.error(err);
            });
        } else {
          // It's a regular post (IPost)
          this.postService.deletePost(post.id, this.mainUserId);
          console.log('This is a regular post:', post);
          // Perform actions specific to IPost
        }
    }
  
    editPost(postId: string): void {
      const userId = this.mainUserId;
      this.router.navigate(['/firebaseapp/edit', postId, 'post', userId]);
    }
  
    viewPost(postId: string): void {
      const userId = this.mainUserId;
      this.router.navigate(['/firebaseapp/view', postId, 'post', userId]);
    }

}
