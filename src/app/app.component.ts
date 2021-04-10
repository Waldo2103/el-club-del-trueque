import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { AuthService } from './servicios/auth.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Inicio', url: '/home', icon: 'home', color:"success" },
    { title: 'Perfil', url: '/folder/Perfil', icon: 'person', color:"primary" },
    { title: 'Mis Trueques', url: '/folder/Mis Trueques', icon: 'repeat', color:"danger" },
    { title: 'Mensajes', url: '/folder/Mensajes', icon: 'mail', color:"warning" },
    { title: 'Mi Album', url: '/folder/Albumes', icon: 'book', color:"secondary" },
    { title: 'Login', url: '/login', icon: 'person', color:"success" },/*
    { title: 'Login', url: '', func: 'logout()', icon: 'log-out', color:"danger" },
    { title: 'Historial', url: '/folder/Spam', icon: 'time' },*/
  ];
  //public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor(private router: Router, private authService: AuthService,
      private ctrl: MenuController
    ) {} 
  ngOnInit(){
  }
  logout(){
    this.ctrl.enable(false);
    this.authService.logout();
}



}

