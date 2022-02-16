import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy, IonMenu } from '@ionic/angular';
/* import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx'; */

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { environment } from 'src/environments/environment';
//FIREBASE
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/firestore';


import { ReactiveFormsModule, FormsModule } from '@angular/forms';

//import { Facebook  } from '@ionic-native/facebook/ngx';
import { GooglePlus  } from '@ionic-native/google-plus/ngx';
import { CommonModule } from '@angular/common';
import { MensajesComponent } from './componentes/mensajes/mensajes.component';
import { FolderPage } from './folder/folder.page';
import { ProductoComponent } from './componentes/producto/producto.component';
import { PhotoViewer } from "@ionic-native/photo-viewer/ngx";
import { ProdAltaComponent } from './componentes/prod-alta/prod-alta.component';
import { AlbumesComponent } from './componentes/albumes/albumes.component';
import { GrupoComponent } from './componentes/grupos/grupo/grupo.component';

//import './polyfills';

import {CdkTableModule} from '@angular/cdk/table';
import {CdkTreeModule} from '@angular/cdk/tree';
import {HttpClientModule} from '@angular/common/http';

import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';


@NgModule({
  declarations: [AppComponent, FolderPage, ProductoComponent, ProdAltaComponent, AlbumesComponent, GrupoComponent],
  entryComponents: [FolderPage, ProductoComponent, ProdAltaComponent, AlbumesComponent, GrupoComponent],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    BrowserAnimationsModule
  ],
  exports: [],
  providers: [
    GooglePlus,
    //Facebook,
    /* StatusBar,
    SplashScreen, */
    PhotoViewer,
    //native
    //Geolocation,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
