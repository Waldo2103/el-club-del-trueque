import { Injectable } from '@angular/core';

import { AngularFirestore } from "@angular/fire/firestore";

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(
    public db: AngularFirestore
  ) { }

  createDoc(path:string, id:string, data: any){
    const collection = this.db.collection(path);
    return collection.doc(id).set(data);
  }

  getDoc<tipo>(path:string, id: string){
    const collection = this.db.collection<tipo>(path);
    return collection.doc(id).valueChanges();
  }
  getCollection<tipo>(path:string){
    const collection = this.db.collection<tipo>(path);
    return collection.valueChanges();
  }

  deleteDoc(path:string, id: string){
    const collection = this.db.collection(path);
    return collection.doc(id).delete();
  }

  updateDoc(path:string, id:string, data: any){
    const collection = this.db.collection(path);
    return collection.doc(id).update(data);
  }

  getId(){
    return this.db.createId();
  }
}
