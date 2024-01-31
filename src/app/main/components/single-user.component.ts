import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router  } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { IFetchUser, IUser } from '../interfaces/user.model';
import { BehaviorSubject, Observable, combineLatest, from, map, of, switchMap, take, throwError } from 'rxjs';
import { IMediaPost, IPost } from '../interfaces/others.model';
import { Timestamp } from '@angular/fire/firestore';
import { PostService } from '../services/post.service';
import { initDials, initFlowbite } from 'flowbite'; 
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-single-user',
  template: `
<div *ngIf="data$ | async" class="app h-screen overflow-y-scroll pb-2 bg-gray-100">
   <nav class="bg-white w-full flex relative shadow justify-between items-center px-8 h-20">
      <!-- logo -->
      <div class="inline-flex">
         <a class="_o6689fn" href="/">
            <svg width="46px" height="46px" viewBox="-409.6 -409.6 1843.20 1843.20" class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000">
               <g id="SVGRepo_bgCarrier" stroke-width="0">
                  <path transform="translate(-409.6, -409.6), scale(57.6)" d="M16,30.097427585407306C19.750679654497812,29.996656755149466,23.81866504071083,29.06324349242888,26.037871729871693,26.037871729871696C28.09613734537485,23.23190565947371,26.189585738315504,19.476636744219572,26.340912804399665,16C26.50619403273122,12.202775839005225,29.27906613336736,8.053280061677757,26.95147186076982,5.048528139230182C24.57243112987115,1.977362647071017,19.875069793216703,2.375462720982515,16,2.6506469814400937C12.457141311578411,2.9022395978584163,8.97761478732196,3.955110812322501,6.500811611978008,6.500811611978007C4.055463730534557,9.014182120864735,3.202417372066293,12.498503867456677,3.011937950590724,15.999999999999998C2.8075275098647907,19.757583691239482,2.858037357580134,23.824537996731028,5.407854332366838,26.592145667633154C8.027486465867891,29.435531706439214,12.135218677041479,30.201264025347598,16,30.097427585407306" fill="#d7e1e5" strokewidth="0"></path>
               </g>
               <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
               <g id="SVGRepo_iconCarrier">
                  <path d="M885.8 383.8h-90.4c12.3 15.8 19.7 35.6 19.7 57.1v194c0 51.3-42 93.2-93.2 93.2H494.1c12.1 31 42.2 53.1 77.4 53.1h314.3c45.6 0 83-37.3 83-83V466.8c-0.1-45.7-37.4-83-83-83z" fill="#FFB89A"></path>
                  <path d="M780.7 582.4V286.3c0-74.2-60.7-134.9-134.9-134.9H198.2c-74.2 0-134.9 60.7-134.9 134.9v296.1c0 70.5 54.8 128.7 123.8 134.4 0 0-20 155.4 4.9 155.4s188.4-154.9 188.4-154.9h265.3c74.3 0 135-60.7 135-134.9z m-424.1 74.9l-17.4 16.4c-0.3 0.3-34.5 32.7-73.2 67.1-8.5 7.5-16.2 14.3-23.3 20.5 1.9-20.9 3.9-36.6 3.9-36.8l8-62.3L192 657c-38.5-3.2-68.7-36-68.7-74.6V286.3c0-19.9 7.8-38.6 22.1-52.8 14.2-14.2 33-22.1 52.8-22.1h447.6c19.9 0 38.6 7.8 52.8 22.1 14.2 14.2 22.1 33 22.1 52.8v296.1c0 19.9-7.8 38.6-22.1 52.8-14.2 14.2-33 22.1-52.8 22.1H356.6z" fill="#45484C"></path>
                  <path d="M830.3 337.9c-16.2-3.3-32.1 7.1-35.4 23.3-3.3 16.2 7.1 32.1 23.3 35.4 39 8 67.3 42.7 67.3 82.5v177c0 41.6-31.1 77.5-72.3 83.4l-32.7 4.7 7.8 32.1c2 8.1 3.9 16.8 5.8 25.3-17.6-16.4-37.3-35.2-55.2-52.7l-8.7-8.6H562.5c-21.9 0-36.6-1.4-47.2-8.6-13.7-9.3-32.4-5.8-41.7 7.9-9.3 13.7-5.8 32.4 7.9 41.7 25.7 17.5 55.3 19 81 19h143.2c10 9.7 27.3 26.3 45 42.8 16.2 15.1 29.6 27.1 39.8 35.9 20 17 29.3 23.1 41.6 23.1 9.7 0 18.7-4.4 24.8-12.1 10.1-12.9 10.2-29.1 0.5-78.7-1.4-7.2-2.9-14.2-4.3-20.6 54.4-21.1 92.4-74.3 92.4-134.6v-177c0.1-68-48.4-127.4-115.2-141.2z" fill="#45484C"></path>
                  <path d="M434.6 602.8c-35.9 0-71-17.1-98.8-48.1-24.6-27.5-39.3-61.6-39.3-91.4v-29.7l29.7-0.3c0.4 0 36.2-0.4 95.4-0.4 16.6 0 30 13.4 30 30s-13.4 30-30 30c-22.3 0-41.2 0.1-56.2 0.1 3.8 7.1 8.8 14.5 15.1 21.6 16 17.9 35.7 28.1 54.1 28.1s38.1-10.3 54.1-28.1c6.5-7.3 11.6-14.9 15.4-22.2-13.7-2.8-24.1-15-24-29.5 0.1-16.5 13.5-29.9 30-29.9h0.1c27.1 0.1 32.5 0.2 33.6 0.3l28.9 1.1v28.9c0 29.8-14.7 63.9-39.3 91.4-27.9 31-62.9 48.1-98.8 48.1z m107.1-109.5z" fill="#33CC99"></path>
               </g>
            </svg>
         </a>
      </div>
      <!-- end logo -->
      <!-- search bar -->
      <!-- <div class="hidden sm:block flex-shrink flex-grow-0 justify-start px-2"> -->
      <div class="flex rounded-full bg-gray-300 px-2 w-full max-w-[600px]">
         <button class="self-center flex p-1 cursor-pointer">
            <svg class="text-gray-300" width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
               <g id="SVGRepo_bgCarrier" stroke-width="0"/>
               <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
               <g id="SVGRepo_iconCarrier">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M11.567 9.8895C12.2495 8.90124 12.114 7.5637 11.247 6.7325C10.3679 5.88806 9.02339 5.75928 7.99998 6.4215C7.57983 6.69308 7.25013 7.0837 7.05298 7.5435C6.85867 7.99881 6.80774 8.50252 6.90698 8.9875C7.00665 9.47472 7.25054 9.92071 7.60698 10.2675C7.97021 10.6186 8.42786 10.8563 8.92398 10.9515C9.42353 11.049 9.94062 11.0001 10.413 10.8105C10.8798 10.6237 11.2812 10.3033 11.567 9.8895Z" stroke="gray" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M12.433 17.8895C11.7504 16.9012 11.886 15.5637 12.753 14.7325C13.6321 13.8881 14.9766 13.7593 16 14.4215C16.4202 14.6931 16.7498 15.0837 16.947 15.5435C17.1413 15.9988 17.1922 16.5025 17.093 16.9875C16.9933 17.4747 16.7494 17.9207 16.393 18.2675C16.0298 18.6186 15.5721 18.8563 15.076 18.9515C14.5773 19.0481 14.0614 18.9988 13.59 18.8095C13.1222 18.6234 12.7197 18.3034 12.433 17.8895V17.8895Z" stroke="gray" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 7.75049C11.5858 7.75049 11.25 8.08627 11.25 8.50049C11.25 8.9147 11.5858 9.25049 12 9.25049V7.75049ZM19 9.25049C19.4142 9.25049 19.75 8.9147 19.75 8.50049C19.75 8.08627 19.4142 7.75049 19 7.75049V9.25049ZM6.857 9.25049C7.27121 9.25049 7.607 8.9147 7.607 8.50049C7.607 8.08627 7.27121 7.75049 6.857 7.75049V9.25049ZM5 7.75049C4.58579 7.75049 4.25 8.08627 4.25 8.50049C4.25 8.9147 4.58579 9.25049 5 9.25049V7.75049ZM12 17.2505C12.4142 17.2505 12.75 16.9147 12.75 16.5005C12.75 16.0863 12.4142 15.7505 12 15.7505V17.2505ZM5 15.7505C4.58579 15.7505 4.25 16.0863 4.25 16.5005C4.25 16.9147 4.58579 17.2505 5 17.2505V15.7505ZM17.143 15.7505C16.7288 15.7505 16.393 16.0863 16.393 16.5005C16.393 16.9147 16.7288 17.2505 17.143 17.2505V15.7505ZM19 17.2505C19.4142 17.2505 19.75 16.9147 19.75 16.5005C19.75 16.0863 19.4142 15.7505 19 15.7505V17.2505ZM12 9.25049H19V7.75049H12V9.25049ZM6.857 7.75049H5V9.25049H6.857V7.75049ZM12 15.7505H5V17.2505H12V15.7505ZM17.143 17.2505H19V15.7505H17.143V17.2505Z" fill="gray"/>
               </g>
            </svg>
         </button>
         <input
            type="text"
            class="w-full flex bg-transparent pl-2 text-[#cccccc] outline-none border-none focus:ring-0 or focus:ring-transparent"
            placeholder="Search from user"
            />
         <button type="submit" class="relative p-2 rounded-full">
            <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
               <g id="SVGRepo_bgCarrier" stroke-width="0"/>
               <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
               <g id="SVGRepo_iconCarrier">
                  <path d="M14.9536 14.9458L21 21M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="#999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
               </g>
            </svg>
         </button>
      </div>
      <!-- end search bar -->
      <!-- login -->
      <div class="flex-initial">
         <div class="flex justify-end items-center relative">
            <div class="block">
               <div class="inline relative">
                  <button type="button" type="button" class="inline-flex items-center relative px-2 rounded-full hover:shadow-lg">
                     <svg width="40px" height="40px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                        <g id="SVGRepo_iconCarrier">
                           <path opacity="0.5" d="M12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22Z" fill="#777d92"></path>
                           <path d="M18.75 8C18.75 8.41421 18.4142 8.75 18 8.75H6C5.58579 8.75 5.25 8.41421 5.25 8C5.25 7.58579 5.58579 7.25 6 7.25H18C18.4142 7.25 18.75 7.58579 18.75 8Z" fill="#777d92"></path>
                           <path d="M18.75 12C18.75 12.4142 18.4142 12.75 18 12.75H6C5.58579 12.75 5.25 12.4142 5.25 12C5.25 11.5858 5.58579 11.25 6 11.25H18C18.4142 11.25 18.75 11.5858 18.75 12Z" fill="#777d92"></path>
                           <path d="M18.75 16C18.75 16.4142 18.4142 16.75 18 16.75H6C5.58579 16.75 5.25 16.4142 5.25 16C5.25 15.5858 5.58579 15.25 6 15.25H18C18.4142 15.25 18.75 15.5858 18.75 16Z" fill="#777d92"></path>
                        </g>
                     </svg>
                  </button>
               </div>
            </div>
         </div>
      </div>
      <!-- end login -->
   </nav>
   <main *ngIf="data$ | async as data" class="grid grid-cols-1 lg:grid-cols-2 gap-6 my-12 mx-12 w-2xl container px-2 mx-auto">
      <aside class="h-[85vh] overflow-y-scroll p-2">
         <div *ngIf="data.user as localUser" class="bg-white shadow rounded-lg p-10">
            <div class="flex flex-col gap-1 text-center items-center">
               <img class="h-32 w-32 bg-white p-2 rounded-full shadow mb-4" [src]="localUser.image" alt="image">
               <p class="font-semibold">@ {{localUser.username | titlecase}} </p>
               <div class="text-sm leading-normal text-gray-400 flex justify-center items-center">
                  <!-- <svg viewBox="0 0 24 24" class="mr-1" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg> -->
                  {{ (localUser.firstname | titlecase) + ' ' + (localUser.lastname | titlecase) }}
               </div>
            </div>
            <div class="flex justify-center items-center gap-2 my-3">
               <div class="font-semibold text-center mx-4">
                  <p class="text-black">{{localUser.postsCount}}</p>
                  <span class="text-gray-400">Posts</span>
               </div>
               <div class="font-semibold text-center mx-4">
                  <p class="text-black">{{localUser.followersCount}}</p>
                  <span class="text-gray-400">Followers</span>
               </div>
               <div class="font-semibold text-center mx-4">
                  <p class="text-black">{{localUser.followingCount}}</p>
                  <span class="text-gray-400">Folowing</span>
               </div>
            </div>
            <div class="flex justify-center items-center gap-2 my-3">
               <button (click)="checkButtonText($event, userId)" class="w-[60%] p-3 bg-gray-600 text-white rounded-md">{{ buttonText }}</button>
            </div>
         </div>
         <div *ngIf="data.user as user" class="bg-white shadow mt-6 rounded-lg p-6">
            <h3 class="text-gray-600 text-sm font-semibold mb-4">Following</h3>
            <!-- Check if there are users in the following list -->
            <ng-container *ngIf="followingUsersImages && followingUsersImages.length > 0; else noUsers">
               <ul class="flex items-center justify-center space-x-2">
                  <!-- Iterate over the following users -->
                  <li *ngFor="let image of followingUsersImages" class="flex flex-col items-center space-y-2">
                     <!-- Ring -->
                     <a class="block bg-white p-1 rounded-full" href="#">
                     <img class="w-16 h-16 rounded-full" [src]="image" alt="user picture">
                     </a>
                     <!-- Username -->
                     <!-- <span class="text-xs text-gray-500">
                        {{ user.username }}
                        </span> -->
                  </li>
               </ul>
            </ng-container>
            <!-- Message when no users are being followed -->
            <ng-template #noUsers>
               <p class="text-gray-500 text-sm text-center mt-4">{{user.username}} is not following anyone.</p>
            </ng-template>
         </div>
         <div class="flex bg-white shadow mt-6  rounded-lg p-2">
            <img src="https://images.unsplash.com/photo-1439130490301-25e322d88054?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;ixlib=rb-1.2.1&amp;auto=format&amp;fit=crop&amp;w=1189&amp;q=80" alt="Just a flower" class=" w-16  object-cover  h-16 rounded-xl">
            <div class="flex flex-col justify-center w-full px-2 py-1">
               <div class="flex justify-between items-center ">
                  <div class="flex flex-col">
                     <h2 class="text-sm font-medium">Massive Dynamic</h2>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 hover:text-blue-400 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                  </svg>
               </div>
               <div class="flex pt-2  text-sm text-gray-400">
                  <div class="flex items-center mr-auto">
                     <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z">
                        </path>
                     </svg>
                     <p class="font-normal">4.5</p>
                  </div>
                  <div class="flex items-center font-medium text-gray-900 ">
                     $1800
                     <span class="text-gray-400 text-sm font-normal"> /wk</span>
                  </div>
               </div>
            </div>
         </div>
         <div class="grid mt-5 grid-cols-2  space-x-4 overflow-y-scroll justify-center items-center w-full ">
            <div class="relative flex flex-col justify-between   bg-white shadow-md rounded-3xl  bg-cover text-gray-800  overflow-hidden cursor-pointer w-full object-cover object-center h-64 my-2" style="background-image:url('https://images.unsplash.com/reserve/8T8J12VQxyqCiQFGa2ct_bahamas-atlantis.jpg?ixlib=rb-1.2.1&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=1050&amp;q=80')">
               <div class="absolute bg-gradient-to-t from-green-400 to-blue-400  opacity-50 inset-0 z-0"></div>
               <div class="relative flex flex-row items-end  h-72 w-full ">
                  <div class="absolute right-0 top-0 m-2">
                     <svg xmlns="http://www.w3.org/2000/svg" class="h-9 w-9 p-2 text-gray-200 hover:text-blue-400 rounded-full hover:bg-white transition ease-in duration-200 " fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                     </svg>
                  </div>
                  <div class="p-6 rounded-lg  flex flex-col w-full z-10 ">
                     <h4 class="mt-1 text-white text-xl font-semibold  leading-tight truncate">Loremipsum..
                     </h4>
                     <div class="flex justify-between items-center ">
                        <div class="flex flex-col">
                           <h2 class="text-sm flex items-center text-gray-300 font-normal">
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z">
                                 </path>
                                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                              </svg>
                              South Africa
                           </h2>
                        </div>
                     </div>
                     <div class="flex pt-4  text-sm text-gray-300">
                        <div class="flex items-center mr-auto">
                           <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z">
                              </path>
                           </svg>
                           <p class="font-normal">4.5</p>
                        </div>
                        <div class="flex items-center font-medium text-white ">
                           $1800
                           <span class="text-gray-300 text-sm font-normal"> /wk</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
            <div class="relative flex flex-col justify-between   bg-white shadow-md  rounded-3xl  bg-cover text-gray-800  overflow-hidden cursor-pointer w-full object-cover object-center h-64 my-2" style="background-image:url('https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-1.2.1&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=800&amp;q=80')">
               <div class="absolute bg-gradient-to-t from-blue-500 to-yellow-400  opacity-50 inset-0 z-0"></div>
               <div class="relative flex flex-row items-end  h-72 w-full ">
                  <div class="absolute right-0 top-0 m-2">
                     <svg xmlns="http://www.w3.org/2000/svg" class="h-9 w-9 p-2 text-gray-200 hover:text-blue-400 rounded-full hover:bg-white transition ease-in duration-200 " fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                     </svg>
                  </div>
                  <div class="p-5 rounded-lg  flex flex-col w-full z-10 ">
                     <h4 class="mt-1 text-white text-xl font-semibold  leading-tight truncate">Loremipsum..
                     </h4>
                     <div class="flex justify-between items-center ">
                        <div class="flex flex-col">
                           <h2 class="text-sm flex items-center text-gray-300 font-normal">
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z">
                                 </path>
                                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                              </svg>
                              United Kingdom
                           </h2>
                        </div>
                     </div>
                     <div class="flex pt-4  text-sm text-gray-300">
                        <div class="flex items-center mr-auto">
                           <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z">
                              </path>
                           </svg>
                           <p class="font-normal">4.5</p>
                        </div>
                        <div class="flex items-center font-medium text-white ">
                           $1800
                           <span class="text-gray-300 text-sm font-normal"> /wk</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </aside>
      <article class="h-[85vh] overflow-y-scroll">
         <form *ngIf="userId == mainUserId" #myForm="ngForm" (submit)="onAddPost(myForm.value)" class="bg-white shadow rounded-lg mb-6 p-4">
         <input ngModel type="text" name="title" placeholder="Enter post title" class="w-full rounded-lg p-2 text-sm bg-gray-100 border border-transparent appearance-none rounded-tg placeholder-gray-400 mb-2">
         <textarea ngModel name="content" placeholder="Type something..." class="w-full rounded-lg p-2 text-sm bg-gray-100 border border-transparent appearance-none rounded-tg placeholder-gray-400"></textarea>
         <footer class="flex justify-between mt-2">
            <div class="flex gap-2">
               <button type="button" (click)="toggleMediaModal()" class="flex items-center transition ease-out duration-300 hover:bg-blue-500 hover:text-white bg-blue-100 w-8 h-8 px-2 rounded-full text-blue-400 cursor-pointer">
                  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1">
                     <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                     <circle cx="8.5" cy="8.5" r="1.5"></circle>
                     <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
               </button>
               <span class="flex items-center transition ease-out duration-300 hover:bg-blue-500 hover:text-white bg-blue-100 w-8 h-8 px-2 rounded-full text-blue-400 cursor-pointer">
                  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1">
                     <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                     <circle cx="12" cy="10" r="3"></circle>
                  </svg>
               </span>
               <span class="flex items-center transition ease-out duration-300 hover:bg-blue-500 hover:text-white bg-blue-100 w-8 h-8 px-2 rounded-full text-blue-400 cursor-pointer">
                  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1">
                     <polyline points="4 17 10 11 4 5"></polyline>
                     <line x1="12" y1="19" x2="20" y2="19"></line>
                  </svg>
               </span>
            </div>
            <button type="submit" class="flex items-center py-2 px-4 rounded-lg text-sm bg-blue-600 text-white shadow-lg">
               Send 
               <svg class="ml-1" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
               </svg>
            </button>
         </footer>
         </form>
         <!-- Main modal -->
         <div [ngClass]="{'hidden' : isMediaModalOpen == false}" tabindex="-1" aria-hidden="true" class="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
            <!-- Dimmed overlay -->
            <div class="fixed top-0 right-0 left-0 bottom-0 bg-black opacity-60"></div>
            <div class="relative p-4 w-full max-w-4xl mx-auto max-h-full">
               <!-- Modal content -->
               <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                  <button (click)="toggleMediaModal()" type="button" class="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="progress-modal">
                     <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                     </svg>
                     <span class="sr-only">Close modal</span>
                  </button>
                  <div class="p-4 md:p-5">
                     <svg class="w-10 h-10 text-gray-400 dark:text-gray-500 mb-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                        <path d="M8 5.625c4.418 0 8-1.063 8-2.375S12.418.875 8 .875 0 1.938 0 3.25s3.582 2.375 8 2.375Zm0 13.5c4.963 0 8-1.538 8-2.375v-4.019c-.052.029-.112.054-.165.082a8.08 8.08 0 0 1-.745.353c-.193.081-.394.158-.6.231l-.189.067c-2.04.628-4.165.936-6.3.911a20.601 20.601 0 0 1-6.3-.911l-.189-.067a10.719 10.719 0 0 1-.852-.34 8.08 8.08 0 0 1-.493-.244c-.053-.028-.113-.053-.165-.082v4.019C0 17.587 3.037 19.125 8 19.125Zm7.09-12.709c-.193.081-.394.158-.6.231l-.189.067a20.6 20.6 0 0 1-6.3.911 20.6 20.6 0 0 1-6.3-.911l-.189-.067a10.719 10.719 0 0 1-.852-.34 8.08 8.08 0 0 1-.493-.244C.112 6.035.052 6.01 0 5.981V10c0 .837 3.037 2.375 8 2.375s8-1.538 8-2.375V5.981c-.052.029-.112.054-.165.082a8.08 8.08 0 0 1-.745.353Z"/>
                     </svg>
                     <h3 class="mb-1 text-xl font-bold text-gray-900 dark:text-white">Share post with picture</h3>
                     <form #myForm="ngForm" (submit)="onSubmitClick(myForm.value)" class="max-w-md mx-auto">
                     <div class="relative z-0 w-full mb-5 group">
                        <input [(ngModel)]="form.title" type="text" name="title" id="floating_title" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                        <label for="floating_title" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Post Title</label>
                     </div>
                     <div class="relative z-0 w-full mb-5 group">
                        <input [(ngModel)]="form.content" type="text" name="content" id="floating_content" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                        <label for="floating_content" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">What's on your mind</label>
                     </div>
                     <div *ngIf="!isLoading" class="flex items-center justify-center w-full">
                        <label for="dropzone-file" class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                           <div class="flex flex-col items-center justify-center pt-5 pb-6">
                              <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                 <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                              </svg>
                              <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to upload</span> or drag and drop</p>
                              <p class="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                           </div>
                           <input (change)="onFileSelected($event)" ngModel name="image" id="dropzone-file" type="file" class="hidden"/>
                        </label>
                     </div>
                     <!-- Loading message -->
                     <ng-container *ngIf="isLoading && !imageDoneLoading">
                        <div class="flex items-center justify-center w-full">
                           <div class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                              <div class="flex flex-col items-center justify-center pt-5 pb-6">
                                 <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">{{loadingMessage}}</span></p>
                                 <p class="text-xs text-gray-500 dark:text-gray-400">Thank You For Your patience!</p>
                              </div>
                           </div>
                        </div>
                     </ng-container>
                     <!-- Image uploaded message -->
                     <ng-container *ngIf="isLoading && imageDoneLoading">
                        <div class="flex items-center justify-center w-full">
                           <div class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                              <div class="flex flex-col items-center justify-center pt-5 pb-6">
                                 <svg class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" height="30px" width="30px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve" fill="#000000" stroke="#000000" stroke-width="1.024">
                                    <!-- ... Your SVG path ... -->
                                 </svg>
                                 <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Image got uploaded, continue with your post</span></p>
                                 <p class="text-xs text-gray-500 dark:text-gray-400">Thank You For Your patience!</p>
                              </div>
                           </div>
                        </div>
                     </ng-container>
                     <!-- Modal footer -->
                     <div class="flex items-center mt-6 space-x-2 rtl:space-x-reverse">
                        <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                        <button (click)="toggleMediaModal()" type="button" class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">Cancel</button>
                     </div>
                     </form>
                  </div>
               </div>
            </div>
         </div>

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
      </article>
   </main>
</div>
  `,
  styles: [
    `
::-webkit-scrollbar{
    width: 0px;
    height: 0px;
    background-color: #504e70;
    border-radius: 15px;
}
    `
  ]
})
export class SingleUserComponent implements OnInit {

  userId!: string;
  mainUserId!: string;
  selectedFile: any;
  buttonText!: string;
  uploadedImage!: string;
  selectedPostId: string | null = null;
  followingUsersImages!: Array<string>; 
  user$ = new BehaviorSubject<IFetchUser | null>(null);
  textPosts$ = new BehaviorSubject<IPost[]>([]);
  mediaPosts$ = new BehaviorSubject<IMediaPost[]>([]);
  mergedPost$ = new BehaviorSubject<(IMediaPost | IPost)[]>([]);
  data$ = combineLatest([this.user$, this.textPosts$]).pipe(
  map(([user, textPosts]) => ({ user, textPosts }))
  );
  isLoading: boolean = false;
  isMediaModalOpen: boolean = false;
  imageDoneLoading: boolean = false;
  loadingMessage: string = 'Your Image is Loading, Please wait';
  form = {
    title: '',
    content: ''
  };

  constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService, private firebaseService: FirebaseService, private postService: PostService, private userService: UserService) {}

  ngOnInit(): void {
    initFlowbite();
    (this.authService.userId) ? this.mainUserId = this.authService.userId : null;
    this.route.params.subscribe(params => {
      // Get the userId from the route parameters
      const id = params['id']; 
      id ? this.userId = id: null;
      id ? this.firebaseService.getUserById(id).then((user) => {(user)? this.user$.next(user) : console.error('User not Found')}) : null;
      id ? this.postService.getUserPosts(id).subscribe((textPosts) => {
        this.textPosts$.next(textPosts);
      }) : null;
      id ? this.postService.getUserMediaPosts(id).subscribe((posts) => {
        this.mediaPosts$.next(posts);
      }) : null;
    });

    // Button Text implementation::::
    (this.userId === this.mainUserId)
        ? this.buttonText = 'Edit Profile'
            : this.userService.isUserInFollowingList(this.mainUserId, this.userId)
            .then((isFollowing: boolean) => {
                this.buttonText = isFollowing ? 'Unfollow' : 'Follow';
            });
    // Button Text implementation::::

    console.log(this.user$);

    this.data$.subscribe(({ user, textPosts }) => {
      // Do something with user and posts
      console.log(user, textPosts);
    });
    

    // this.onAddPost('f9qY9yEHwrLIcNg25Xop', 'My post content withoout Picture').then((post) => {
    //   console.log(post)
    // })


    this.mergedPost$ = new BehaviorSubject<(IPost | IMediaPost)[]>([]);
    // Then in your combineLatest logic:
    combineLatest([this.textPosts$, this.mediaPosts$]).pipe(
        map(([textPosts, mediaPosts]) => [...textPosts, ...mediaPosts]),
        // Ensure that timestamp is always a Timestamp object
        map(posts => posts.map(post => ({
          ...post,
          timestamp: Timestamp.fromDate(post.timestamp.toDate())
        }))),
        // Sort the posts based on their timestamps in ascending order
        map(posts => posts.sort((a, b) => b.timestamp.toMillis() - a.timestamp.toMillis()))
      ).subscribe(mergedPosts => {
        this.mergedPost$.next(mergedPosts); // I Then use next method to update the BehaviorSubject
    });


    // Fetch the following user ids
    this.userService.getFollowingList(this.mainUserId)
      .pipe(
        take(1) // Take only one emission to avoid potential memory leaks
      )
      .subscribe(async (followingUserIds: string[]) => {
        // Get the user details for the top 5 following users
        const userPromises = followingUserIds.slice(0, 5).map(userId => {
          // Assuming you have a service method to get user details by id
          return this.firebaseService.getUserById(userId);
        });

        const users = await Promise.all(userPromises);

        this.followingUsersImages = users.map(user => user?.image || '');
        console.log(this.followingUsersImages);
      });

  
  }

  async onAddPost(form: any) {
    const post: IPost = {
      id: '',
      title: form.title,
      content: form.content,
      timestamp: Timestamp.now(),
      likes: 0,
    };

    try {
        const postId = await this.postService.addPost(post, this.userId);
        console.log(`Post added with ID: ${postId}`);
    } catch (error) {
        console.error('Error adding post:', error);
    }
  }

  async onAddMediaPost(userId: string, newPost: IMediaPost): Promise<void> {
    if (!this.uploadedImage) {
      console.error('Image not uploaded');
      // You might want to show an error message to the user
      return;
    }

    const post: IMediaPost = {
      id: newPost.id,
      title: newPost.title,
      content: newPost.content,
      timestamp: newPost.timestamp,
      likes: newPost.likes,
      images: [this.uploadedImage]
    };

    try {
      const postId = await this.postService.addMediaPost(post, userId);
      console.log(`Post added: `, post);
      console.log(`Post added with ID: ${postId}`);
    } catch (error) {
      console.error('Error adding post:', error);
      // You might want to show an error message to the user
    }
  }
  

  async uploadImage(): Promise<string> {
    if (this.selectedFile) {
      try {
        const imageUrlPromise = this.postService.uploadImage(this.selectedFile, this.userId);
        const imageUrl = await imageUrlPromise;
        this.loadingMessage = 'Image uploaded successfully!';
        console.log('Image uploaded successfully. URL:', imageUrl);
        this.uploadedImage = imageUrl;
        setTimeout(() => {
            this.imageDoneLoading = true;
            this.isLoading = false;
        })
        return imageUrl;
      } catch (error) {
        console.error('Error uploading image:', error);
        return 'demo image';
      } finally {
        // Reset the file input and button state
        this.selectedFile = null;
      }
    }
    return 'demo image';
  }
  

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    console.log('selected file', this.selectedFile);
    this.isLoading = true; 
    this.uploadImage();
  }

  onSubmitClick(form: any): void {
    const newPost: IMediaPost = {
      id: '',
      title: this.form.title,
      content: this.form.content,
      timestamp: Timestamp.now(),
      images: [this.uploadedImage],
      likes: 0
    };

    console.log('post: ' ,newPost);
  
    this.onAddMediaPost(this.userId, newPost);
  }

  isMediaPost(post: IPost | IMediaPost): post is IMediaPost {
    return (post as IMediaPost).images !== undefined;
  }

  toggleMediaModal(): void{
    this.isMediaModalOpen = !this.isMediaModalOpen;
  }

  checkButtonText(event: MouseEvent, userForActionsId: string): void{
    const buttonText = (event.target as HTMLButtonElement).innerText.toLowerCase();
    (buttonText == 'edit') ? console.log('Do Somethng, route to another page')
    : (buttonText == 'follow') ? this.followUser(userForActionsId)
     : (buttonText == 'unfollow') ? this.unfollowUser(userForActionsId) : null;
  }

  async followUser(userIdToFollow: string) {
    const currentUserId = this.mainUserId;
    await this.userService.updateFollowing(currentUserId, userIdToFollow);
  }

  async unfollowUser(userIdToUnfollow: string) {
    const currentUserId = this.mainUserId;
    await this.userService.removeUserFromFollowing(currentUserId, userIdToUnfollow);
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




/*

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

<div class="bg-white shadow rounded-lg mb-6">
            <div class="flex flex-row px-2 py-3 mx-3">
                <div class="w-auto h-auto rounded-full">
                    <img class="w-12 h-12 object-cover rounded-full shadow cursor-pointer" alt="User avatar" src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80">
                </div>
                <div class="flex flex-col mb-2 ml-4 mt-1">
                    <div class="text-gray-600 text-sm font-semibold">John Doe</div>
                    <div class="flex w-full mt-1">
                        <div class="text-blue-700 font-base text-xs mr-1 cursor-pointer">
                            SEO
                        </div> 
                        <div class="text-gray-400 font-thin text-xs">
                            • 30 seconds ago
                        </div>
                    </div>
                </div>
            </div>
            <div class="border-b border-gray-100"></div> 
            <div class="text-gray-400 font-medium text-sm mb-7 mt-6 mx-3 px-2">
                <div class="grid grid-cols-6 col-span-2   gap-2  ">
                    <div class=" overflow-hidden rounded-xl col-span-3 max-h-[14rem]">
                        <img class="h-full w-full object-cover " src="https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?ixlib=rb-1.2.1&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=735&amp;q=80" alt="">
                    </div>
                    <div class=" overflow-hidden rounded-xl col-span-3 max-h-[14rem]">
                        <img class="h-full w-full object-cover  " src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=1399&amp;q=80" alt="">
                    </div>
                    <div class=" overflow-hidden rounded-xl col-span-2 max-h-[10rem]">
                        <img class="h-full w-full object-cover " src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=1470&amp;q=80" alt="">
                    </div>
                    <div class=" overflow-hidden rounded-xl col-span-2 max-h-[10rem]">
                        <img class="h-full w-full object-cover " src="https://images.unsplash.com/photo-1503602642458-232111445657?ixlib=rb-1.2.1&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=687&amp;q=80" alt="">
                    </div>
                    <div class="relative overflow-hidden rounded-xl col-span-2 max-h-[10rem]">
                        <div class="text-white text-xl absolute inset-0  bg-slate-900/80 flex justify-center items-center">
                        + 23
                        </div>
                        <img class="h-full w-full object-cover " src="https://images.unsplash.com/photo-1560393464-5c69a73c5770?ixlib=rb-1.2.1&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=765&amp;q=80" alt="">
                    </div>
                </div>
            </div>
            <div class="text-gray-500 text-sm mb-6 mx-3 px-2">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500</div>
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
                    <div class="flex text-gray-700 font-normal rounded-md mb-2 mr-4 items-center">Comments:<div class="ml-1 text-gray-400 text-ms"> 30</div></div>
                    <div class="flex text-gray-700 font-normal rounded-md mb-2 mr-4 items-center">Views: <div class="ml-1 text-gray-400 text-ms"> 60k</div></div>
                </div>
                <div class="mt-3 mx-5 w-full flex justify-end text-xs">
                    <div class="flex text-gray-700  rounded-md mb-2 mr-4 items-center">Likes: <div class="ml-1 text-gray-400  text-ms"> 120k</div></div>
                </div>
            </div>
            <div class="text-black p-4 antialiased flex">
                <img class="rounded-full h-8 w-8 mr-2 mt-1 " src="https://picsum.photos/id/1027/200/200">
                <div>
                    <div class="bg-gray-100 rounded-lg px-4 pt-2 pb-2.5">
                        <div class="font-semibold text-sm leading-relaxed">Sara Lauren</div>
                        <div class="text-xs leading-snug md:leading-normal">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</div>
                    </div>
                    <div class="text-xs  mt-0.5 text-gray-500">14 w</div>
                    <div class="bg-white border border-white rounded-full float-right -mt-8 mr-0.5 flex shadow items-center ">
                        <svg class="p-0.5 h-5 w-5 rounded-full z-20 bg-white" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 16 16"><defs><linearGradient id="a1" x1="50%" x2="50%" y1="0%" y2="100%"><stop offset="0%" stop-color="#18AFFF"></stop><stop offset="100%" stop-color="#0062DF"></stop></linearGradient><filter id="c1" width="118.8%" height="118.8%" x="-9.4%" y="-9.4%" filterUnits="objectBoundingBox"><feGaussianBlur in="SourceAlpha" result="shadowBlurInner1" stdDeviation="1"></feGaussianBlur><feOffset dy="-1" in="shadowBlurInner1" result="shadowOffsetInner1"></feOffset><feComposite in="shadowOffsetInner1" in2="SourceAlpha" k2="-1" k3="1" operator="arithmetic" result="shadowInnerInner1"></feComposite><feColorMatrix in="shadowInnerInner1" values="0 0 0 0 0 0 0 0 0 0.299356041 0 0 0 0 0.681187726 0 0 0 0.3495684 0"></feColorMatrix></filter><path id="b1" d="M8 0a8 8 0 00-8 8 8 8 0 1016 0 8 8 0 00-8-8z"></path></defs><g fill="none"><use fill="url(#a1)" xlink:href="#b1"></use><use fill="black" filter="url(#c1)" xlink:href="#b1"></use><path fill="white" d="M12.162 7.338c.176.123.338.245.338.674 0 .43-.229.604-.474.725a.73.73 0 01.089.546c-.077.344-.392.611-.672.69.121.194.159.385.015.62-.185.295-.346.407-1.058.407H7.5c-.988 0-1.5-.546-1.5-1V7.665c0-1.23 1.467-2.275 1.467-3.13L7.361 3.47c-.005-.065.008-.224.058-.27.08-.079.301-.2.635-.2.218 0 .363.041.534.123.581.277.732.978.732 1.542 0 .271-.414 1.083-.47 1.364 0 0 .867-.192 1.879-.199 1.061-.006 1.749.19 1.749.842 0 .261-.219.523-.316.666zM3.6 7h.8a.6.6 0 01.6.6v3.8a.6.6 0 01-.6.6h-.8a.6.6 0 01-.6-.6V7.6a.6.6 0 01.6-.6z"></path></g></svg>
                        <svg class="p-0.5 h-5 w-5 rounded-full -ml-1.5 bg-white" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 16 16"><defs><linearGradient id="a2" x1="50%" x2="50%" y1="0%" y2="100%"><stop offset="0%" stop-color="#FF6680"></stop><stop offset="100%" stop-color="#E61739"></stop></linearGradient><filter id="c2" width="118.8%" height="118.8%" x="-9.4%" y="-9.4%" filterUnits="objectBoundingBox"><feGaussianBlur in="SourceAlpha" result="shadowBlurInner1" stdDeviation="1"></feGaussianBlur><feOffset dy="-1" in="shadowBlurInner1" result="shadowOffsetInner1"></feOffset><feComposite in="shadowOffsetInner1" in2="SourceAlpha" k2="-1" k3="1" operator="arithmetic" result="shadowInnerInner1"></feComposite><feColorMatrix in="shadowInnerInner1" values="0 0 0 0 0.710144928 0 0 0 0 0 0 0 0 0 0.117780134 0 0 0 0.349786932 0"></feColorMatrix></filter><path id="b2" d="M8 0a8 8 0 100 16A8 8 0 008 0z"></path></defs><g fill="none"><use fill="url(#a2)" xlink:href="#b2"></use><use fill="black" filter="url(#c2)" xlink:href="#b2"></use><path fill="white" d="M10.473 4C8.275 4 8 5.824 8 5.824S7.726 4 5.528 4c-2.114 0-2.73 2.222-2.472 3.41C3.736 10.55 8 12.75 8 12.75s4.265-2.2 4.945-5.34c.257-1.188-.36-3.41-2.472-3.41"></path></g></svg>
                        <span class="text-sm ml-1 pr-1.5 text-gray-500">3</span>
                    </div>
                </div>
            </div>
            <div class="relative flex items-center self-center w-full max-w-xl p-4 overflow-hidden text-gray-600 focus-within:text-gray-400">
                <img class="w-10 h-10 object-cover rounded-full shadow mr-2 cursor-pointer" alt="User avatar" src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80">
                <span class="absolute inset-y-0 right-0 flex items-center pr-6">
                    <button type="submit" class="p-1 focus:outline-none focus:shadow-none hover:text-blue-500">
                    <svg class="w-6 h-6 transition ease-out duration-300 hover:text-blue-500 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>

                    </button>
                </span>
                    <input type="search" class="w-full py-2 pl-4 pr-10 text-sm bg-gray-100 border border-transparent appearance-none rounded-tg placeholder-gray-400" style="border-radius: 25px" placeholder="Post a comment..." autocomplete="off">
            </div>
        </div>
 */