import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { NavParams } from '@ionic/angular';

import { ImagePicker, ImagePickerOptions } from "@ionic-native/image-picker/ngx";
import { File } from "@ionic-native/file/ngx";
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormControl, Validators, FormGroup, FormArray } from '@angular/forms';
import { album, AlbumesService } from 'src/app/servicios/albumes/albumes.service';
import { producto, ProductosService } from 'src/app/servicios/productos/productos.service';

export interface Foto {
  nombre: string[]
  descripcion: string[]
  etiquetas: string[]
}


@Component({
  selector: 'app-prod-alta',
  templateUrl: './prod-alta.component.html',
  styleUrls: ['./prod-alta.component.scss'],
})
export class ProdAltaComponent implements OnInit {

  public prod;
  public photo;
  public vModo;
  fotos: any = [""];
  nombre: string[];
  descripcion: string[];
  etiquetas: string[];
  form: FormGroup;
  public album: album;
  public troque: producto;
  public arrayTroque:Array<producto>;
  public user;
  constructor(
    private camera: Camera,
    private navParams: NavParams,
    public iPicker: ImagePicker,
    public file: File,
    public storage: AngularFireStorage,
    private fBuilder: FormBuilder,
    private albServ:AlbumesService,
    private prodServ: ProductosService

  ) {
    /* this.form = this.fBuilder.group({

    }) */
  }

  /**PARA SUBIR ARCHIVO */
  public mensajeArchivo = 'No hay un archivo seleccionado';
  public datosFormulario = new FormData();
  public nombreArchivo = '';
  public URLPublica = '';
  public porcentaje = 0;
  public finalizado = false;
  
  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem("userLogin"));
    this.modoEntrada();
    this.form = this.fBuilder.group({
      descripcionA: [''],
      id: ['',Validators.required],
      imagen: ['',Validators.required],
      nombreA: ['',Validators.required],
      owner: ['',Validators.required],
      troques: this.fBuilder.array([this.fBuilder.group(
        {
          nombre: [Validators.required],
          descripcion: [Validators.required],
          etiquetas: []
        }
      )])
    })
    //this.fotos = new Array<string>();
  }
  get getDatos() {
    //console.log(this.form.get('troques') as FormArray)
    return this.form.get('troques') as FormArray;
  }

  public altaAlbum() {
    this.album = {
      nombre: '',
      descripcion: '',
      id: '',
      imagen: '',
      owner: '',
      uid: '',
    }
  }

  altaTroque() {
    this.arrayTroque = [];
    
    let  f = this.form.value
    let fTroque = f.troques
    this.album = {
      nombre: f.nombreA,
      descripcion: f.descripcionA,
      id: this.user.correo+"-"+f.nombreA,
      imagen: this.fotos[0],//f.troques[0].nombre,
      owner: this.user.correo,
      //uid: ,
    } //= this.form.value;

    for(let p of fTroque){
      this.troque = {
      //id: f.
      nombre: p.nombre,
      descripcion: p.descripcion,
      etiquetas: p.etiquetas,
      owner: this.user.correo,
      imagen: this.fotos[p],
      album : this.user.correo+"-"+f.nombreA
    }
    this.arrayTroque.push(this.troque);
    }
    
    console.log("form:",fTroque,"Album: ",this.album,"Prod: ",this.arrayTroque)
    //this.albServ.createAlbum(this.album);
    //this.prodServ.createProducto(this.prod);
  }

  addTroque(cant: number) {
    const control = this.form.controls['troques'] as FormArray;
    //console.log(control);
    for (let i = 0; i < cant; i++) {
      control.push(this.fBuilder.group({
        nombre: [],
        descripcion: [],
        etiquetas: []
      }))
      
    }
  }

  removeTroque(index: number) {
    const control = <FormArray>this.form.controls['troques'];
    control.removeAt(index)
    
  }

  public modoEntrada() {
    this.prod = this.navParams.get('prod');
    this.vModo = this.navParams.get('modo');
    if (this.vModo === "camera") {
      this.abrirCamara()
    } else if (this.vModo === "gallery") {
      this.abrirGaleria()
    } else {
      alert("fallo abrir camara o galeria")
    }
  }

  abrirCamara() {
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
      
      this.addTroque(1)
    }, (err) => {
      // Handle error
      alert(err)
    });
  }

  subir() {
    for (let foto of this.fotos) {
      //foto.
      //this.referenciaCloudStorage(nombreArchivo)
      //this.tareaCloudStorage(nombreArchivo, datos)
    }
  }

  abrirGaleria() {

    const options2: ImagePickerOptions = {
      quality: 70,
      allow_video: false,
      outputType: 1
    }
    this.iPicker.getPictures(options2).then(res => {
      alert(res.length)
      this.addTroque(res.length)
      for (var index = 0; index < res.length; index++) {
        this.fotos.push(('data:image/jpeg;base64,' + res[index]));
        
        let filename = res[index].substring(res[index].lastIndexOf('/') + 1);
        let path = res[index].substring(0, res[index].lastIndexOf('/') + 1);
        this.file.readAsDataURL(path, filename).then(base64string => {
        })
      }
    }, (err) => {
      alert("hay algo mal que no anda bien con estas fotos" + (JSON.stringify(err)))
    });
  }
  //Tarea para subir archivo
  tareaCloudStorage(nombreArchivo: string, datos: any) {
    return this.storage.upload(nombreArchivo, datos);
  }

  //Referencia del archivo
  referenciaCloudStorage(nombreArchivo: string) {
    return this.storage.ref(nombreArchivo);
  }

}





