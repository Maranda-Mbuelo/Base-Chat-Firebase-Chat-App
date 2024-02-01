import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage'
import { environment } from 'src/environments/environment.prod';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    CommonModule,
    BrowserAnimationsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }


/*
https://learn.microsoft.com/api/achievements/share/en-gb/MbueloMaranda-5960/24HKWS9V?sharingId=659D21D1B9BCBA58

https://learn.microsoft.com/api/achievements/share/en-gb/MbueloMaranda-5960/DG76ZBLJ?sharingId=659D21D1B9BCBA58

https://learn.microsoft.com/api/achievements/share/en-gb/MbueloMaranda-5960/K5RLR4SB?sharingId=659D21D1B9BCBA58

https://learn.microsoft.com/en-gb/users/mbuelomaranda-5960/transcript/dlmwrc1yx596r80

https://learn.microsoft.com/api/achievements/share/en-gb/MbueloMaranda-5960/AQ9EXSY7?sharingId=659D21D1B9BCBA58

https://learn.microsoft.com/api/achievements/share/en-gb/MbueloMaranda-5960/9NKF6H2U?sharingId=659D21D1B9BCBA58

https://learn.microsoft.com/api/achievements/share/en-gb/MbueloMaranda-5960/8RTAHPAW?sharingId=659D21D1B9BCBA58

https://learn.microsoft.com/api/achievements/share/en-gb/MbueloMaranda-5960/EJFTQQFP?sharingId=659D21D1B9BCBA58

https://learn.microsoft.com/api/achievements/share/en-gb/MbueloMaranda-5960/ZP3477H2?sharingId=659D21D1B9BCBA58

https://learn.microsoft.com/api/achievements/share/en-gb/MbueloMaranda-5960/FZLV7VVX?sharingId=659D21D1B9BCBA58

https://learn.microsoft.com/api/achievements/share/en-gb/MbueloMaranda-5960/3XDRXFVH?sharingId=659D21D1B9BCBA58

https://learn.microsoft.com/api/achievements/share/en-gb/MbueloMaranda-5960/9NKXNZQU?sharingId=659D21D1B9BCBA58

https://learn.microsoft.com/api/achievements/share/en-gb/MbueloMaranda-5960/24HB43SV?sharingId=659D21D1B9BCBA58

https://learn.microsoft.com/api/achievements/share/en-gb/MbueloMaranda-5960/9NKXFWXU?sharingId=659D21D1B9BCBA58

https://learn.microsoft.com/api/achievements/share/en-gb/MbueloMaranda-5960/UFBYXGW3?sharingId=659D21D1B9BCBA58
*/