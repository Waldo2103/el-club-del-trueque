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
  //esta variable guarda los datos del otro participante del chat que son los que se mostraran
  public mensajesBis: any = [];
  public userLogin: string;
  public usuario;
  constructor(
     private mensServ: MensajesService,
     private modal: ModalController,
     private AFauth: AngularFireAuth,
     private userServ: UsuariosService
     ) { }

  ngOnInit() {
    
    this.traerMensajes()
    this.traerUserLogin();
  }

  async traerMensajes(){
  await this.mensServ.getMensajes().subscribe(mensajes =>{
    this.mensajes = []
    this.mensajes = mensajes
    //console.log(this.mensajes)
    });
  }


  traerUserLogin(){
    this.AFauth.authState.subscribe(res =>{
      this.userLogin = res.email
      //console.log("userlogin", this.userLogin)
      this.userServ.getUsuario(this.userLogin).subscribe( pro =>{
        this.usuario = []
        this.usuario = pro;
        //console.log("antes de vali chat", this.usuario)
        this.validacionChat();
        //console.log(pro)
      })
      //this.validacionChat();
    });
    //console.log("userlogin2", this.userLogin)
    
  }

  //seleccionador de chat - segun el usuario logueado elige los valores del otro integrande del chat
  //para asignar que foto mostrar que nombre pone al chat etc
  async validacionChat(){
    this.mensajesBis = [];
    let i = 0;
     await this.mensajes.forEach(mensaje => {
       
      console.log(mensaje.id +" - "+ this.userLogin+" i: "+ i)
      if (mensaje.id[0] === this.userLogin) {
        this.mensajesBis.push({
          id: mensaje.id[0],
          descripcion: mensaje.descripcion,
          nombre: mensaje.nombre[1],
          imagen: mensaje.imagen[1],
          messages: mensaje.messages,
          uid: mensaje.uid
        })
      } else if (mensaje.id[1] === this.userLogin) {
        this.mensajesBis.push({
          id: mensaje.id[1],
          descripcion: mensaje.descripcion,
          nombre: mensaje.nombre[0],
          imagen: mensaje.imagen[0],
          messages: mensaje.messages,
          uid: mensaje.uid
        })
      }
      i++;
    });
  }
  

  openChat(chat){
    //console.log(chat)
    this.modal.create({
      component: ChatComponent,
      componentProps: {
        chat: chat
      }
    }).then((modal)=>modal.present())
  }

}
