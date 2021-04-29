import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

export interface producto {
  id?: string
  nombre: string
  descripcion: string 
  etiquetas: string
  zona?: string
  owner:string
  imagen: string
  album: string
}

@Injectable({
  providedIn: 'root'
})

export class ProductosService {

  constructor(private db: AngularFirestore) { }

  createProducto(data: producto){
    return this.db.collection('productos').add(data);
  }
  getProductos(){
    return this.db.collection('productos').snapshotChanges().pipe(map(products=>{
      return products.map(a =>{
        const data = a.payload.doc.data() as producto;
        data.id = a.payload.doc.id;
        return data;
      })
    }));
  }

  getProducto(id:string){
    return this.db.collection('productos').doc(id).valueChanges()
  }

  getProductosXOwner(owner){
    return this.db.collection('productos', ref => ref.where("owner", "==", owner)).snapshotChanges().pipe(map(productos =>{
      //console.log("servi"+JSON.stringify(productos))
      return productos.map(a =>{
        const data = a.payload.doc.data() as producto;
        data.id = a.payload.doc.id;
        return data;
      })
    }))
  }
}
