import { AfterViewInit, Component, OnInit } from '@angular/core';
import { initializeApp } from "firebase/app";
import { initFlowbite } from 'flowbite';
import { environment } from 'src/environments/environment.prod';
import { getAuth, setPersistence, browserSessionPersistence } from '@angular/fire/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'Firebase_Chat_App';

  ngOnInit(): void {
    initializeApp(environment.firebase);


    // // Set persistence to SESSION (or LOCAL if you prefer)
    // setPersistence(getAuth(initializeApp(environment.firebase)), browserSessionPersistence)
    //   .then(() => {
    //     // Auth state persistence has been set
    //   })
    //   .catch((error) => {
    //     // Handle errors
    //     console.error('Error setting auth state persistence:', error);
    //   });  
  }

  ngAfterViewInit(): void {
    initFlowbite();
  }
}
