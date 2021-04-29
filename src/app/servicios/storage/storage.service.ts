import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(
    private storage: AngularFireStorage
  ) { }


  //Tarea para subir archivo
  tareaCloudStorage(nombreArchivo: string, datos: any) {
    return this.storage.upload(nombreArchivo, datos);
  }

  //Referencia del archivo
  referenciaCloudStorage(nombreArchivo: string) {
    return this.storage.ref(nombreArchivo);
  }
  //Eliminar archivo
  public deleteArchivo(nombreArchivo: string){
    return this.storage.ref(nombreArchivo).delete().subscribe(resp =>{
      alert(resp)
    });
  }
}
