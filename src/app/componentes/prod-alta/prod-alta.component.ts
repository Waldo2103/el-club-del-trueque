import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { NavParams } from '@ionic/angular';

import { ImagePicker, ImagePickerOptions } from "@ionic-native/image-picker/ngx";
import { File } from "@ionic-native/file/ngx";


@Component({
  selector: 'app-prod-alta',
  templateUrl: './prod-alta.component.html',
  styleUrls: ['./prod-alta.component.scss'],
})
export class ProdAltaComponent implements OnInit {

  public prod;
  public photo;
  public vModo;
  fotos: any = [];
  constructor(
    private camera: Camera,
    private navParams: NavParams,
    public iPicker: ImagePicker,
    public file: File
    ) { }

  ngOnInit() {
    this.modoEntrada();
    //this.fotos = new Array<string>();
  }


  public modoEntrada(){
    console.log("entre en modo")
    this.prod = this.navParams.get('prod');
    this.vModo = this.navParams.get('modo');
    if (this.vModo === "camera") {
      this.abrirCamara()
    } else if(this.vModo === "gallery") {
      this.abrirGaleria()
    }else{
      console.log("aaaa")
    }
  }

  abrirCamara(){
    //this.photoService.takePhoto();
     const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.CAMERA
    }
    
    this.camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64 (DATA_URL):
     this.fotos.push(('data:image/jpeg;base64,' + imageData));
     //alert(this.fotos)
     //alert(JSON.stringify(this.photo))
    }, (err) => {
     // Handle error
     alert(err)
    }); 
  }

  subir(){
    /* for (let foto of this.fotos) {
      const filename: string = datos.nombre + '_' + contador;
      const imageRef: AngularFireStorageReference = this.storage.ref(`productos/${filename}.jpg`);
      foto = this.obtenerFotoOriginal(foto);
      await imageRef.putString(foto, 'base64', { contentType: 'image/jpeg' })
        .then(async (snapshot) => {
          datos.fotos.push(await snapshot.ref.getDownloadURL());
          contador++;
        }).catch(() => {
          this.subidaErronea(`Error al subir la foto ${contador}, se canceló el alta.`);
          errores++;
        });
    } */
  }

  abrirGaleria(){
    
    const options2: ImagePickerOptions = {
      quality: 70,
      allow_video: false,
      outputType: 1
    }
    this.iPicker.getPictures(options2).then(res =>{
      alert(res.length)
      
      for (var index = 0; index < res.length; index++) {
        this.fotos.push(('data:image/jpeg;base64,' + res[index]));
        alert("dentro del for cada res"+res[index])
        let filename = res[index].substring(res[index].lastIndexOf('/')+1);
        let path = res[index].substring(0,res[index].lastIndexOf('/')+1);
        this.file.readAsDataURL(path, filename).then(base64string=>{
          //this.fotos.push((base64string));
          alert("entre a abrirgaleria"+base64string)
        })
      }
    }, (err)=>{
      alert("hay algo mal que no anda bien con estas fotos"+(JSON.stringify(err)))
    });
    /* const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    }
    
    this.camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64 (DATA_URL):
     this.photo = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
     // Handle error
     alert(err)
    });  */
  }
 

}


/**
 * 
 * 
   //Tarea para subir archivo
  public tareaCloudStorage(nombreArchivo: string, datos: any) {
    return this.storage.upload(nombreArchivo, datos);
  }

  //Referencia del archivo
  public referenciaCloudStorage(nombreArchivo: string) {
    return this.storage.ref(nombreArchivo);
  }
 */
