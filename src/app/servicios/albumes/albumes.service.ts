import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Producto } from 'src/app/clases/producto/producto';

export interface album {
  nombre: string
  descripcion: string
  id: string
  imagen: string
  owner: string
  uid?: string
}

@Injectable({
  providedIn: 'root'
})
export class AlbumesService {

  constructor(private db: AngularFirestore) { }

  createAlbum(data: album){
    return this.db.collection('albumes').add(data);
  }

  getAlbumesXUsuario(id){    
    
    return this.db.collection('albumes', ref => ref.where("owner", "==", id)).snapshotChanges().pipe( map(albumes=>{
      //console.log("alb.length: "+albumes.length)
      
      return albumes.map(a =>{
        //console.log("en serv albxuser"+albumes)
        const data = a.payload.doc.data() as album;
        data.uid = a.payload.doc.id;
        return data;
      })
    
      
    }));
    /* const promises = id.map(u => this.db.collection("mensajes").doc(u).snapshotChanges().pipe( map(chats=>{
      console.log("getMensajes"+ chats)
    }))); */
    }

    //Trae los productos que tienen el idAlbum de un album especifico
    getAlbum(idAlbum){
      return this.db.collection('productos', ref => ref.where("album", "==", idAlbum)).snapshotChanges().pipe(map(productos =>{
        //console.log("servi"+JSON.stringify(productos))
        return productos.map(a =>{
          const data = a.payload.doc.data() as Producto;
          data.id = a.payload.doc.id;
          return data;
        })
      }))
    }
}
