import { AfterViewInit, Component, OnInit } from '@angular/core';
import { initializeApp } from "firebase/app";
import { initFlowbite } from 'flowbite';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'Firebase_Chat_App';

  ngOnInit(): void {
    initializeApp(environment.firebase)
  }

  ngAfterViewInit(): void {
    initFlowbite();
  }
}
