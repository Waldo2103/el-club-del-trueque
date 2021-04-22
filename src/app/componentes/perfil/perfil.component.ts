import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { mensaje, MensajesService } from 'src/app/servicios/mensajes/mensajes.service';
import { usuario, UsuariosService } from 'src/app/servicios/usuarios/usuarios.service';
import { AlbumesComponent } from '../albumes/albumes.component';
import { ChatComponent } from '../chat/chat.component';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { PopoverController } from '@ionic/angular';
import { PopComponent } from '../pop/pop.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ImagePicker, ImagePickerOptions } from "@ionic-native/image-picker/ngx";
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { StorageService } from 'src/app/servicios/storage/storage.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent implements OnInit {
  public colores=["danger", "secondary", "warning", "primary","success","danger", "secondary", "warning", "primary","success","danger", "secondary", "warning", "primary","success","danger", "secondary", "warning", "primary","success","danger", "secondary", "warning", "primary","success","danger", "secondary", "warning", "primary","success","danger", "secondary", "warning", "primary","success","danger", "secondary", "warning", "primary","success","danger", "secondary", "warning", "primary","success","danger", "secondary", "warning", "primary","success","danger", "secondary", "warning", "primary","success"]
  public usuarioL;
  public usuarioP:any = "";
  public userParam:any;
  public uidChat: string;
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
  public vModo;
  constructor(
    private navParams: NavParams,
    private mensServ: MensajesService,
    private userServ: UsuariosService,
    private modal: ModalController,
    private modalC: ModalController,
    private photoViewer: PhotoViewer,
    private pop: PopoverController,
    private fbu: FormBuilder,
    private iPicker: ImagePicker,
    private camera: Camera,
    private storageServ: StorageService
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
    this.usuarioL = JSON.parse(localStorage.getItem("userLogin"));
    //this.usuarioP.apodo=""
    this.userParam = await this.navParams.get('perfil');
    if (this.userParam !== undefined) {
      this.usuarioP = this.userParam;
      await this.traerUserP();
    } else {
      this.usuarioP = JSON.parse(localStorage.getItem('userLogin'));
    }
    
    
  }

  async traerUserP(){
    //this.userParam = await this.navParams.get('perfil');
    
    this.userServ.getUsuario(this.userParam.correo).subscribe(resp=>{
      this.usuarioP = resp
    });
  }
  verAlbumes(){
    this.modalC.create({
      component: AlbumesComponent,
      componentProps: {
        usuarioP: this.usuarioP
      }
    }).then((modalE)=>{modalE.present();console.log("creo modal de chat exist")})
  }
  crearChat(){
    let uns = this.mensServ.getMensajeXUsuario(this.usuarioL.correo).subscribe((resp) =>{
      console.log("hice getMensajeXUsuario")
      if (resp != undefined) {
        resp.map(res =>{
          console.log("hice mapeo getMensajeXUsuario")
        if ((res.id[0] === this.usuarioL.correo || res.id[1] === this.usuarioL.correo) && (res.id[0] === this.usuarioP.correo || res.id[1] === this.usuarioP.correo)) {
          let chatE = {
            id: res.id[0],
            descripcion: res.descripcion,
            nombre: res.nombre[1],
            imagen: res.imagen[1],
            //messages: data.messages,
            uid: res.uid
          }
          //this.modal.dismiss()
          this.modalC.create({
            component: ChatComponent,
            componentProps: {
              chat: chatE
            }
          }).then((modalE)=>{modalE.present();console.log("creo modal de chat exist")})
      } else {
        console.log("a este error no deberia entrar")
      }
      })
      } else {
        let data: mensaje = {
          nombre: [this.usuarioL.nombre,this.usuarioP.nombre],
          descripcion: '',
          id: [this.usuarioL.correo,this.usuarioP.correo],
          imagen: [this.usuarioL.foto,this.usuarioP.foto],
          uid: ``,
          messages:  {
            content: "",
            type: "",   
            date: new Date(),
            owner: ""
          }
        }
        let res = this.mensServ.createMensajes(data)
        res.then(resp=>{
          console.log("entre en then de la creacion del mensaje")
          this.uidChat = resp;
          let chat = {
          id: data.id[0],
          descripcion: data.descripcion,
          nombre: data.nombre[1],
          imagen: data.imagen[1],
          //messages: data.messages,
          uid: this.uidChat
        }
        //this.router.navigate['folder/Mensajes']
        //this.modal.dismiss()
        this.modal.create({
          component: ChatComponent,
          componentProps: {
            chat: chat
          }
        }).then((modalC)=>{modalC.present();this.modal.dismiss();console.log("creo modal de chat nuevo")})
        })
      }
      uns.unsubscribe()
      
    })
    
    
    
  }

  closePerfil(){
    this.modal.dismiss()
  }

  public fullScreen(image){
    this.photoViewer.show(image, this.usuarioP.nombre, {share: false, headers: ''});
  }

  async presentPopover(ev: any) {
    const popover = await this.pop.create({
      component: PopComponent,
      cssClass: 'my-custom-class',
      event: ev,
      translucent: true,
      mode: 'ios'
    });
    await popover.present();

    const { data } = await  popover.onWillDismiss();
    console.log('onWillDismiss resolved with role', data);
    const { role } = await  popover.onDidDismiss();
    console.log('onWillDismiss resolved with role', role);
    if (data.item === "Editar") {
      this.modoEditar = true;
    } else {
      this.modoEditar = false;
    }
  }

  async opcionesCambioFoto(ev: any) {
    /* const popover = await this.pop.create({
      component: PopComponent,
      cssClass: 'my-custom-class',
      event: ev,
      translucent: true,
      mode: 'ios'
    });
    await popover.present();

    const { data } = await  popover.onWillDismiss();
    console.log('onWillDismiss resolved with role', data);
    const { role } = await  popover.onDidDismiss();
    console.log('onWillDismiss resolved with role', role);
    if (data.item === "Editar") {
      this.modoEditar = true;
    } else {
      this.modoEditar = false;
    } */
  }

  async cambiarFoto(){
    /** REVISAR: FALTA AGREGAR QUE BORRE LA QUE YA TIENE DE STORAGE */
    await this.abrirPopCamara()//REVISAR abre pop y ahi se tiene que elegir 
                                //modo por aho es lo mismo que opcionesCambioFoto
    await this.subirArchivo()
  }

  abrirPopCamara(){
    /***aca hace lo qu tiene que hacer y despues */
    this.modoEntrada()//seguro hay que pasarle el mdoo
  }
  modiPerfil(form){
    console.log(form)//esto queda sin uso, se podria
                      // sacar despues de probarlo si funciona tomar datos del form posta
    let u = this.form.value;
    this. datos =  {
      correo: u.correo,
      apellido: u.apellido,
      apodo: u.apodo,
      descripcion: u.descripcion,
      foto: u.foto,//REVISAR esto
      nombre: u.nombre,
      zona: u.zona
    }
    
    this.modoEditar = false;
  }

  /*** PARA CAMBIAR FOTO */
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
      this.foto = ('data:image/jpeg;base64,' + imageData);
      
      this.fotoASub = imageData;
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
    this.iPicker.getPictures(options2).then((res) => {
      //agrego un nuevo formulario de troque
      if (res!=="OK") {//le puse esto porque me paso que devolvia esto a veces al iniar
      
      
      //tener en cuenta que lo puede devolver como array y en ese caso seria res[0]
      this.foto = ('data:image/jpeg;base64,' + res);
      this.fotoASub =  res;
    }else{
      this.abrirGaleria()
    }
    }, (err) => {
      alert("hay algo mal que no anda bien con estas fotos" + (JSON.stringify(err)))
    });
  }

  //Sube el archivo a Cloud Storage
  public subirArchivo() {
    let f = this.fotoASub;
    
    //genero el nombre del archivo
    var fe = new Date();
    var fec: string = fe.getDate()+"-"+fe.getMonth()+"-"+fe.getUTCFullYear()+"_"+fe.getUTCHours()+fe.getUTCMinutes();
    //firebase no acepta el arroba entonces lo reemplazo
    this.nombreArchivo =`${this.usuarioL.correo.replace( '@', '-' ).toLowerCase()}_${fec}.jpg`
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
      this.datos.foto = await snapshot.ref.getDownloadURL()
      
      this.userServ.updateUsuario(this.datos);
    })
    
  }
  cancelarModi(){
    this.modoEditar = false;
  }

}
