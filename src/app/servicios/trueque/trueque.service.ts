import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { producto } from '../productos/productos.service';
export interface trueque {
  id: Array<string>
  comprador: producto
  vendedor: producto
  estado: estado //pendiente confirmado cancelado finalizado
  uid?: string
}

export interface estado {
  trueque: string
  comprador:string //confirmado, rechazado, contraoferta
  vendedor: string //confirmado, rechazado, contraoferta
   
}

@Injectable({
  providedIn: 'root'
})
export class TruequeService {
  constructor(private db: AngularFirestore) { }

  createTrueque(data: trueque){
    return this.db.collection('trueques').add(data);
  }
  getTrueques(){
    return this.db.collection('trueques').snapshotChanges().pipe(map(products=>{
      return products.map(a =>{
        const data = a.payload.doc.data() as trueque;
        data.uid = a.payload.doc.id;
        return data;
      })
    }));
  }

  getTrueque(id:string){
    return this.db.collection('trueques').doc(id).valueChanges()
  }

  getTruequesXOwner(owner){
    return this.db.collection('trueques', ref => ref.where("id", "array-contains", owner)).snapshotChanges().pipe(map(trueques =>{
      //console.log("servi"+JSON.stringify(trueques))
      return trueques.map(a =>{
        const data = a.payload.doc.data() as trueque;
        data.uid = a.payload.doc.id;
        return data;
      })
    }))
  }

  updateTrueque(trueque){
    return this.db.collection('trueques').doc(trueque.uid).update({'estado.trueque':trueque.trueque, 'estado.comprador':trueque.comprador, 'estado.vendedor':trueque.vendedor, 'comprador':trueque.compradorT})
  }
}
