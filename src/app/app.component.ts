import { Component, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { Router } from '@angular/router';
//import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { MenuController, Platform } from '@ionic/angular';
import { AuthService } from './servicios/auth.service';
//import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AngularFireAuth } from '@angular/fire/auth';
import { UsuariosService } from './servicios/usuarios/usuarios.service';
import { NotificacionesService } from './servicios/notificaciones/notificaciones.service';
//Capacitor
import { StatusBar, Style } from "@capacitor/status-bar";
import { SplashScreen } from '@capacitor/splash-screen';
//import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  showSplash = false;
  public userLogin;
  //public subscription: Subscription;
  public appPages = [
    { title: 'Inicio', url: '/home', icon: 'home', color: "success" },
    { title: 'Perfil', url: '/folder/Perfil', icon: 'person', color: "primary" },
    { title: 'Mis Trueques', url: '/folder/Trueques', icon: 'sync', color: "danger" },
    { title: 'Mensajes', url: '/folder/Mensajes', icon: 'mail', color: "tertiary" },
    { title: 'Mis Albumes', url: '/folder/Albumes', icon: 'images', color: "secondary" }/*,
    { title: 'Login', url: '/login', icon: 'person', color:"success" },
    { title: 'Login', url: '', func: 'logout()', icon: 'log-out', color:"danger" },
    { title: 'Historial', url: '/folder/Spam', icon: 'time' },*/
  ];
  public labels = []//['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor(
    private router: Router,
    private authService: AuthService,
    private ctrl: MenuController,
    public platform: Platform,
    //public statusBar: StatusBar,
    //public splashScreen: SplashScreen,
    private AFauth: AngularFireAuth,
    private userServ: UsuariosService,
    private notiServ: NotificacionesService
  ) {
    //this.initializeApp()
  }
  ngOnInit() {

  }


  logout() {
    localStorage.setItem("userLogin", "")
    //alert(localStorage.getItem("userLogin"))
    this.ctrl.enable(false);
    this.authService.logout();
  }
  async initializeApp() {
    // const { SplashScreen, StatusBar} = Plugins;
    try {
      SplashScreen.show({
        showDuration: 2000,
        autoHide: true
      });
      // Display content under transparent status bar (Android only)
      StatusBar.setOverlaysWebView({ overlay: true });

      const setStatusBarStyleDark = async () => {
        await StatusBar.setStyle({ style: Style.Dark });
      };
      if (this.platform.is('android')) {
        StatusBar.setBackgroundColor({ color: '#CDCDCD' })
      }
    } catch (error) {
      alert('error al inicializar' + error)
    }
  }

}


