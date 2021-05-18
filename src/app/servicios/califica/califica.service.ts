import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import * as firebase from 'firebase/app';

export interface califica {
  usuario: string //calificador
  uid: string //va a ser el calificado
  estrellas: number 
  comentario?: string
}

@Injectable({
  providedIn: 'root'
})
export class CalificaService {

  constructor(private db: AngularFirestore) { }
  createCalificaInicial(uid){//al registrar usuario usa este metodo para inicializar las calificaciones
    return this.db.collection('calificaciones').doc(uid).set({
      calificaciones: {}
    });
  }
  createCalifica(data: califica){//se hace un update porque lo va inyectando en un array
    return this.db.collection('calificaciones').doc(data.uid).update({
      calificaciones: firebase.default.firestore.FieldValue.arrayUnion(data)
    });
  }
  getCalificas(){
    return this.db.collection('calificaciones').snapshotChanges().pipe(map(products=>{
      return products.map(a =>{
        const data = a.payload.doc.data() as califica;
        return data;
      })
    }));
  }

  getCalifica(id:string){
    console.log("entre a get cali " +id)
    return this.db.collection('calificaciones').doc(id).snapshotChanges()
  }

  getCalificasXOwner(owner){
    return this.db.collection('calificaciones').snapshotChanges().pipe(map(calificas =>{
      //console.log("servi"+JSON.stringify(calificas))
      return calificas.map(a =>{
        const data = a.payload.doc.data() as califica;
        data.uid = a.payload.doc.id;
        return data;
      })
    }))
  }
  /* getMensajeXUsuario(id){
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
    } */

  updateCalifica(califica){
    return this.db.collection('calificaciones').doc(califica.uid).update({'estado.califica':califica.califica, 'estado.comprador':califica.comprador, 'estado.vendedor':califica.vendedor, 'comprador':califica.compradorT})
  }
}
