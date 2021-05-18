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
  messages?: message
}

@Injectable({
  providedIn: 'root'
})
export class MensajesService {

  constructor(private db: AngularFirestore) { }

  async createMensajes(data:mensaje): Promise<any>{

    const docRef = this.db.collection("mensajes").doc();
    data.uid = docRef.ref.id
    docRef.set(data);
    return data.uid
    return this.db.collection('mensajes').add(data).then(res =>{ 
      return res.id
     })
  }

  getMensajeXUsuario(id){
    return this.db.collection('mensajes', ref => ref.where("id", "array-contains", id)).snapshotChanges().pipe( map(chat=>{
      console.log("chat.length: "+chat.length)
      if (chat.length === 0) {
      let noData: mensaje[]
      return noData
    } else{
      return chat.map(a =>{
        console.log("en serv mesxuser"+chat)
        const data = a.payload.doc.data() as mensaje;
        data.uid = a.payload.doc.id;
        return data;
      })
    }
      
    }));
    }
  

  getMensajes(){
    let users = [];
    return this.getUsers().pipe(
      switchMap(res =>{
        users = res;
        console.log(res)
        return this.db.collection('mensajes', ref => ref.orderBy('messages')).valueChanges({idField:'uid'}) as Observable<mensaje[]>;
      }),
      map(messages =>{
        for(let m of messages){
          m.messages
        }
      })
    );
    /*return this.db.collection('mensajes').snapshotChanges().pipe( map(chats=>{
      //console.log("getMensajes"+ chats)
      
      return chats.map(a =>{
        const data = a.payload.doc.data() as mensaje;
        data.uid = a.payload.doc.id;
        
        return data;
      })
    }));*/
  }

  getUsers(){
    return this.db.collection('mensajes').valueChanges(/*{idField:'uid'}*/) as Observable<usuario[]>;
  }

  getMensaje(id:string):Observable<any>{
    console.log("entre a getmens en servic")
    //return this.db.collection<message>('mercados').snapshotChanges().pipe(delay(2000));
    return this.db.collection('mensajes').doc(id).valueChanges()
    //return this.db.collection('mensajes').snapshotChanges().pipe()
  }

  sendMsgToFirebase(message: message, chat_id: string){
    console.log("entre en envio de mensaje")
    this.db.collection('mensajes').doc(chat_id).update({
      messages: firebase.default.firestore.FieldValue.arrayUnion(message)
    })
  }
}
