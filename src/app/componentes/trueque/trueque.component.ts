import { Component, OnInit } from '@angular/core';
import { ActionSheetController, ModalController, NavParams } from '@ionic/angular';
import { MensajesService } from 'src/app/servicios/mensajes/mensajes.service';
import { StorageService } from 'src/app/servicios/storage/storage.service';
import { UsuariosService } from 'src/app/servicios/usuarios/usuarios.service';
import { ImagePicker, ImagePickerOptions } from "@ionic-native/image-picker/ngx";
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { producto } from 'src/app/servicios/productos/productos.service';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { AlbumesComponent } from '../albumes/albumes.component';
import { ProductoComponent } from '../producto/producto.component';
import { AlbumComponent } from '../album/album.component';



@Component({
  selector: 'app-trueque',
  templateUrl: './trueque.component.html',
  styleUrls: ['./trueque.component.scss'],
})
export class TruequeComponent implements OnInit {

  public estado = "Trueque NO Iniciado";
  public troqueComprador:producto;
  public troqueVendedor:producto;
  public foto;
  public fotoASub;
  public usuarioP;
  public usuarioL;
  public nombreArchivo="";
  public datos;

  public btnContraoferta: boolean = false;
  public troqueAgregado: boolean = false;

  constructor(
    private modal: ModalController,
    public navParams: NavParams,
    private actionSheetController: ActionSheetController,
    private mensServ: MensajesService,
    private userServ: UsuariosService,
    private modalC: ModalController,
    private photoViewer: PhotoViewer,
    private iPicker: ImagePicker,
    private camera: Camera,
    private storageServ: StorageService,

  ) { }

  ngOnInit() {
    this.traerTroques();
    this.traerUsuarios();
  }
  traerUsuarios(){
    this.usuarioL = this.navParams.get("usuarioL");
    this.usuarioP = this.navParams.get("usuarioP");
  }
  traerTroques(){
    this.troqueVendedor = this.navParams.get("troqueV");
    this.troqueComprador = this.navParams.get("troqueC");
  }

  async agregarTroque(){
    /** REVISAR: FALTA AGREGAR QUE BORRE LA QUE YA TIENE DE STORAGE */
    const accSheet = await this.actionSheetController.create({
      header: 'Agrega tu Troque',
      cssClass: 'my-custom-class2',
      buttons: [{
        text: 'Buscar en tus Troques',
        icon: 'images',
        handler: () => {
          this.buscarEnProductos()
          console.log('Share clicked');
        }
      },{
        text: 'Sacar Foto',
        icon: 'camera',
        handler: () => {
          this.abrirCamara()
          console.log('Share clicked');
        }
      }, {
        text: 'Subir desde Galería',
        icon: 'image',
        handler: () => {
          this.abrirGaleria()
          console.log('Play clicked');
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await accSheet.present();

    const { data } = await  accSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role', data);
  }

  async buscarEnProductos(){
    console.log("tenes que traer de los albumes de trueque")
    await this.verProductos()
  }  
  verProductos(){
    this.modalC.create({
      component: AlbumComponent,
      componentProps: {
        usuarioL: this.usuarioL,
        enTrueque: true
      }
    }).then(async (modalE)=>{
      modalE.present();
      const { data } = await modalE.onWillDismiss();
      this.troqueComprador = data.data;
      if(data.data !== undefined){
        this.troqueAgregado = true;
      }
      
      console.log("este es el prod que traje de mis productos"+JSON.stringify(data.data))
    })
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

    this.camera.getPicture(options).then(async (imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      this.foto = ('data:image/jpeg;base64,' + imageData);
      
      this.fotoASub = imageData;
      //this.usuarioP.foto = this.foto;
      //await this.subirArchivo()
    }, (err) => {
      // Handle error
      alert(err)
    });
  }
//Abre la galeria para seleccionar fotos
  abrirGaleria() {

    const options2: ImagePickerOptions = {
      quality: 70,
      allow_video: false,
      outputType: 1,
      //maximumImagesCount: 1
    }
    this.iPicker.getPictures(options2).then(async (res) => {
      //agrego un nuevo formulario de troque
      if (res!=="OK") {//le puse esto porque me paso que devolvia esto a veces al iniar
      //tener en cuenta que lo puede devolver como array y en ese caso seria res[0]
      this.foto = ('data:image/jpeg;base64,' + res);
      this.fotoASub =  res;
      //await this.subirArchivo()
      //this.usuarioP.foto = this.foto;
    }else{
      this.abrirGaleria()
    }
    
    }, (err) => {
      alert("hay algo mal que no anda bien con estas fotos" + (JSON.stringify(err)))
    }).catch(err =>{alert(err)});
  }

  //Sube el archivo a Cloud Storage
  public subirArchivo() {
    let f = this.fotoASub;
    
    //genero el nombre del archivo
    var fe = new Date();
    //var fec: string = fe.getDate()+"-"+fe.getMonth()+"-"+fe.getUTCFullYear()+"_"+fe.getUTCHours()+fe.getUTCMinutes();
    //firebase no acepta el arroba entonces lo reemplazo
    this.nombreArchivo =`${this.usuarioL.correo.replace( '@', '-' ).toLowerCase()}.jpg`;//fotoPerfil/admin-admin.com.jpg
    var referencia = this.storageServ.referenciaCloudStorage(`productos/${this.nombreArchivo}`);
    var tarea = this.storageServ.tareaCloudStorage(this.nombreArchivo, f);
      //Cambia el porcentaje
    tarea.percentageChanges().subscribe((porcentaje) => {
      /* this.porcentaje = Math.round(porcentaje);
      if (this.porcentaje == 100) {
        this.finalizado = true;
      } */
    });
//tomo la referencia de la imagen y creo un troque
    referencia.putString(f, 'base64', { contentType: 'image/jpeg' }).then(async (snapshot) => {
      this.datos.foto = await snapshot.ref.getDownloadURL()
      
      
    })
    
  }
 /*  borrarFotoVieja(){
    this.storageServ.deleteArchivo('fotoPerfil/'+this.usuarioL.correo.replace( '@', '-' ).toLowerCase()+'.jpg');
    this.usuarioP.foto = "";
    this.datos.foto = ""
  } */
  closeTrueque(){
    this.modal.dismiss()
  }
  rechazarTrueque(){
    this.estado = "rechazado";
    this.modal.dismiss()
  }
  ofertar(){
    console.log("aca hay que crear el trueque como entidad y pasarle toodos los datos")
  }
}


