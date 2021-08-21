import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

export interface usuario{
  apodo: string
  nombre: string
  descripcion: string
  apellido: string
  correo: string
  foto?: string
  zona: string
}
@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  constructor(
    private db: AngularFirestore,
    private AFauth: AngularFireAuth
    ) {
      this.getUid()
      this.stateAuth()
     }

    async getUid(){
      const user = await this.AFauth.currentUser;
      if (user === null) {
        return null;
      } else {
        return user.uid;
      }
      /* this.AFauth.authState.subscribe(res=>{
        return res.email;
      }) */
    }

    stateAuth(){
      return this.AFauth.authState
    }

  createUsuarios(data: usuario){
    return this.db.collection('usuarios').add(data);
  }
  getUsuarios(){
    return this.db.collection('usuarios').snapshotChanges().pipe(map(products=>{
      return products.map(a =>{
        const data = a.payload.doc.data() as usuario;
        //data.id = a.payload.doc.id;
        return data;
      })
    }));
  }

  getUsuario(id:string){
    //console.log()
    return this.db.collection('usuarios').doc(id).valueChanges()
  }

  updateUsuario(datos: usuario){
    return this.db.collection('usuarios').doc(datos.correo).set(datos);
  }

  setToken(userUpdate, uid){
    return this.db.collection('usuarios').doc(uid).update(userUpdate);
  }

}
