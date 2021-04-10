import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FolderPageRoutingModule } from './folder-routing.module';

import { FolderPage } from './folder.page';
import { BrowserModule } from '@angular/platform-browser';
import { MensajesComponent } from '../componentes/mensajes/mensajes.component';
import { ChatComponent } from '../componentes/chat/chat.component';
import { AlbumesComponent } from '../componentes/albumes/albumes.component';
import { AlbumComponent } from '../componentes/album/album.component';
import { PipesModule } from '../pipes/pipes.module';

@NgModule({
  imports: [
    FormsModule,
    IonicModule,
    FolderPageRoutingModule,
    CommonModule,
    PipesModule
  ],
  declarations: [FolderPage, MensajesComponent, ChatComponent, AlbumesComponent, AlbumComponent],
  entryComponents:[MensajesComponent, ChatComponent, AlbumesComponent, AlbumComponent]
})
export class FolderPageModule {}
