import { Component, Input } from '@angular/core';
import { NewsArticle } from '../interfaces/news.model';

@Component({
  selector: 'app-block',
  template: `
<div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
  <div *ngFor="let article of news" class="bg-white shadow-lg rounded-lg relative">
    <img [src]="article.urlToImage" alt="{{ article.title }}" class="w-full h-40 object-cover rounded-t-lg" (error)="handleImageError($event, article)">
    <div class="p-6">
      <h2 class="text-2xl font-bold mb-2">{{ article.title }}</h2>
      <p class="text-gray-600 mb-4">{{ article.description }}</p>
      <a [href]="article.url" class="text-blue-500 hover:underline">Read more</a>
      <button class="love-icon absolute bottom-2 right-2" (click)="toggleLoveIcon(article)">
        <i *ngIf="article.loved" class="fa-solid fa-heart" style="color: #ec3232;"></i>
        <i *ngIf="!article.loved" class="fa fa-heart" aria-hidden="true"></i>
      </button>
    </div>
  </div>
</div>
  `,
  styles: [
  ]
})
export class BlockComponent {
  @Input() news: NewsArticle[] = [];

  toggleLoveIcon(article: NewsArticle): void {
    article.loved = !article.loved;
  }

  handleImageError(event: Event, article: NewsArticle): void {
    const fallbackImageUrl = 'https://cdn.pixabay.com/photo/2015/03/17/02/01/cubes-677092_1280.png';
    (event.target as HTMLImageElement).src = fallbackImageUrl;
    article.urlToImage = fallbackImageUrl;
  }
  
}