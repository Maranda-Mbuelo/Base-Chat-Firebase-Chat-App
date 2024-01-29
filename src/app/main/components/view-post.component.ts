import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, combineLatest, filter, fromEvent, map, of, take } from 'rxjs';
import { IPost, IMediaPost } from '../interfaces/others.model';
import { IFetchUser } from '../interfaces/user.model';
import { PostService } from '../services/post.service';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-view-post',
  template: `
<div *ngIf="data$ | async as data" class="h-screen mt-8 overflow-y-scroll bg-gray-100">
   <div class="flex flex-col pt-12 lg:flex-row">
      <!-- Post Section -->
      <div class="lg:w-2/3 p-4 overflow-y-scroll">
         <div class="bg-white shadow rounded-lg my-4 overflow-y-scroll">
            <ng-container *ngIf="data.post && data.user">
               <div *ngIf="isMediaPost(data.post)" class="relative">
                  <div class="flex flex-row px-2 py-3 mx-3">
                     <div class="w-auto h-auto rounded-full border-2 border-green-500">
                        <img class="w-12 h-12 object-cover rounded-full shadow cursor-pointer" alt="User avatar" [src]="data.user.image">
                     </div>
                     <div class="flex flex-col mb-2 ml-4 mt-1">
                        <div class="text-gray-600 text-sm font-semibold" [innerHTML]="data.user.username"></div>
                        <div class="flex w-full mt-1">
                           <div class="text-blue-700 font-base text-xs mr-1 cursor-pointer">
                              UX Design
                           </div>
                           <div class="text-gray-400 font-thin text-xs">
                              • {{data.post.timestamp.toDate() | date:"MMM dd, yyyy 'at' hh:mm a"}}
                           </div>
                        </div>
                     </div>
                  </div>
                  <div class="border-b border-gray-100"></div>
                  <div class="text-gray-400 font-medium text-sm mb-7 mt-6 mx-3 px-2">
                     <img class="rounded w-full" [src]="data.post.images[0]" target="_blank" rel="noopener noreferrer">
                  </div>
                  <div *ngIf="data.post.title" class="text-gray-600 font-semibold  mb-2 mx-3 px-2" [innerText]="data.post.title"></div>
                  <div *ngIf="data.post.content" class="text-gray-500 text-sm mb-6 mx-3 px-2" [innerText]="data.post.content"></div>
                  <div class="flex justify-start mb-4 border-t border-gray-100">
                     <div class="flex w-full mt-1 pt-2 pl-5">
                        <span class="bg-white transition ease-out duration-300 hover:text-red-500 border w-8 h-8 px-2 pt-2 text-center rounded-full text-gray-400 cursor-pointer mr-2">
                           <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="14px" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                           </svg>
                        </span>
                        <!-- <img class="inline-block object-cover w-8 h-8 text-white border-2 border-white rounded-full shadow-sm cursor-pointer" src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=2&amp;w=256&amp;h=256&amp;q=80" alt="">
                        <img class="inline-block object-cover w-8 h-8 -ml-2 text-white border-2 border-white rounded-full shadow-sm cursor-pointer" src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&amp;auto=format&amp;fit=facearea&amp;facepad=2&amp;w=256&amp;h=256&amp;q=80" alt="">
                        <img class="inline-block object-cover w-8 h-8 -ml-2 text-white border-2 border-white rounded-full shadow-sm cursor-pointer" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=634&amp;q=80" alt="">
                        <img class="inline-block object-cover w-8 h-8 -ml-2 text-white border-2 border-white rounded-full shadow-sm cursor-pointer" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=2.25&amp;w=256&amp;h=256&amp;q=80" alt=""> -->
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
                           <div class="ml-1 text-gray-400 text-ms" [innerText]="data.post.likes"></div>
                        </div>
                     </div>
                  </div>
                  <div class="relative flex items-center self-center w-full max-w-xl p-4 overflow-hidden text-gray-600 focus-within:text-gray-400">
                     <img class="w-10 h-10 object-cover rounded-full shadow mr-2 cursor-pointer" alt="User avatar" [src]="data.user.image">
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
         <!-- Post  End -->
      </div>


      <!-- Comments Section -->
      <div class="lg:w-1/3 p-8 overflow-y-scroll">
         <!-- Your comments content goes here -->
         <h3 class="text-xl font-bold mb-2">Comments</h3>
         <!-- Comment 1 -->
         <!-- component -->
         <!-- <div class="flex items-center space-x-2 space-y-2">
            <div class="group relative flex flex-shrink-0 self-start cursor-pointer pt-2">
               <img src="https://images.unsplash.com/photo-1610156830615-2eb9732de349?ixid=MXwxMjA3fDB8MHx0b3BpYy1mZWVkfDExfHJuU0tESHd3WVVrfHxlbnwwfHx8&amp;ixlib=rb-1.2.1&amp;auto=format&amp;fit=crop&amp;w=500&amp;q=60" alt="" class="h-8 w-8 object-fill rounded-full">

            </div>
            <div class="flex items-center justify-center space-x-2">
               <div class="block">
                  <div class="bg-gray-100 w-auto rounded-xl px-2 pb-2">
                     <div class="font-medium">
                        <a class="text-md font-bold" target="_blank">
                        <small>Hasan Muhammad</small>
                        </a>
                     </div>
                     <div class="text-xs">
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Expedita, maiores!
                     </div>
                  </div>
                  <div class="flex justify-start items-center text-xs w-full">
                     <div class="font-semibold text-gray-700 px-2 flex items-center justify-center space-x-1">
                        <a class="hover:underline" target="_blank">
                        <small>Like</small>
                        </a>
                        <small class="self-center">.</small>
                        <a class="hover:underline" target="_blank">
                        <small>Reply</small>
                        </a>
                        <small class="self-center">.</small>
                        <a class="hover:underline" target="_blank">
                        <small>15 hour</small>
                        </a>
                     </div>
                  </div>
               </div>
            </div>
         </div> -->

         <p class="text-gray-500">No Comments Yet</p>
         <!-- Add more comments as needed -->
      </div>
   </div>
</div>

   `,
  styles: [
    `
    ::-webkit-scrollbar{
    width: 0px;
  }
    `
  ]
})
export class ViewPostComponent implements OnInit {
  user$ = new BehaviorSubject<IFetchUser | null>(null);
  post$ = new BehaviorSubject<IPost | IMediaPost>({} as IPost | IMediaPost);
  data$ = combineLatest([this.user$, this.post$]).pipe(
    map(([user, post]) => ({ user, post }))
    );
  
  constructor(private route: ActivatedRoute, private postService: PostService, private firebaseService: FirebaseService, private cdr: ChangeDetectorRef){}

  async ngOnInit(): Promise<void> {
    this.route.params.subscribe(async params => {
      const userId = params['userId'];
      const postId = params['postId'];

      if (userId && postId) {
        try {
          const post = await this.postService.getPostById(userId, postId);
          const user = await this.firebaseService.getUserById(userId);

          if (post && user) {
            if (this.isMediaPost(post)) {
              const mediaPost = post as IMediaPost;

              // Check if the image has fully loaded
              const isImageLoaded = await this.isImageLoaded(mediaPost.images[0]);

              if (isImageLoaded) {
                console.log('Image has fully loaded');
              } else {
                console.log('Image failed to load');
              }
            } else {
              console.log("Regular post without images");
            }

            this.post$.next(post);
            this.user$.next(user);

            // Manually trigger change detection
            this.cdr.detectChanges();
          } else {
            console.error('Post not found');
          }
        } catch (error) {
          console.error('Error fetching post data:', error);
        }
      }
    }).unsubscribe();
  }

  isMediaPost(post: IPost | IMediaPost): post is IMediaPost {
    return (post as IMediaPost).images !== undefined;
  }

  // Function to check if the image has fully loaded
  async isImageLoaded(imageSrc: string): Promise<boolean> {
    const img = new Image();
    img.src = imageSrc;

    return fromEvent(img, 'load')
      .pipe(
        take(1),
        filter(() => img.complete && img.naturalWidth !== 0)
      )
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

}
