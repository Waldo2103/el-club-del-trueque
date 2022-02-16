import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import { PipesModule } from '../../pipes/pipes.module';

import { Camera } from '@ionic-native/camera/ngx';
import { ImagePicker } from "@ionic-native/image-picker/ngx";
import { File } from "@ionic-native/file/ngx";


@NgModule({
  imports: [
    PipesModule,
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    ReactiveFormsModule
  ],
  providers: [ImagePicker, Camera, File],
  declarations: [HomePage],
  entryComponents: []
})
export class HomePageModule {}
