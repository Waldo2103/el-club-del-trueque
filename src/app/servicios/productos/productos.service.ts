import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

export interface producto {
  id?: string
  nombre: string
  descripcion: string 
  etiquetas: string
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
}
