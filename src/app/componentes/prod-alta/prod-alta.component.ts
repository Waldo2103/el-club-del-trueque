import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ModalController, NavParams } from '@ionic/angular';

import { ImagePicker, ImagePickerOptions } from "@ionic-native/image-picker/ngx";
import { File } from "@ionic-native/file/ngx";
import { FormBuilder, FormControl, Validators, FormGroup, FormArray } from '@angular/forms';
import { album, AlbumesService } from 'src/app/servicios/albumes/albumes.service';
import { producto, ProductosService } from 'src/app/servicios/productos/productos.service';
import { StorageService } from 'src/app/servicios/storage/storage.service';

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
  fotosASub: any = [];
  public vModo;
  fotos: any = [];
  nombre: string[];
  descripcion: string[];
  etiquetas: string[];
  form: FormGroup;
  public album: album;
  public troque: producto;
  public arrayTroque:Array<producto>;
  public user;
  public URLs = []
  constructor(
    private modal: ModalController,
    private camera: Camera,
    private navParams: NavParams,
    public iPicker: ImagePicker,
    public file: File,
    public storageServ: StorageService,
    private fBuilder: FormBuilder,
    private albServ:AlbumesService,
    private prodServ: ProductosService

  ) {
    
  }

  /**PARA SUBIR ARCHIVO */
  public mensajeArchivo = 'No hay un archivo seleccionado';
  public datosFormulario = new FormData();
  public arrayFotos = [];
  public nombreArchivo = '';
  public URLPublica = '';
  public porcentaje = 0;
  public finalizado = false;
  
  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem("userLogin"));
    this.modoEntrada();
    this.form = this.fBuilder.group({
      descripcionA: [''],
      id: new FormControl('', Validators.required),
      imagen: new FormControl('', Validators.required),
      nombreA: new FormControl('', Validators.required),
      owner: new FormControl('', Validators.required),
      troques: this.fBuilder.array([])
    })
  }
  get getDatos() {
    //console.log(this.form.get('troques') as FormArray)
    return this.form.get('troques') as FormArray;
  }


  async altaTroque() {

    this.arrayTroque = [];
    
    let  f = this.form.value
    let fTroque = f.troques
     //= this.form.value;
     this.album = {
      nombre: f.nombreA,
      descripcion: f.descripcionA,
      id: this.user.correo+"-"+f.nombreA,
      imagen: "this.URLs[0]",//CUANDO SE ELIMINE UN PRODUCTO DEL ALBUM HAY QUE ACTUALIZAR QUE LA PRIMERA SIGA EXISTIENDO O ACTUALIZAR
      owner: this.user.correo,
      //uid: ,
    }
    var cont = 0
    for(let p of fTroque){
      
      //alert( this.URLs[cont])
      this.troque = {
      //id: f.
      nombre: p.nombre,
      descripcion: p.descripcion,
      etiquetas: p.etiquetas,
      owner: this.user.correo,
      imagen: "",
      album : this.user.correo+"-"+f.nombreA
    }
    this.arrayTroque.push(this.troque);
    await this.subirArchivo(cont, this.troque)
    cont++
    }
    
    console.log("form:",fTroque,"Album: ",this.album,"Prod: ",this.arrayTroque)
    this.albServ.createAlbum(this.album).then(resp=>{
      this.closeAlbum()
    })
    
  }

  addTroque(cant: number) {
    const control = this.form.controls['troques'] as FormArray;
    //alert(cant+" cant")
    for (let i = 0; i < cant; i++) {
      control.push(this.fBuilder.group({
        nombre:["", new FormControl( Validators.required)],
          descripcion:["", new FormControl( Validators.required)],
          etiquetas: []
      }))
      
    }
  }

  removeTroque(index: number) {
    const control = <FormArray>this.form.controls['troques'];
    control.removeAt(index)
    //
    if ( index !== -1 ) {
      this.fotos.splice( index, 1 );
      this.fotosASub.splice( index, 1 );
    }
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
      this.fotosASub.push(imageData);
    }, (err) => {
      // Handle error
      alert(err)
    });
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
        this.fotosASub.push(res[index]);
        let filename = res[index].substring(res[index].lastIndexOf('/') + 1);
        let path = res[index].substring(0, res[index].lastIndexOf('/') + 1);
        this.file.readAsDataURL(path, filename).then(base64string => {
        })
      }
    }, (err) => {
      alert("hay algo mal que no anda bien con estas fotos" + (JSON.stringify(err)))
    });
  }
  
   //Evento que se gatilla cuando el input de tipo archivo cambia
   public cambioArchivo(event) {
    if (event.target.files.length > 0) {
      for (let i = 0; i < event.target.files.length; i++) {
        this.mensajeArchivo = `Archivo preparado: ${event.target.files[i].name}`;
        this.nombreArchivo = event.target.files[i].name;
        //this.datosFormulario.delete('archivo');
        this.datosFormulario.append('archivo', event.target.files[i], event.target.files[i].name)
      }
    } else {
      this.mensajeArchivo = 'No hay un archivo seleccionado';
    }
  }

  //Sube el archivo a Cloud Storage
  public subirArchivo(cont, troque) {
    let f;
    var fe = new Date();
    var fec: string = fe.getDate()+"-"+fe.getMonth()+"-"+fe.getUTCFullYear()+"_"+fe.getUTCHours()+fe.getUTCMinutes();
    //for(let f of this.fotosASub){
      for (let i = 0; i < this.fotosASub.length; i++) {
        if (i===cont) {
          f = this.fotosASub[i]
        }
      }
      //alert(JSON.stringify(this.fotosASub))
      //f = (f as string).split(',', 2)[1];
      this.nombreArchivo =`${this.album.id.replace( '@', '-' ).toLowerCase()}_${cont}_${fec}+.jpg`
      //let archivo = this.datosFormulario.get('archivo');
      var referencia = this.storageServ.referenciaCloudStorage(this.nombreArchivo);
      var tarea = this.storageServ.tareaCloudStorage(this.nombreArchivo, f);
       //Cambia el porcentaje
      tarea.percentageChanges().subscribe((porcentaje) => {
        this.porcentaje = Math.round(porcentaje);
        if (this.porcentaje == 100) {
          this.finalizado = true;
        }
      });

      referencia.putString(f, 'base64', { contentType: 'image/jpeg' }).then(async (snapshot) => {
        alert(troque)
        troque.imagen = await snapshot.ref.getDownloadURL()
        if (cont==0) {
          this.album.imagen = await snapshot.ref.getDownloadURL()
        }
        this.prodServ.createProducto(troque);
        
      }
        
      ) 
    
   
  }
  closeAlbum(){
    this.modal.dismiss()
  }
}





