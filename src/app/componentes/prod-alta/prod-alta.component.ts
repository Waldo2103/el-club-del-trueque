import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ModalController, NavParams } from '@ionic/angular';

import { ImagePicker, ImagePickerOptions } from "@ionic-native/image-picker/ngx";
import { File } from "@ionic-native/file/ngx";
import { FormBuilder, FormControl, Validators, FormGroup, FormArray } from '@angular/forms';
import { album, AlbumesService } from 'src/app/servicios/albumes/albumes.service';
import { producto, ProductosService } from 'src/app/servicios/productos/productos.service';
import { StorageService } from 'src/app/servicios/storage/storage.service';

@Component({
  selector: 'app-prod-alta',
  templateUrl: './prod-alta.component.html',
  styleUrls: ['./prod-alta.component.scss'],
})
export class ProdAltaComponent implements OnInit {

  fotosASub: any = [];//se guardan las fotos en el formato de subida a firebase
  public vModo;//guarda si se abre camara o galeria al crear el component
  fotos: any = [];//se guardan las fotos en formato de listado
  form: FormGroup;
  public album: album;//se guarda el album que se creará
  public troque: producto;//se guarda 1 troque que se creara
  public user;//guardo los datos del usuario logueado
  //public mostrarForm: boolean = false; //esto es para que no muestre el formulario si aun no se cargo una foto
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
  public nombreArchivo = '';
  public porcentaje = 0;
  public finalizado = false;
  
  ngOnInit() {
    //traigo el usuario logueado con su info
    this.user = JSON.parse(localStorage.getItem("userLogin"));
    //camara o galeria
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
    return this.form.get('troques') as FormArray;
  }


  async altaTroque() {
    let  f = this.form.value
    let fTroque = f.troques
     this.album = {
      nombre: f.nombreA,
      descripcion: f.descripcionA,
      id: this.user.correo+"-"+f.nombreA,
      imagen: "falta guardar la foto",//(!)CUANDO SE ELIMINE UN PRODUCTO DEL ALBUM HAY QUE ACTUALIZAR QUE LA PRIMERA SIGA EXISTIENDO O ACTUALIZAR
      owner: this.user.correo,
    }
    var cont = 0
    for(let p of fTroque){
      
      this.troque = {
      nombre: p.nombre,
      descripcion: p.descripcion,
      etiquetas: p.etiquetas,
      owner: this.user.correo,
      imagen: "",
      album : this.user.correo+"-"+f.nombreA
    }
    await this.subirArchivo(cont, this.troque)
    cont++
    }
    
    
    
  }
//agrega un formulario de Troque
  addTroque(cant: number) {
    //this.mostrarForm = true;
    const control = this.form.controls['troques'] as FormArray;
    for (let i = 0; i < cant; i++) {
      control.push(this.fBuilder.group({
        nombre: ["", new FormControl( Validators.required)],
          descripcion: ["", new FormControl( Validators.required)],
          etiquetas: []
      }))
    }
  }

  removeTroque(index: number) {
    const control = <FormArray>this.form.controls['troques'];
    control.removeAt(index)
    if ( index !== -1 ) {
      this.fotos.splice( index, 1 );
      this.fotosASub.splice( index, 1 );
    }
  }

  public modoEntrada() {
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
      //si tiro error no entro a form
      this.modal.dismiss()
    });
  }
//Abre la galeria para seleccionar fotos
  abrirGaleria() {

    const options2: ImagePickerOptions = {
      quality: 70,
      allow_video: false,
      outputType: 1
    }
    this.iPicker.getPictures(options2).then((res) => {
      //agrego un nuevo formulario de troque
      if (res!=="OK") {//le puse esto porque me paso que devolvia esto a veces al iniar
        this.addTroque(res.length)
      
      for (var index = 0; index < res.length; index++) {
        this.fotos.push(('data:image/jpeg;base64,' + res[index]));
        this.fotosASub.push(res[index]);
        alert(JSON.stringify(this.fotos))
      }
    }else{
      this.abrirGaleria()
    }
    }, (err) => {
      alert("hay algo mal que no anda bien con estas fotos" + (JSON.stringify(err)))
    });
  }
  

  //Sube el archivo a Cloud Storage
  public subirArchivo(cont, troque) {
    let f;
    let cant = cont
    for (let i = 0; i < this.fotosASub.length; i++) {
      if (i===cont) {
        f = this.fotosASub[i]
      }
    }
    //genero el nombre del archivo
    var fe = new Date();
    var fec: string = fe.getDate()+"-"+fe.getMonth()+"-"+fe.getUTCFullYear()+"_"+fe.getUTCHours()+fe.getUTCMinutes();
    //firebase no acepta el arroba entonces lo reemplazo
    this.nombreArchivo =`${this.album.id.replace( '@', '-' ).toLowerCase()}_${cont}_${fec}.jpg`
    var referencia = this.storageServ.referenciaCloudStorage(`productos/${this.nombreArchivo}`);
    var tarea = this.storageServ.tareaCloudStorage(this.nombreArchivo, f);
      //Cambia el porcentaje
    tarea.percentageChanges().subscribe((porcentaje) => {
      this.porcentaje = Math.round(porcentaje);
      if (this.porcentaje == 100) {
        this.finalizado = true;
      }
    });
//tomo la referencia de la imagen y creo un troque
    referencia.putString(f, 'base64', { contentType: 'image/jpeg' }).then(async (snapshot) => {
      troque.imagen = await snapshot.ref.getDownloadURL()
      if (cont==0) {
        this.album.imagen = await snapshot.ref.getDownloadURL()
        this.albServ.createAlbum(this.album)
      }
      this.prodServ.createProducto(troque);
    })
    if ((cant + 1) === this.fotosASub.length) {
      this.closeAlbum()
    }
  }
  closeAlbum(){
    this.modal.dismiss()
  }
}





