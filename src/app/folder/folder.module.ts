import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FolderPageRoutingModule } from './folder-routing.module';

import { FolderPage } from './folder.page';
import { BrowserModule } from '@angular/platform-browser';
import { MensajesComponent } from '../componentes/mensajes/mensajes.component';
import { ChatComponent } from '../componentes/chat/chat.component';
import { AlbumesComponent } from '../componentes/albumes/albumes.component';
import { AlbumComponent } from '../componentes/album/album.component';
import { PipesModule } from '../pipes/pipes.module';

import { Camera } from '@ionic-native/camera/ngx';
import { ImagePicker } from "@ionic-native/image-picker/ngx";
import { File } from "@ionic-native/file/ngx";

import { ProdAltaComponent } from '../componentes/prod-alta/prod-alta.component';
import { AngularFireStorageModule } from '@angular/fire/storage';

@NgModule({
  imports: [
    FormsModule,
    IonicModule,
    FolderPageRoutingModule,
    CommonModule,
    PipesModule,
    AngularFireStorageModule,
    ReactiveFormsModule
  ],
  declarations: [FolderPage, MensajesComponent, ChatComponent, AlbumesComponent, AlbumComponent, ProdAltaComponent],
  entryComponents:[MensajesComponent, ChatComponent, AlbumesComponent, AlbumComponent, ProdAltaComponent],
  providers:[
    Camera,
    ImagePicker,
    File
  ]
})
export class FolderPageModule {}
