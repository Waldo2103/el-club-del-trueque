import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

export interface usuario{
  id: string
  nombre: string
  apellido: string
  correo: string
  foto: string
}
@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  constructor(private db: AngularFirestore) { }

  createUsuarios(data: usuario){
    return this.db.collection('usuarios').add(data);
  }
  getUsuarios(){
    return this.db.collection('usuarios').snapshotChanges().pipe(map(products=>{
      return products.map(a =>{
        const data = a.payload.doc.data() as usuario;
        data.id = a.payload.doc.id;
        return data;
      })
    }));
  }

  getUsuario(id:string){
    return this.db.collection('usuarios').doc(id).valueChanges()
  }


}
