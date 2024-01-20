import { Component } from '@angular/core';

@Component({
  selector: 'app-posts',
  template: `
<div class="min-h-screen w-full bg-blue-600 flex justify-center items-center">
   <div class="w-full bg-gray-300 h-[93vh] relative top-8 pt-4">
      <div class="flex items-center	justify-between">
         <div class="gap-3.5	flex items-center ">
            <img src="https://images.unsplash.com/photo-1617077644557-64be144aa306?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80" class="object-cover bg-yellow-500 rounded-full w-10 h-10" />
            <div class="flex flex-col">
               <b class="mb-2 capitalize">sofia müller</b>
               <time datetime="06-08-21" class="text-gray-400 text-xs">06 August at 09.15 PM
               </time>
            </div>
         </div>
         <div class="bg-gray-100	rounded-full h-3.5 flex	items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="34px" fill="#92929D">
               <path d="M0 0h24v24H0V0z" fill="none" />
               <path
                  d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
         </div>

         
   </div>

</div>
  `,
  styles: [
  ]
})
export class PostsComponent {

}
