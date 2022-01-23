import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';

import {
  LocalNotifications,
  LocalNotificationSchema
} from '@capacitor/local-notifications';

import { Platform } from '@ionic/angular';
import { AuthService } from '../auth.service';
import { FirebaseService } from '../firebase.service';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService  {
  public email:string = "";
  constructor(
    private platform: Platform,
    private router: Router,
    public firebaseAuthState: AuthService,
    private fbServ: FirebaseService
    //private userServ: UsuariosService
    ) { 
      this.stateUser();
      }
  stateUser(){
    this.firebaseAuthState.stateAuth().subscribe(res =>{
      //console.log("res notiserv",res.email);
      this.email = res.email;
      if (res != null) {
        if(this.platform.is("capacitor")){
          this.inicializar();
        }
      }
    });
  }
  
  local(){
    LocalNotifications.schedule({
      notifications:[
        {
          title: "noti local luli",
          body: "noti local luli body",
          id: 1
        }
      ]
    })
  }
  async guardarToken(token: any){
    const uid = await this.firebaseAuthState.getUid();
    if (uid) {
      console.log("guardar token en la base->",uid);
      const path = '/usuarios/';
      const userUpdate = {
        token: token
      };
      if (this.email !== "") {
        this.fbServ.updateDoc(userUpdate, path, this.email);
      }

    }
  }

  inicializar() {
      
      console.log('Iniciado Servicio de Notif');
      
      
      // Request permission to use push notifications
      // iOS will prompt user and return if they granted permission or not
      // Android will just grant without prompting
      PushNotifications.requestPermissions().then(result => {
        console.log("pido permisos")
        if (result.receive === 'granted') {
          // Register with Apple / Google to receive push via APNS/FCM
          PushNotifications.register();
          this.local();//esta es la prueba para que llegue una noti local
          console.log("permisos aceptados")
        } else {
          // Show some error
          console.log("permisos rechazados")
        }
      }).catch(e=>{
        console.log("error al pedir permisos"+e)
      });
      
      // On success, we should be able to receive notifications
      PushNotifications.addListener('registration',
      (token: Token) => {
        console.log('Push registration success, token: ' + token.value);
        this.guardarToken(token.value);
      }
      );
      
      // Some issue with our setup and push will not work
      PushNotifications.addListener('registrationError',
      (error: any) => {
        console.log('Error on registration: ' + JSON.stringify(error));
      }
      );
      
      // Show us the notification payload if the app is open on our device - PRIMER PLANO
      PushNotifications.addListener('pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        console.log('Push received EN PRIMER PLANO: ' + JSON.stringify(notification));
        LocalNotifications.schedule({
          notifications:[
            {
              title: notification.title,
              body: notification.body,
              id: parseInt(notification.id),
              /* extra:{
                data: notification.data
              } */
            }
          ]
        })
      }
      );
      
      // Al hacer click en notiPush que hacer | SEGUNDO PLANO
      PushNotifications.addListener('pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        console.log('Push action performed: ' + JSON.stringify(notification.notification.data));
        this.router.navigate([notification.notification.data.ruta])//aca tiene que ir una variable
      }
    );
    // Al hacer click en notiPush que hacer | SEGUNDO PLANO
   /*  LocalNotifications.addListener('localNotificationActionPerformed',
      (notification: LocalNotificationActionPerformed) => {
        this.router.navigate(['/folder/Mensajes'])//aca tiene que ir una variable
      }
    ); */
  
  }
}
