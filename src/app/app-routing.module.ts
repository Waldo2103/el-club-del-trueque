import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { MensajesComponent } from './componentes/mensajes/mensajes.component';
import { FolderPageRoutingModule } from './folder/folder-routing.module';
import { FolderPageModule } from './folder/folder.module';
import { AuthGuard } from './guardias/auth.guard';
import { NoLoginGuard } from './guardias/no-login.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./paginas/home/home.module').then( m => m.HomePageModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'login',
    loadChildren: () => import('./paginas/login/login.module').then( m => m.LoginPageModule),
    canActivate:[NoLoginGuard]
  },
  {
    path: 'registro',
    loadChildren: () => import('./paginas/registro/registro.module').then( m => m.RegistroPageModule),
    canActivate:[NoLoginGuard]
  },
  {
    path: 'modal-page',
    loadChildren: () => import('./paginas/modal-page/modal-page.module').then( m => m.ModalPagePageModule)
  }


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }), 
    BrowserModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
