import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { MenuController, Platform } from '@ionic/angular';
import { AuthService } from './servicios/auth.service';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  showSplash = true;
  public appPages = [
    { title: 'Inicio', url: '/home', icon: 'home', color:"success" },
    { title: 'Perfil', url: '/folder/Perfil', icon: 'person', color:"primary" },
    { title: 'Mis Trueques', url: '/folder/Mis Trueques', icon: 'repeat', color:"danger" },
    { title: 'Mensajes', url: '/folder/Mensajes', icon: 'mail', color:"warning" },
    { title: 'Mi Album de Troques', url: '/folder/Albumes', icon: 'book', color:"secondary" }/*,
    { title: 'Login', url: '/login', icon: 'person', color:"success" },
    { title: 'Login', url: '', func: 'logout()', icon: 'log-out', color:"danger" },
    { title: 'Historial', url: '/folder/Spam', icon: 'time' },*/
  ];
  //public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor(
    private router: Router, 
    private authService: AuthService,
    private ctrl: MenuController,
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen
    ) {
      
    } 
  ngOnInit(){
    this.initializeApp()
  }
  logout(){
    this.ctrl.enable(false);
    this.authService.logout();
}

public initializeApp() {
  this.platform.ready().then(() => {
    this.statusBar.styleDefault();
    setTimeout(() => {
      // console.log('Desactivo la Splash Screen estatica');
      this.splashScreen.hide();
    }, 5000);

    setTimeout(() => {
      // console.log('Desactivo la Splash Screen animada');
      this.showSplash = false;
    }, 5000);
  });
}

}


