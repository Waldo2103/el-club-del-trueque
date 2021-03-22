import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Inicio', url: '/home', icon: 'home' },
    { title: 'Perfil', url: '/folder/Perfil', icon: 'person' },
    { title: 'Mis Trueques', url: '/folder/Mis Trueques', icon: 'repeat' },
    { title: 'Mensajes', url: '/folder/Mensajes', icon: 'mail' },
    { title: 'Mi Album', url: '/folder/Mi Album', icon: 'book' }/*,
    { title: 'Favoritos', url: '/folder/Favoritos', icon: 'heart' },
    { title: 'Historial', url: '/folder/Spam', icon: 'time' },*/
  ];
  //public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor() {}
}
