import { Component, HostBinding, OnInit, ChangeDetectorRef  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IMediaPost, IPost } from '../interfaces/others.model';
import { PostService } from '../services/post.service';
import { Timestamp } from '@angular/fire/firestore';
import { Location } from '@angular/common';

@Component({
  selector: 'app-edit-post',
  template: `
    <div *ngIf="post" class="flex justify-center items-center flex-col w-full h-[100dvh] mt-16 bg-gray-200">
      <div class="heading text-center font-bold text-2xl m-5 text-gray-600">Edit Post</div>
      <div class="editor mx-auto w-10/12 flex flex-col text-gray-800 border border-gray-300 p-4 shadow-lg max-w-2xl">
        <input [(ngModel)]="post.title" class="title bg-gray-100 border border-gray-300 p-2 mb-4 outline-none" spellcheck="true" type="text">
        <textarea [(ngModel)]="post.content" class="description bg-gray-100 sec p-3 h-60 border border-gray-300 outline-none" spellcheck="true"></textarea>
        
        <!-- icons -->
        <div class="icons flex text-gray-500 m-2">
          <svg class="mr-2 cursor-pointer hover:text-gray-700 border rounded-full p-1 h-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          <svg class="mr-2 cursor-pointer hover:text-gray-700 border rounded-full p-1 h-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <svg class="mr-2 cursor-pointer hover:text-gray-700 border rounded-full p-1 h-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
          <div class="count ml-auto text-gray-400 text-xs font-semibold">0/300</div>
        </div>
        <!-- buttons -->
        <div class="buttons flex">
          <button (click)="toggleImageButton()" *ngIf="isMediaPost(post)" class="flex-start rounded-sm border border-gray-300 cursor-pointer bg-gray-300 text-gray-500 font-semibold hover:bg-gray-400 hover:text-white py-1 px-3 transition-all duration-100">Show Image</button>
          <button (click)="goBack()" class="rounded-sm border border-gray-300 p-1 px-4 font-semibold cursor-pointer text-gray-500 ml-auto hover:bg-gray-400 hover:text-white transition-all duration-100">Cancel</button>
          <button (click)="savePost()" class="rounded-sm border border-indigo-500 p-1 px-4 font-semibold cursor-pointer text-gray-200 ml-2 bg-indigo-500 hover:bg-red-700 hover:border-red-300 hover:text-white transition-all duration-100">Save</button>
        </div>
      </div>
    </div>

   <!-- Image Overlay -->
  <div *ngIf="showImage" class="image-overlay">
    <button (click)="toggleImageButton()" class="absolute top-8 right-8 hover:bg-red-600 hover:text-red-600 background-none border-none cursor-pointer" (click)="showImage = false">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-6 w-6 text-white">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    </button>
    <img *ngIf="isMediaPost(post)" class="absolute w-full h-auto max-w-lg transition-all duration-300 rounded-lg cursor-pointer filter grayscale hover:grayscale-0" [src]="post.images[0]" alt="image">
  </div>

  `,
  styles: [
    `
    .image-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 999;
    }

    .image-overlay img {
      z-index: 1000;
    }

    `
  ]
})
export class EditPostComponent implements OnInit {
  // Dynamically set the margin-top property based on the navigation bar height
  @HostBinding('style.margin-top') marginTop = '164px'; // i should adjust based on my actual navigation bar height

  userId!: string;
  post: IPost | IMediaPost = {} as IPost | IMediaPost;
  showImage: boolean = false;

  constructor(private route: ActivatedRoute, private postService: PostService, private location: Location, private cdr: ChangeDetectorRef){}

  async ngOnInit(): Promise<void> {
    this.route.params.subscribe(async params => {
      const postId = params['postId']; 
      const userId = params['userId'];
      this.userId = userId;
  
      if (userId && postId) {
        try {
          const post = await this.postService.getPostById(userId, postId);
          if (post) {
            if (this.isMediaPost(post)) {
              // Post is of type IMediaPost
              console.log(post.images);
            } else {
              // Post is of type IPost
              console.log("Regular post without images");
            }
  
            this.post = post;  
            // Manually trigger change detection
            this.cdr.detectChanges();
          } else {
            console.error('Post not found');
          }
        } catch (error) {
          console.error('Error fetching post data:', error);
        }
      }
    });
  }

  savePost(): void {
    if(this.isMediaPost(this.post)){
      this.postService.updateMediaPostById(this.userId, this.post.id, this.post).then((post) => {
        console.log("Post Saved Successfully: ", post)
      }).catch((error) => {
        console.log(error);
      })
    } else{
      this.postService.updatePostById(this.userId, this.post.id, this.post).then((post) => {
        console.log("Post Saved Successfully: ", post)
      }).catch((error) => {
        console.log(error);
      })
    }
  }

  isMediaPost(post: IPost | IMediaPost): post is IMediaPost {
    return (post as IMediaPost).images !== undefined;
  }

  toggleImageButton(): void{
    this.showImage = !this.showImage;
  }

  goBack() {
    this.location.back();
  }
}
