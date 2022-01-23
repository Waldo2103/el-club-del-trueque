import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import firebase from 'firebase/app';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(
    public db: AngularFirestore,
    public storage: AngularFireStorage
  ) { }
  createDoc(path: string, data: object) {
    return this.db.collection(path).add(data).then(res => {
      console.log(res.id);
      return res.id;
    });
  }
  getDoc(path: string) {
    //Generico
    /* const collection = this.db.collection(path);
    return collection.valueChanges(); */
    return this.db.collection(path).snapshotChanges().pipe(map(documentos => {
      console.log("entre en serv getDoc", documentos)
      return documentos.map(d => {
        const data = d.payload.doc.data() as any;
        data.uid = d.payload.doc.id;
        return data;
      })
    }))
  }
  updateDoc(data: any, path: string, id: string) {
    const collection = this.db.collection(path);
    return collection.doc(id).update(data);
  }
  updateField(field: string, data: any, path: string, id: string, action: string) {
    const collection = this.db.collection(path);
    //console.log(field, data, path, id, action)
    switch (path && field && action) {

      case 'usuarios' && 'grupos' && 'A':
        return collection.doc(id).update(
          {
            cantGrupos: firebase.firestore.FieldValue.increment(1),
            grupos: firebase.firestore.FieldValue.arrayUnion(data)
          }
        );
        break;
      case 'usuarios' && 'grupos' && 'B':
        //console.log('entre en el case B |||| ', data)
        return collection.doc(id).update(
          {
            cantGrupos: firebase.firestore.FieldValue.increment(-1),
            grupos: firebase.firestore.FieldValue.arrayRemove(data)
          }
        );
        break;
      default:
        break;
    }

  }

  public deleteDoc(id: string, path: string) {
    const collection = this.db.collection(path);
    return collection.doc(id).delete();
  }
  getDocWhere(path: string, clave: string, condicion: any, valor: any) {
    return this.db.collection(path, ref => ref.where(clave, condicion, valor)).snapshotChanges().pipe(map(documentos => {
      console.log("entre en serv getDocWhere", documentos)
      return documentos.map(d => {
        const data = d.payload.doc.data() as any;
        data.uid = d.payload.doc.id;
        return data;
      })
    }))
  }
  getDocId<tipo>(path: string, id: string) {
    const collection = this.db.collection(path);
    return collection.doc(id).valueChanges();
  }
  //Tarea para subir archivo
  tareaCloudStorage(nombreArchivo: string, datos: any) {
    return this.storage.upload(nombreArchivo, datos);
  }

  //Referencia del archivo
  referenciaCloudStorage(nombreArchivo: string) {
    return this.storage.ref(nombreArchivo);
  }
  //Eliminar archivo
  public deleteArchivo(nombreArchivo: string) {
    return this.storage.ref(nombreArchivo).delete().subscribe(resp => {
      alert(resp)
    });
  }

}
