import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActionSheetController, ModalController, NavParams } from '@ionic/angular';
import { Grupo } from 'src/app/clases/grupo';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { ImagePicker, ImagePickerOptions } from "@ionic-native/image-picker/ngx";
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { AlertasService } from 'src/app/servicios/alertas/alertas.service';

@Component({
  selector: 'app-grupo-abm',
  templateUrl: './grupo-abm.component.html',
  styleUrls: ['./grupo-abm.component.scss'],
})
export class GrupoABMComponent implements OnInit {
  public modo: string; // Indica el modo en el que se abre el componente
  public modoTitu: string = "Crear Grupo"; // Es para setear el titulo del ABM
  form: FormGroup;
  grupo: Grupo;
  public crearGrupo;
  userLogin: string;
  foto: string = "../../../../assets/img/noPortada.png";
  public nombreArchivo: string;
  public fotoASub;

  // Variables para eliminacion
  public uniqueAdmin;
  public titulo: string
  public mensaje: string
  public botones: Array<string>;
  public eligeAdmin: boolean = false;
  public integrantes:Array<Object> = [];//integrantes del grupo para los checkbox
  constructor(
    private AFauth: AngularFireAuth,
    private fBuilder: FormBuilder,
    private fireServ: FirebaseService,
    private modal: ModalController,
    private actionSheetController: ActionSheetController,
    private photoViewer: PhotoViewer,
    private iPicker: ImagePicker,
    private camera: Camera,
    private navParams: NavParams,
    private alertServ: AlertasService
  ) { }

  ngOnInit() {
    this.modo = this.navParams.get('modo');
    this.grupo = this.navParams.get('grupo');
    //se guarda un array con los integ y un campo en false
    for (let int of this.grupo.integrantes) {
      this.integrantes.push({
        inte: int,
        admin: false
      }) 
      
      
    }
    console.log(this.grupo)
    this.traerUserLogin();
    this.form = this.fBuilder.group({
      nombre: [''],
      descripcion: new FormControl('', Validators.required),
      publico: new FormControl(false),
      integrantes: new FormControl('')
    })
    switch (this.modo) {
      case "A":
        this.modoTitu = "Crear Grupo"
        break;
      case "B":
        // Si solo tiene un admin puede eliminar o elegir otro
        if (this.grupo.admin.length === 1) {
          this.uniqueAdmin = true;
          this.titulo = `Eliminar el grupo ${this.grupo.nombre}`;
          this.mensaje = '¿Estás seguro de que querés eliminar este grupo? Tenés la opción de elegir otro administrador.';
          this.botones = ['Eliminar Grupo', 'Elegir Administrador']
          this.alertServ.alertaConfirmacion(this.titulo, this.mensaje, this.botones).then(resp => {
            if (resp) {
              // Elimina
              this.modoTitu = "Eliminar Grupo"
              this.bajaGrupo(this.grupo)
            } else {
              // Elige Admin
              this.modoTitu = "Elegir Administrador"
              this.eligeAdmin = true;
              this.modo = 'M'
            }
          })
        } else {
          this.uniqueAdmin = false;
          this.titulo = `Salir del grupo ${this.grupo.nombre}`;
          this.mensaje = 'Este grupo tiene más de un administrador. Podés salir del grupo si lo deseas';
          this.botones = ['Permanecer en el grupo', 'Salir']
          this.alertServ.alertaConfirmacion(this.titulo, this.mensaje, this.botones).then(resp => {
            if (resp) {
              // Permance
              this.modoTitu = "Ver Grupo"
            } else {
              // Sale
              this.modoTitu = "Salir del Grupo";
              this.titulo = `Saliste del grupo ${this.grupo.nombre}`;
              this.mensaje = 'Podés volver a unirte cuando lo desees';
              this.alertServ.alertaInformacion(this.titulo, this.mensaje, "Aceptar").then(() => { this.modal.dismiss() })
            }
          })
        }

        this.form.setValue({
          nombre: this.grupo.nombre,
          descripcion: this.grupo.descripcion,
          publico: this.grupo.publico,
          integrantes: ''
        })
        break;
      case "M":
        this.eligeAdmin = true;
        this.modoTitu = "Modificar Grupo"
        this.form.setValue({
          nombre: this.grupo.nombre,
          descripcion: this.grupo.descripcion,
          publico: this.grupo.publico,
        })
        break;
      default:
        alert("Error en modo de apertura del componente grupo")
        break;
    }

  }

  abmGrupo(datos) {
    switch (this.modo) {
      case "A":
        this.altaGrupo()
        break;
      case "B":
        this.bajaGrupo(datos)
        break;
      case "M":
        this.modiGrupo(datos)
        break;
      default:
        alert("Error en modo de apertura del componente grupo")
        break;
    }
  }
  async altaGrupo() {
    let g = this.form.value
    if (g.imagen === undefined) {
      g.imagen = this.foto;
    }
    this.grupo = {
      nombre: g.nombre,
      descripcion: g.descripcion,
      admin: [this.userLogin],
      publico: g.publico,
      imagen: g.imagen
    }
    await this.subirArchivo(this.grupo)
  }
  async bajaGrupo(grupo) {
    console.log(this.userLogin)
      this.fireServ.updateField('grupos', grupo, 'usuarios', this.userLogin, 'B')
      /* this.fireServ.deleteDoc(grupo.id, 'grupos/').then(()=>{
        this.fireServ.updateField('grupos', grupo,'usuarios',this.userLogin,'B')
      }) */
    //Esto tiene que ir una vez eliminado
    this.modoTitu = "Salir del Grupo";
    this.titulo = `Saliste del grupo ${this.grupo.nombre}`;
    this.mensaje = 'Podés volver a unirte cuando lo desees';
    this.alertServ.alertaInformacion(this.titulo, this.mensaje, "Aceptar").then(() => { this.modal.dismiss() })
  }
  async modiGrupo(grupo) {
    console.log(this.integrantes)
  }
  traerUserLogin() {
    this.AFauth.authState.subscribe(res => {
      this.userLogin = res.email
    });


  }
  async agregarFoto() {
    const accSheet = await this.actionSheetController.create({
      header: 'Agrega tu Troque',
      cssClass: 'my-custom-class2',
      buttons: [{
        text: 'Sacar Foto',
        icon: 'camera',
        handler: () => {
          this.abrirCamara()
        }
      }, {
        text: 'Subir desde Galería',
        icon: 'image',
        handler: () => {
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
    const data = await accSheet.onDidDismiss().then(() => {
      console.log("cossooooooooooooooooooooooooooovich")
    });
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

      } else {
        this.abrirGaleria()
      }

    }, (err) => {
      alert("hay algo mal que no anda bien con estas fotos" + (JSON.stringify(err)))
    }).catch(err => { alert(err) });
  }


  public subirArchivo(grupo) {
    // Validamos que se haya cargado una foto
    if (this.fotoASub !== undefined) {
      let f = this.fotoASub;
      // Genero el nombre del archivo
      var fe = new Date();
      var fec: string = fe.getDate() + "-" + fe.getMonth() + "-" + fe.getUTCFullYear() + "_" + fe.getUTCHours() + fe.getUTCMinutes();
      // Firebase no acepta el arroba entonces lo reemplazo
      this.nombreArchivo = `${this.grupo.admin[0].replace('@', '-').toLowerCase()}_${fec}.jpg`
      var referencia = this.fireServ.referenciaCloudStorage(`grupos/${this.nombreArchivo}`);
      var tarea = this.fireServ.tareaCloudStorage(this.nombreArchivo, f);

      //tomo la referencia de la imagen y creo un troque
      referencia.putString(f, 'base64', { contentType: 'image/jpeg' }).then(async (snapshot) => {
        grupo.imagen = await snapshot.ref.getDownloadURL()
        this.grupo.imagen = await snapshot.ref.getDownloadURL()
        // Creo el grupo
        this.fireServ.createDoc('grupos', this.grupo).then(id => {
          this.grupo.id = id;
          // Agrego el grupo al usuario
          this.fireServ.updateField('grupos', this.grupo, 'usuarios', this.userLogin, 'A')
        })
      })
    } else {
      // Si no creo el grupo y como imagen pongo url de imagen generica
      this.grupo.imagen = 'https://firebasestorage.googleapis.com/v0/b/el-club-del-trueque-f911a.appspot.com/o/noPortada.png?alt=media&token=6ecee70b-2ec6-4bd2-95d1-2a6abeb9b5ab';
      // Creo el grupo
      this.fireServ.createDoc('grupos', this.grupo).then(id => {
        this.grupo.id = id;
        // Agrego el grupo al usuario
        this.fireServ.updateField('grupos', this.grupo, 'usuarios', this.userLogin, 'A',)
      })
    }
    this.closeGrupoABM()
  }
  closeGrupoABM() {
    this.modal.dismiss();
  }

  filtroBuscar = '';
  buscarUser(event){
    const texto = event.target.value;
    this.filtroBuscar = texto;
  }

}
