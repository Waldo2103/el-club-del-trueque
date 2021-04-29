import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';

import { delay } from "rxjs/operators";
import { Producto } from 'src/app/clases/producto/producto';


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private firestore: AngularFirestore, private storage: AngularFireStorage) { }

   //Alta
   /* public createProducto(id:string ,data: {id: string, nombre: string, tipo: string, domicilio: string, responsable: string, telefono: string, productos: string, zonas: string, rutaDeFoto: string}) {
    return this.firestore.collection('productos').doc(id).set(data);
  } 
  //Trae 1
  public getProducto(documentId: string) {
    return this.firestore.collection('productos').doc(documentId).snapshotChanges();
  }
  //Trae Todos
  public getProductos() {
    //console.log("entre a servicio", this.firestore.collection('productos').snapshotChanges())
    return this.firestore.collection<Producto>('productos').snapshotChanges()
              .pipe(
                delay(2000)
              );
  }

  //Actualiza 1
  public updateProducto(documentId: string, data: any) {
    return this.firestore.collection('productos').doc(documentId).set(data);
  }

  // Borra 1
  public deleteProducto(documentId: string) {
    console.log(documentId);
    return this.firestore.collection('productos').doc(documentId).delete();
  }*/

   //Tarea para subir archivo
  public tareaCloudStorage(nombreArchivo: string, datos: any) {
    return this.storage.upload(nombreArchivo, datos);
  }

  //Referencia del archivo
  public referenciaCloudStorage(nombreArchivo: string) {
    return this.storage.ref(nombreArchivo);
  }

  //Eliminar archivo
  public deleteArchivo(nombreArchivo: string){
    return this.storage.ref(nombreArchivo).delete().subscribe(resp =>{
      alert(resp)
    });
  }
  

}
