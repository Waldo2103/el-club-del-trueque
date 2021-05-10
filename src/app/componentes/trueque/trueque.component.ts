import { Component, OnInit } from '@angular/core';
import { ActionSheetController, AlertController, ModalController, NavParams } from '@ionic/angular';
import { MensajesService } from 'src/app/servicios/mensajes/mensajes.service';
import { StorageService } from 'src/app/servicios/storage/storage.service';
import { UsuariosService } from 'src/app/servicios/usuarios/usuarios.service';
import { ImagePicker, ImagePickerOptions } from "@ionic-native/image-picker/ngx";
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { producto, ProductosService } from 'src/app/servicios/productos/productos.service';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { AlbumesComponent } from '../albumes/albumes.component';
import { ProductoComponent } from '../producto/producto.component';
import { AlbumComponent } from '../album/album.component';
import { trueque, TruequeService } from 'src/app/servicios/trueque/trueque.service';



@Component({
  selector: 'app-trueque',
  templateUrl: './trueque.component.html',
  styleUrls: ['./trueque.component.scss'],
})
export class TruequeComponent implements OnInit {
  public trueque: trueque;
  public estado = "Trueque NO Iniciado";
  public troqueComprador: producto;
  public troqueCompradorBis: producto;
  public troqueVendedor: producto;
  public foto = "";
  public fotoASub;
  public usuarioP;
  public usuarioL;
  public nombreArchivo = "";
  public datos;

  public btnContraoferta: boolean = false;
  public troqueAgregado: boolean = false;
  public truequeEstado;// = {trueque:"",comprador:"",vendedor:""};
  public nuevaOferta: boolean = false;
  public modificable: boolean = false;
  public sameTroque: boolean = false;
  public altaNueva: boolean = false;
  public mathRandom;
  public cambioEstado: boolean = false;
  public oferta: boolean = false;
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
    private truequeServ: TruequeService,
    private prodServ: ProductosService,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.mathRandom = (Math.floor(Math.random() * 100000)).toString();
    this.traerTroques();
    this.traerUsuarios();
    //this.truequeEstado.trueque

  }
  traerUsuarios() {
    this.usuarioL = this.navParams.get("usuarioL");
    this.usuarioP = this.navParams.get("usuarioP");
    //console.log(this.usuarioP)
  }
  traerTroques() {
    this.trueque = this.navParams.get("trueque");
    //si es alta
    if (this.trueque === undefined) {
      this.troqueVendedor = this.navParams.get("troqueV");
      this.troqueComprador = this.navParams.get("troqueC");
      this.truequeEstado = this.navParams.get("truequeEstado");
      //sino el trueque ya fue iniciado
    } else {
      this.troqueVendedor = this.trueque.vendedor;
      this.troqueComprador = this.trueque.comprador;
      this.truequeEstado = this.trueque.estado;
    }
    if (!this.troqueVendedor.estado) {
      alert("El dueño de la publicación ya lo trocó con otro usuario")
    }


    if (this.troqueComprador !== undefined) {
      this.foto = this.troqueComprador.imagen;
      //pendiente confirmado cancelado finalizado
      if (this.truequeEstado.trueque === "pendiente") {

        if (this.usuarioL.correo === this.troqueComprador.owner) {
          if (this.truequeEstado.comprador === "pendiente") {
            this.btnContraoferta = false;
            this.nuevaOferta = true;
            this.modificable = true;
            this.troqueAgregado = true;
          } else {
            this.btnContraoferta = false;
            this.nuevaOferta = false;
            this.modificable = false;
            this.troqueAgregado = false;
          }

        } else {
          if (this.truequeEstado.vendedor === "pendiente") {
            this.btnContraoferta = false;
            this.nuevaOferta = true;
            this.modificable = true;
            this.troqueAgregado = true;
          } else {
            this.btnContraoferta = false;
            this.nuevaOferta = false;
            this.modificable = false;
            this.troqueAgregado = false;
          }
        }
      } else {
        this.btnContraoferta = false;
        this.nuevaOferta = false;
        this.modificable = false;
        this.troqueAgregado = false;
      }
    }

  }

  async agregarTroque() {
    try {
      
    
    if (this.troqueComprador === undefined || this.usuarioL.correo === this.troqueComprador.owner) {
      const accSheet = await this.actionSheetController.create({
        header: 'Agrega tu Troque',
        cssClass: 'my-custom-class2',
        buttons: [{
          text: 'Buscar en tus Troques',
          icon: 'images',
          handler: () => {
            this.troqueCompradorBis = this.troqueComprador;
            this.buscarEnProductos()
          }
        }, {
          text: 'Sacar Foto',
          icon: 'camera',
          handler: () => {
            this.troqueCompradorBis = this.troqueComprador;
            this.abrirCamara()
          }
        }, {
          text: 'Subir desde Galería',
          icon: 'image',
          handler: () => {
            this.troqueCompradorBis = this.troqueComprador;
            this.abrirGaleria()
          }
        }, {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
          handler: () => {
          }
        }]
      });
      await accSheet.present();
      const { data } = await accSheet.onDidDismiss();
    } else {
      const accSheet = await this.actionSheetController.create({
        header: 'Agrega tu Troque',
        cssClass: 'my-custom-class2',
        buttons: [{
          text: 'Buscar en sus Troques',
          icon: 'images',
          handler: () => {
            this.troqueCompradorBis = this.troqueComprador;
            this.buscarEnProductos()
          }
        }, {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
          handler: () => {
          }
        }]
      });
      await accSheet.present();
      const { data } = await accSheet.onDidDismiss();
    }
  } catch (error) {
      alert(error)
  }

    
  }

  async buscarEnProductos() {
    await this.verProductos()
  }
  verProductos() {
    let ownerGallery; //esta varia si el truque ya fue iniciado(troqueComprador.owner) 
    //o es un nuevo trueque y eso indica que siempre va a ser usuarioL.correo
    if (this.troqueComprador === undefined) {
      ownerGallery = this.usuarioL.correo;
    } else {
      ownerGallery = this.troqueComprador.owner;
    }
    //console.log("aa"+this.troqueComprador.owner)
    this.modalC.create({
      component: AlbumComponent,
      componentProps: {
        ownerAlbum: ownerGallery,//aca se pasa el usuario donde se busca el producto
        enTrueque: true
      }
    }).then(async (modalE) => {
      modalE.present();
      const { data } = await modalE.onWillDismiss();

      if (data.data !== undefined) {
        if (this.troqueCompradorBis !== undefined) {
          if (this.troqueCompradorBis.id === data.data.id) {
            this.sameTroque = true;
            alert("Solo podés contraofertar cuando cambias de troque!\nSeleccionaste el mismo troque!")//Solo podés contraofertar cuando cambias de producto!
          }
        }

        if (this.troqueComprador !== undefined) {
          this.btnContraoferta = true;
        }
        this.troqueAgregado = true;
        this.modificable = true;
        this.altaNueva = false;
        this.troqueComprador = data.data;
        this.foto = this.troqueComprador.imagen;
      } else {
        this.sameTroque = true;
        this.troqueAgregado = false;
      }
      if (this.sameTroque) {
        this.btnContraoferta = false;
      } else {
        this.btnContraoferta = true;
      }
      //console.log("este es el prod que traje de mis productos" + JSON.stringify(data.data))
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
    if (this.foto === "") {
      this.cambioEstado = false;
    }else {
      this.cambioEstado = true;
    }
    this.camera.getPicture(options).then(async (imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      this.foto = ('data:image/jpeg;base64,' + imageData);
      this.fotoASub = imageData;
      if (this.troqueComprador !== undefined) {
        this.btnContraoferta = true;
      }
      //this.troqueComprador.imagen = imageData;
      if (this.cambioEstado) {
        this.troqueComprador.id = this.troqueComprador.owner + "_" + (Math.floor(Math.random() * 1000)).toString();
        this.troqueComprador.nombre = "Mi Troque";
        this.troqueComprador.descripcion = "";
        this.troqueComprador.etiquetas = "";
        this.troqueComprador.imagen = "";
        this.troqueComprador.album = "";
      } else {//sino es alta
        this.troqueComprador = {
          id: this.usuarioP.correo + "_" + (Math.floor(Math.random() * 1000)).toString(),
          nombre: "Mi Troque",
          descripcion: "",
          etiquetas: "",
          owner: this.usuarioL.correo,
          apodo: this.usuarioL.apodo,
          imagen: "",
          album: ""
        }
      }

      if (imageData !== undefined) {
        this.troqueAgregado = true;
        this.modificable = true;
        this.altaNueva = true;
        //this.troqueComprador = data.data;
        //this.foto = this.troqueComprador.imagen;
      } else {
        this.troqueAgregado = false;
      }
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
      if (res !== "OK") {//le puse esto porque me paso que devolvia esto a veces al iniar
        //tener en cuenta que lo puede devolver como array y en ese caso seria res[0]
        this.foto = ('data:image/jpeg;base64,' + res);
        this.fotoASub = res;
        if (this.troqueComprador !== undefined) {
          this.btnContraoferta = true;
        }

        //this.troqueComprador.imagen = imageData;
        this.troqueComprador = {
          id: this.usuarioP.correo + "_" + (Math.floor(Math.random() * 1000)).toString(),
          nombre: "Mi Troque",
          descripcion: "",
          etiquetas: "",
          owner: this.usuarioL.correo,
          apodo: this.usuarioL.apodo,
          imagen: "",
          album: "",
        }
        if (res !== undefined) {
          this.troqueAgregado = true;
          this.modificable = true;
          this.altaNueva = true;
          //this.troqueComprador = data.data;
          //this.foto = this.troqueComprador.imagen;
        } else {
          this.troqueAgregado = false;
        }
      } else {
        this.abrirGaleria()
      }

    }, (err) => {
      alert("hay algo mal que no anda bien con estas fotos" + (JSON.stringify(err)))
    }).catch(err => { alert(err) });
  }

  //Sube el archivo a Cloud Storage
  async subirArchivo() {
    try {
      
    
    let f = this.fotoASub;

    //genero el nombre del archivo
    var fe = new Date();
    //var fec: string = fe.getDate()+"-"+fe.getMonth()+"-"+fe.getUTCFullYear()+"_"+fe.getUTCHours()+fe.getUTCMinutes();
    //firebase no acepta el arroba entonces lo reemplazo
    if (this.trueque !== undefined) {
      this.nombreArchivo = `${this.troqueComprador.owner.replace('@', '-').toLowerCase()}_${this.trueque.id[2]}.jpg`;// tomo el del id del trueque para pisar la imagen
    }else{
      this.nombreArchivo = `${this.troqueComprador.owner.replace('@', '-').toLowerCase()}_${this.mathRandom}.jpg`;
    }
    var referencia = this.storageServ.referenciaCloudStorage(`productosTemp/${this.nombreArchivo}`);
    var tarea = this.storageServ.tareaCloudStorage(this.nombreArchivo, f);
    //Cambia el porcentaje
    tarea.percentageChanges().subscribe((porcentaje) => {
      /* this.porcentaje = Math.round(porcentaje);
      if (this.porcentaje == 100) {
        this.finalizado = true;
      } */
    });
    //tomo la referencia de la imagen y creo un troque
    await referencia.putString(f, 'base64', { contentType: 'image/jpeg' }).then(async (snapshot) => {
      this.troqueComprador.imagen = await snapshot.ref.getDownloadURL();
    })
  } catch (error) {
      alert(error)
  }

  }
  closeTrueque() {
    this.modal.dismiss()
  }
  async cambiarEstadoTrueque(estado) {
    this.cambioEstado = true;
    //let uid = this.navParams.get("uid")
    let trueque;
    if (estado === 'pendiente') {
      //alta nueva es que se sube de la camara o galeria un nuevo producto y no lo toma de uno existente
      if (this.altaNueva) {
        await this.subirArchivo()
        /*    //la subida es por una nueva oferta y por ende se crea todo el registro del trueque
       if(this.oferta){
         //ACA metemos lo que se hace en el oferta
       let data: trueque = {
         id: [this.troqueComprador.owner, this.troqueVendedor.owner, this.mathRandom],
         comprador: this.troqueComprador,
         vendedor: this.troqueVendedor,
         estado: { trueque: "pendiente", comprador: "confirmado", vendedor: "pendiente" }
       }
       //alert("voy a crear el trueque")
       this.truequeServ.createTrueque(data);
       alert(`El trueque ha sido iniciado con éxito!!! Tenés que esperar que @${this.troqueVendedor.apodo} responda tu oferta`);
       this.modal.dismiss()
       //la subida es por un trueque existente por ende solo se modifica un registro existente
       }else */ /* if(this.cambioEstado){
          let trueque = {
            trueque: "pendiente",
            comprador: this.truequeEstado.vendedor,
            vendedor: this.truequeEstado.comprador,
            uid: this.trueque.uid,
            compradorT: this.troqueComprador
          }
          this.truequeServ.updateTrueque(trueque)
          this.modal.dismiss()
        } */
        //this.trueque.uid = this.nombreArchivo
        trueque = {
          trueque: estado,
          comprador: this.truequeEstado.vendedor,
          vendedor: this.truequeEstado.comprador,
          uid: this.trueque.uid,
          compradorT: this.troqueComprador
        }
      }
      if (this.truequeEstado.comprador === 'pendiente' && this.truequeEstado.vendedor === 'confirmado') {
        this.truequeEstado.comprador = 'confirmado';
        this.truequeEstado.vendedor = 'pendiente';
      } else if (this.truequeEstado.comprador === 'confirmado' && this.truequeEstado.vendedor === 'pendiente') {
        this.truequeEstado.comprador = 'pendiente';
        this.truequeEstado.vendedor = 'confirmado';
      }
      if (!this.altaNueva) {
        trueque = {
        trueque: estado,
        comprador: this.truequeEstado.comprador,
        vendedor: this.truequeEstado.vendedor,
        uid: this.trueque.uid,
        compradorT: this.troqueComprador
      }
      }
      
    } else if (estado === 'rechazado') {
      if (this.truequeEstado.comprador === 'pendiente') {
        this.truequeEstado.comprador = 'rechazado';
      } else if (this.truequeEstado.vendedor === 'pendiente') {
        this.truequeEstado.vendedor = 'rechazado';
      }
    } else if (estado === 'confirmado') {
      this.truequeEstado.comprador = 'confirmado';
      this.truequeEstado.vendedor = 'confirmado';
      this.truequeEstado.trueque = 'confirmado';
      trueque = {
        trueque: estado,
        comprador: estado,
        vendedor: estado,
        uid: this.trueque.uid,
        compradorT: this.troqueComprador
      }
      this.truequeServ.updateTrueque(trueque)
      /* if (this.truequeEstado.comprador === 'pendiente') {
        this.truequeEstado.comprador = 'confirmado';
      } else if (this.truequeEstado.vendedor === 'pendiente') {
        this.truequeEstado.vendedor = 'confirmado';
      } */
      //console.log(this.troqueComprador.id)
      //console.log(this.troqueVendedor.id)
      if (this.troqueComprador.nombre !== "Mi Troque") {
        await this.prodServ.updateProducto(this.troqueComprador.id, false);
      }
      
      await this.prodServ.updateProducto(this.troqueVendedor.id, false);
      this.modal.dismiss()
    }

    let truequeR = {
      trueque: estado,
      comprador: this.truequeEstado.comprador,
      vendedor: this.truequeEstado.vendedor,
      uid: this.trueque.uid,
    }
    //CAMBIE LO DE ALTA NUEVA POR ESTANDARIZACION | aca digo si es un producto existente y estado de contraoferta (pendiente) es decir se cambia el producto
    if (/* !this.altaNueva && */ estado === 'pendiente') {
      this.truequeServ.updateTrueque(trueque)
      this.modal.dismiss()
    }
    //si se rechaza se pide confirmacion
    if (estado === 'rechazado') {
      this.alertaConfirmacion('Finalizar Trueque', truequeR, 'Si hacés clic en SI Cancelarás el trueque. ¿Estás')
    }
  }
  async ofertar() {
    this.oferta = true;
    //se sacan las partes porque se necesita el producto entero + 1 estado
    //let truequeParteC: truequeParte = {foto:this.troqueComprador.imagen,owner:this.troqueComprador.owner, estado:"confirmado"};
    //let truequeParteV: truequeParte = {foto:this.troqueVendedor.imagen,owner:this.troqueVendedor.owner, estado:"pendiente"};

    //alta nueva es que se sube de la camara o galeria un nuevo producto y no lo toma de uno existente
    if (this.altaNueva) {
      alert("entre a alta nueva")
      await this.subirArchivo();
    }//else{ comento porque se supone que ahora el subir foto solo sube la foto
    let data: trueque = {
      id: [this.troqueComprador.owner, this.troqueVendedor.owner, this.mathRandom],
      comprador: this.troqueComprador,
      vendedor: this.troqueVendedor,
      estado: { trueque: "pendiente", comprador: "confirmado", vendedor: "pendiente" }
    }
    alert("voy a crear el trueque")
    this.truequeServ.createTrueque(data);
    alert(`El trueque ha sido iniciado con éxito!!! Tenés que esperar que @${this.troqueVendedor.apodo} responda tu oferta`);
    this.modal.dismiss()
    //}

  }

  public alertaConfirmacion(header: string, trueque, message: string) {
    this.alertCtrl.create({
      header,
      message,
      buttons: [
        {
          text: 'No',
          role: 'Cancel',
          handler: () => {
          }
        },
        {
          text: 'Si',
          handler: async () => {
            this.truequeServ.updateTrueque(trueque)
            await this.prodServ.updateProducto(this.troqueComprador.id, true);
            await this.prodServ.updateProducto(this.troqueVendedor.id, true);
            this.modal.dismiss()
          }
        }
      ]
    }).then(a => { a.present(); });
  }
}


