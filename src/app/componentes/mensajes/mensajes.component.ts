import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MensajesService, mensaje } from 'src/app/servicios/mensajes/mensajes.service';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { ModalController } from '@ionic/angular';
import { ChatComponent } from '../chat/chat.component';
import { AngularFireAuth } from '@angular/fire/auth';
import { UsuariosService } from 'src/app/servicios/usuarios/usuarios.service';


@Component({
  selector: 'app-mensajes',
  templateUrl: './mensajes.component.html',
  styleUrls: ['./mensajes.component.scss'],
})
export class MensajesComponent implements OnInit {

  public mensajes: any = [];
  public mensajesBis: any = [];
  public userLogin: string;
  public usuario;
  public noHayChat:boolean = false;
  constructor(
    private mensServ: MensajesService,
    private modal: ModalController,
    private AFauth: AngularFireAuth,
    private userServ: UsuariosService
  ) { }

  ngOnInit() {
    this.traerUserLogin();
  }
  traerUserLogin() {
    this.AFauth.authState.subscribe(async res => {
      this.userLogin = res.email
      let uns = await this.mensServ.getMensajeXUsuario(this.userLogin).subscribe(mensajes => {
        this.mensajes = []
        this.mensajes = mensajes
        this.userServ.getUsuario(this.userLogin).subscribe(pro => {
          this.usuario = []
          this.usuario = pro;
          this.validacionChat();
          uns.unsubscribe()
        })
      });

    });

  }

  //seleccionador de chat - segun el usuario logueado elige los valores del otro integrande del chat
  //para asignar que foto mostrar que nombre pone al chat etc
  async validacionChat() {
    this.mensajesBis = [];
    let i = 0;
    if (this.mensajes !== undefined) {
      await this.mensajes.forEach(mensaje => {

        console.log(mensaje.id + " - " + this.userLogin + " i: " + i)
        if (mensaje.id[0] === this.userLogin) {
          this.mensajesBis.push({
            id: mensaje.id[0],
            descripcion: mensaje.descripcion,
            nombre: mensaje.nombre[1],
            imagen: mensaje.imagen[1],
            messages: mensaje.messages,
            uid: mensaje.uid,
            ult: mensaje.messages[mensaje.messages.length - 1]
          })
        } else if (mensaje.id[1] === this.userLogin) {
          this.mensajesBis.push({
            id: mensaje.id[1],
            descripcion: mensaje.descripcion,
            nombre: mensaje.nombre[0],
            imagen: mensaje.imagen[0],
            messages: mensaje.messages,
            uid: mensaje.uid,
            ult: mensaje.messages[mensaje.messages.length - 1]
          })
        }
        i++;
      });
    }else {
      this.noHayChat = true;
    }

  }


  async openChat(chat) {
    const modal = await this.modal.create({
      component: ChatComponent,
      componentProps: {
        chat: chat
      }
    });
      await modal.present()
      const data = await modal.onWillDismiss().then(res =>{
        this.traerUserLogin();
      })
  }

}
