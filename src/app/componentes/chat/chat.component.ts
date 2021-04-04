import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { NavParams, ModalController } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { MensajesService } from 'src/app/servicios/mensajes/mensajes.service';
import { message } from "../../models/message"; 



@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {

  public chat: any;
  public mensajes = [];
  //public message: message;
  public room: any;
  public mens: string;
  public userLogin: string;
  public owner: boolean;
  constructor(
    private navParams: NavParams,
    private modal: ModalController,
    private mensService: MensajesService,
    private AFauth: AngularFireAuth
  ) { }

  ngOnInit() {
    this.AFauth.authState.subscribe(res =>{
      this.userLogin = res.email
      //console.log(user)
    });
    this.chat = this.navParams.get('chat')
    //console.log(this.chat)
    this.mensService.getMensaje(this.chat.uid).subscribe( room =>{
      this.room = room;
      console.log(room)
    })
    
  }

  closeChat(){
    this.modal.dismiss()
  }

  sendMessage(){
    const mensaje: message = {
      content: this.mens,
      date: new Date(),
      type: "text",
      owner: this.userLogin
    }
    this.mensService.sendMsgToFirebase(mensaje , this.chat.uid)
    this.mens = "";
  }

}
