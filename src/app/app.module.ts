import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy, IonMenu } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { environment } from 'src/environments/environment';
//FIREBASE
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/firestore';


import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { Facebook  } from '@ionic-native/facebook/ngx';
import { GooglePlus  } from '@ionic-native/google-plus/ngx';
import { CommonModule } from '@angular/common';
import { MensajesComponent } from './componentes/mensajes/mensajes.component';
import { FolderPage } from './folder/folder.page';





@NgModule({
  declarations: [AppComponent, FolderPage],
  entryComponents: [FolderPage],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule
  ],
    exports:[],
  providers: [
    GooglePlus,
    Facebook,
    StatusBar,
    SplashScreen,
    //native
    //Geolocation,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
