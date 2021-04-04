import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { delay, map, switchMap } from 'rxjs/operators';
import { message } from 'src/app/models/message';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { usuario } from '../usuarios/usuarios.service';

export interface mensaje {
  nombre: Array<string>
  descripcion: string
  id: Array<string>
  imagen: Array<string>
  uid: string
  //messages: message
}

@Injectable({
  providedIn: 'root'
})
export class MensajesService {

  constructor(private db: AngularFirestore) { }

  createMensajes(data:mensaje){
    this.db.collection('mensajes').add(data)
  }

  getMensajesXUsuario(uids){
    uids = ['t6XM3zF8dL0zWTdRLIWU', 'klmno...', 'wxyz...'];
    const promises = uids.map(u => this.db.collection("mensajes").doc(u).snapshotChanges().pipe( map(chats=>{
      console.log("getMensajes"+ chats)
    })));
    }
  

  getMensajes(){
    let users = [];
    return this.getUsers().pipe(
      switchMap(res =>{
        users = res;
        return this.db.collection('mensajes', ref => ref.orderBy('messages')).valueChanges({idField:'uid'}) as Observable<mensaje[]>;
      }),
      /*map(messages =>{
        for(let m of messages){
          m.messages
        }
      })*/
    );
    return this.db.collection('mensajes').snapshotChanges().pipe( map(chats=>{
      //console.log("getMensajes"+ chats)
      
      return chats.map(a =>{
        const data = a.payload.doc.data() as mensaje;
        data.uid = a.payload.doc.id;
        
        return data;
      })
    }));
  }

  getUsers(){
    return this.db.collection('mensajes').valueChanges({idField:'correo'}) as Observable<usuario[]>;
  }

  getMensaje(id:string){
    return this.db.collection('mensajes').doc(id).valueChanges()
  }

  sendMsgToFirebase(message: message, chat_id: string){
    this.db.collection('mensajes').doc(chat_id).update({
      messages: firebase.default.firestore.FieldValue.arrayUnion(message)
    })
  }
}
