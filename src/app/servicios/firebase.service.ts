import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(
    public db: AngularFirestore
  ) { }

  updateDoc(data:any, path:string, id:string){
    const collection = this.db.collection(path);
    return collection.doc(id).update(data);
  }
}
