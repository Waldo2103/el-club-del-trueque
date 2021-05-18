import { Component, OnInit } from '@angular/core';
import { ActionSheetController, ModalController, NavParams } from '@ionic/angular';
import { usuario, UsuariosService } from 'src/app/servicios/usuarios/usuarios.service';
import { AlbumesComponent } from '../albumes/albumes.component';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { PopoverController } from '@ionic/angular';
import { PopComponent } from '../pop/pop.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ImagePicker, ImagePickerOptions } from "@ionic-native/image-picker/ngx";
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { StorageService } from 'src/app/servicios/storage/storage.service';
import { Router } from '@angular/router';
import { califica, CalificaService } from 'src/app/servicios/califica/califica.service';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent implements OnInit {
  //public usuarioL;
  public usuarioP: any = "";
  public userParam: any;
  //public uidChat: string;
  public modoEditar: boolean = false;
  public form: FormGroup;
  /**  REVISAR QUE ESTEN CORRECTOS LOS CAMPOS */
  public datos: usuario;

  /**PARA SUBIR ARCHIVO */
  public nombreArchivo = '';
  public porcentaje = 0;
  public finalizado = false;
  public foto;
  public fotoASub;
  //public vModo;
  public cambieFoto: boolean = false;
  public calificaciones = []
  private userLogin;
  public caliprome: number = 0;
  public calipromeRed: number = 0;
  public estre = [];
  constructor(
    private navParams: NavParams,
    private userServ: UsuariosService,
    private modal: ModalController,
    private modalC: ModalController,
    private photoViewer: PhotoViewer,
    private pop: PopoverController,
    private fbu: FormBuilder,
    private iPicker: ImagePicker,
    private camera: Camera,
    private storageServ: StorageService,
    private actionSheetController: ActionSheetController,
    private router: Router,
    private caliServ: CalificaService,
    private AFauth: AngularFireAuth
  ) {
    this.form = this.fbu.group({
      apellido: '',
      apodo: '',
      descripcion: '',
      foto: '',
      nombre: '',
      zona: ''
    })
  }

  async ngOnInit() {
    /* await this.AFauth.authState.subscribe(res =>{
      this.userLogin = res.email
      this.usuarioP = JSON.parse(localStorage.getItem("userLogin"));
      if (this.userLogin !== this.usuarioP.correo) {
        this.usuarioP = this.userServ.getUsuario(this.userLogin)//ACA ESTA EL PROBLEMA QUE TRAE CUALQUIER GILADA
      }
      this.caliServ.getCalifica(this.usuarioP.correo).subscribe(resul => {
        this.calificaciones =  resul.payload.data()["calificaciones"]
      })
    }); */
    //this.usuarioP.apodo=""
    this.userParam = await this.navParams.get('perfil');
    if (this.userParam !== undefined) {
      this.usuarioP = this.userParam;
      await this.caliServ.getCalifica(this.usuarioP.correo).subscribe(resul => {
        if (resul.payload.data() === undefined) {
          this.calificaciones = []
          this.calcularEstrellas(0);
        } else{
          this.calificaciones =  resul.payload.data()["calificaciones"]
          let sumaCali = 0;
          this.calificaciones.forEach(cali=>{
            sumaCali = sumaCali + cali.estrellas
          })
          this.calcularEstrellas(sumaCali);
        }
      })
    } else {
      //this.usuarioP = JSON.parse(localStorage.getItem('userLogin'));
      await this.AFauth.authState.subscribe(res =>{
        this.userLogin = res.email
        this.usuarioP = JSON.parse(localStorage.getItem("userLogin"));
        if (this.userLogin !== this.usuarioP.correo) {
          this.usuarioP = this.userServ.getUsuario(this.userLogin)//ACA ESTA EL PROBLEMA QUE TRAE CUALQUIER GILADA
        }
        console.log(this.usuarioP.correo)
        this.caliServ.getCalifica(this.usuarioP.correo).subscribe(resul => {
          if (resul.payload.data() === undefined) {
            this.calificaciones = []
            this.calcularEstrellas(0);
          } else{
            this.calificaciones =  resul.payload.data()["calificaciones"]
            let sumaCali = 0;
            this.calificaciones.forEach(cali=>{
              sumaCali = sumaCali + cali.estrellas
            })
            this.calcularEstrellas(sumaCali);
          }
        })
      });
    }
    

  }

  calcularEstrellas(sumaCali){
    if (sumaCali === 0) {
      this.caliprome = 0
    this.calipromeRed = 0
    if (this.calipromeRed === 0) {
        this.estre = ["star-outline","star-outline","star-outline","star-outline","star-outline"]
      }
    } else {
      
      this.caliprome = sumaCali / this.calificaciones.length
      this.calipromeRed = parseFloat(this.caliprome.toFixed(1)) 
      /**ACA SE SETEAN LOS ICONOS DE ESTRELLAS */
      
      if (this.calipromeRed === 1) {
        this.estre = ["star","star-outline","star-outline","star-outline","star-outline"]
      } else if (this.calipromeRed <= 1.5 && this.calipromeRed > 1) {
        this.estre = ["star","star-half","star-outline","star-outline","star-outline"]
      } else if (this.calipromeRed >= 1.6 && this.calipromeRed < 2) {
        this.estre = ["star","star","star-outline","star-outline","star-outline"]
      }
      if (this.calipromeRed === 2) {
        this.estre = ["star","star","star-outline","star-outline","star-outline"]
      } else if (this.calipromeRed <= 2.5 && this.calipromeRed > 2) {
        this.estre = ["star","star","star-half","star-outline","star-outline"]
      } else if (this.calipromeRed >= 2.6 && this.calipromeRed < 3) {
        this.estre = ["star","star","star","star-outline","star-outline"]
      }
      if (this.calipromeRed === 3) {
        this.estre = ["star","star","star","star-outline","star-outline"]
      } else if (this.calipromeRed <= 3.5 && this.calipromeRed > 3) {
        this.estre = ["star","star","star-","star-half","star-outline"]
      } else if (this.calipromeRed >= 3.6 && this.calipromeRed < 4) {
        this.estre = ["star","star","star","star","star-outline"]
      }
      if (this.calipromeRed === 4) {
        this.estre = ["star","star","star","star","star-outline"]
      } else if (this.calipromeRed <= 4.5 && this.calipromeRed > 4) {
        this.estre = ["star","star","star","star","star-half"]
      } else if (this.calipromeRed >= 4.6 && this.calipromeRed < 5) {
        this.estre = ["star","star","star","star","star"]
      }
      if (this.calipromeRed === 5) {
        this.estre = ["star","star","star","star","star"]
      } 
    }
    
  }
  async traerUserP() {
    this.userServ.getUsuario(this.userParam.correo).subscribe(resp => {
      this.usuarioP = resp
    });
  }
  verAlbumes() {
    this.modalC.create({
      component: AlbumesComponent,
      componentProps: {
        usuarioP: this.usuarioP
      }
    }).then((modalE) => { modalE.present();})
  }

  closePerfil() {
    this.modal.dismiss()
  }

  public fullScreen(image) {
    this.photoViewer.show(image, this.usuarioP.nombre, { share: false, headers: '' });
  }

  async presentPopover(ev: any) {
    const popover = await this.pop.create({
      component: PopComponent,
      cssClass: 'my-custom-class',
      //componentProps: {modo: 'editar'},
      event: ev,
      translucent: true,
      mode: 'ios'
    });
    await popover.present();

    const { data } = await popover.onWillDismiss();
    //console.log('onWillDismiss resolved with role', data);
    /* const { role } = await  popover.onDidDismiss();
    console.log('onWillDismiss resolved with role', role); */
    if (data != undefined) {
      if (data.item === "Editar") {
        this.modoEditar = true;
      } else {
        this.modoEditar = false;
      }
    }

  }

  async cambiarFoto() {
    /** REVISAR: FALTA AGREGAR QUE BORRE LA QUE YA TIENE DE STORAGE */
    const accSheet = await this.actionSheetController.create({
      header: 'Foto de Perfil',
      cssClass: 'my-custom-class2',
      buttons: [{
        text: 'Borrar',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.borrarFotoVieja()
          console.log('Delete clicked');
        }
      }, {
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

    /* const { data } = await  popover.onWillDismiss();
    console.log('onWillDismiss resolved with role', data); */
    const { data } = await accSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role', data);

    //await this.modoEntrada(data.modo)

    //this.borrarFotoVieja()
  }

  async modiPerfil(form) {
    if (this.cambieFoto) {
      await this.subirArchivo();
    }

    // console.log(form)//esto queda sin uso, se podria
    // sacar despues de probarlo si funciona tomar datos del form posta
    let u = this.form.value;
    let valida: usuario;
    if (u.apellido === "") {
      u.apellido = this.usuarioP.apellido
    }
    if (u.apodo === "") {
      u.apodo = this.usuarioP.apodo
    }
    if (u.descripcion === "") {
      u.descripcion = this.usuarioP.descripcion
    }
    if (u.nombre === "") {
      u.nombre = this.usuarioP.nombre
    }
    if (u.zona === "") {
      u.zona = this.usuarioP.zona
    }
    this.datos = {
      correo: this.usuarioP.correo,
      apellido: u.apellido,
      apodo: u.apodo,
      descripcion: u.descripcion,
      foto: this.usuarioP.foto,//REVISAR esto|
      nombre: u.nombre,
      zona: u.zona
    }
    this.userServ.updateUsuario(this.datos).then(res => {
      //alert(res)
      this.usuarioP.foto = this.datos.foto;
      this.usuarioP = this.datos;
      this.form = this.fbu.group({
        apellido: '',
        apodo: '',
        descripcion: '',
        foto: '',
        nombre: '',
        zona: ''
      })
    }).catch(err => { alert(err) })
    this.modoEditar = false;
  }

  /*** PARA CAMBIAR FOTO - revisar*/
  /* public modoEntrada(modo) {
    
    this.vModo = modo;
    if (this.vModo === "camera") {
      this.abrirCamara()
    } else if (this.vModo === "gallery") {
      this.abrirGaleria()
    } else {
      alert("fallo abrir camara o galeria")
    }
  } */

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
      this.cambieFoto = true;
      this.usuarioP.foto = this.foto;
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
      if (res !== "OK") {//le puse esto porque me paso que devolvia esto a veces al iniar
        //tener en cuenta que lo puede devolver como array y en ese caso seria res[0]
        this.foto = ('data:image/jpeg;base64,' + res);
        this.fotoASub = res;
        //await this.subirArchivo()
        this.cambieFoto = true;
        this.usuarioP.foto = this.foto;
      } else {
        this.abrirGaleria()
      }

    }, (err) => {
      alert("hay algo mal que no anda bien con estas fotos" + (JSON.stringify(err)))
    }).catch(err => { alert(err) });
  }

  //Sube el archivo a Cloud Storage
  public subirArchivo() {
    let f = this.fotoASub;

    //genero el nombre del archivo
    var fe = new Date();
    //var fec: string = fe.getDate()+"-"+fe.getMonth()+"-"+fe.getUTCFullYear()+"_"+fe.getUTCHours()+fe.getUTCMinutes();
    //firebase no acepta el arroba entonces lo reemplazo
    this.nombreArchivo = `${this.usuarioP.correo.replace('@', '-').toLowerCase()}.jpg`;//fotoPerfil/admin-admin.com.jpg
    var referencia = this.storageServ.referenciaCloudStorage(`fotoPerfil/${this.nombreArchivo}`);
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
      this.datos.foto = await snapshot.ref.getDownloadURL()


    })

  }
  borrarFotoVieja() {
    this.storageServ.deleteArchivo('fotoPerfil/' + this.usuarioP.correo.replace('@', '-').toLowerCase() + '.jpg');
    this.usuarioP.foto = "";
    this.datos.foto = ""
  }
  cancelarModi() {
    this.modoEditar = false;
  }


}
