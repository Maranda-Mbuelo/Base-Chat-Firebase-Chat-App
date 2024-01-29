import { Component, OnInit } from '@angular/core';
import { NewsArticle } from '../interfaces/news.model';
import { NewsService } from '../services/news.service';

@Component({
  selector: 'app-catch-up',
  template: `
    <div class="bg-gray-900 text-white fixed top-0 w-full z-10">
      <!-- <app-navbar></app-navbar>
      <div class="p-4 bg-gray-100 text-gray-600">
        <app-searchbar></app-searchbar>
      </div> -->
    </div>

    <div class="pt-24 bg-gray-200 h-screen w-full overflow-y-scroll">
      <!-- Rest of the content -->
      <div class="container mx-auto px-4 py-8">
        <h1 class="text-4xl font-bold mb-8 text-gray-800">Latest News</h1>

        <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div *ngFor="let articleNumber of articleNumbers; let x = index" class="bg-white shadow-lg rounded-lg relative">
            <a [href]="news[x].url" target="_blank" rel="noopener noreferrer">
              <img [src]="news[x].urlToImage" alt="{{ news[x].title }}" (error)="handleImageError($event, news[x])" class="w-full h-40 object-cover rounded-t-lg">
            </a>
            <div class="p-6">
              <h2 class="text-2xl font-bold mb-2">{{ news[x].title }}</h2>
              <p class="text-gray-600 mb-4">{{ news[x].description }}</p>
              <a [href]="news[x].url" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">Read more</a>
              <button class="love-icon absolute bottom-2 right-2">
                <svg width="27px" height="27px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M8.10627 18.2468C5.29819 16.0833 2 13.5422 2 9.1371C2 4.27416 7.50016 0.825464 12 5.50063L14 7.49928C14.2929 7.79212 14.7678 7.79203 15.0607 7.49908C15.3535 7.20614 15.3534 6.73127 15.0605 6.43843L13.1285 4.50712C17.3685 1.40309 22 4.67465 22 9.1371C22 13.5422 18.7018 16.0833 15.8937 18.2468C15.6019 18.4717 15.3153 18.6925 15.0383 18.9109C14 19.7294 13 20.5 12 20.5C11 20.5 10 19.7294 8.96173 18.9109C8.68471 18.6925 8.39814 18.4717 8.10627 18.2468Z" fill="#ff1414"></path> </g></svg>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [
  ]
})
export class CatchUpComponent implements OnInit {
  news: NewsArticle[] = [];

  constructor(private newsService: NewsService) {}

  ngOnInit(): void {
    this.getNews();
  }

  getNews(): void {
    this.newsService.getNews().subscribe(
      response => {
        this.news = response.articles;
        loved: false;
        console.log('News: ', this.news);
      },
      error => {
        console.log(error);
      }
    );
  }

  getNewsByTopic(topic: string): void {
    this.newsService.getNewsByTopic(topic).subscribe(
      response => {
        this.news = response.articles;
        console.log(this.news);
      },
      error => {
        console.log(error);
      }
    );
  }

  toggleLoveIcon(article: NewsArticle): void {
    article.loved = !article.loved;
  }

  handleImageError(event: Event, article: NewsArticle): void {
    const fallbackImageUrl = 'https://cdn.pixabay.com/photo/2015/03/17/02/01/cubes-677092_1280.png';
    (event.target as HTMLImageElement).src = fallbackImageUrl;
    article.urlToImage = fallbackImageUrl;
  }

  range(start: number, end: number): number[] {
    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  }

  // Use the utility function to generate an array from 1 to 100
  articleNumbers: number[] = this.range(1, 100);
}
