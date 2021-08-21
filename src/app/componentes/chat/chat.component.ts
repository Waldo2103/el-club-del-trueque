import { ChangeDetectionStrategy, Component, OnInit, ViewChild, AfterViewChecked } from '@angular/core';
import { IonCard } from "@ionic/angular";

import { AngularFireAuth } from '@angular/fire/auth';
import { NavParams, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { MensajesService } from 'src/app/servicios/mensajes/mensajes.service';
import { message } from "../../models/message"; 
import { FirebaseService } from 'src/app/servicios/firebase.service';



@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class ChatComponent implements OnInit, AfterViewChecked {

  @ViewChild('content') content: any;
  public chat: any;
  public mensajes = [];
  public room: Array<any> = [];
  public mens: string;
  public userLogin: string;
  public owner: boolean;

  public unsubscribe;
  constructor(
    private navParams: NavParams,
    private modal: ModalController,
    private mensService: MensajesService,
    private AFauth: AngularFireAuth,
    private fbServ: FirebaseService
  ) { }

  scrollToBottomOnInit() {
    this.content.scrollToBottom(1000);
  }
  ngAfterViewChecked(){
    this.scrollToBottomOnInit()
  }

  ngOnInit() {
    //
    this.AFauth.authState.subscribe(res =>{
      this.userLogin = res.email
    });
    this.chat = this.navParams.get('chat')
    this.mensService.getMensaje(this.chat.uid).subscribe( (room) =>{
        this.room = room.messages; 
        console.log(room.messages[(room.messages.length - 1)].read, this.userLogin, room.messages[(room.messages.length - 1)].owner)
        if (room.messages[(room.messages.length - 1)].read === false && this.userLogin !== room.messages[(room.messages.length - 1)].owner) {
          this.markAsRead(room);  
        }
           
    })
  }
  

  closeChat(){
    this.modal.dismiss()
  }

  sendMessage(){
    if(this.mens !== ""){
      
    const mensaje: message = {
          content: this.mens,
          date: new Date(),
          type: "text",
          owner: this.userLogin,
          read: false
        }
    this.mensService.sendMsgToFirebase(mensaje , this.chat.uid)
    this.mens = "";
    this.scrollToBottomOnInit()
    }
    //this.scrollToBottomOnInit()
  }
  markAsRead(sala){
    sala.messages[(sala.messages.length - 1)].read = true;
    this.fbServ.updateDoc(sala, '/mensajes/', sala.uid);
  }
  
}
