import { Component, OnInit } from '@angular/core';
import { Producto } from '../../clases/producto/producto';
import { ActionSheetController, AlertController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ProductoComponent } from 'src/app/componentes/producto/producto.component';
import { MensajesService } from 'src/app/servicios/mensajes/mensajes.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { UsuariosService } from 'src/app/servicios/usuarios/usuarios.service';
import { AlbumesComponent } from 'src/app/componentes/albumes/albumes.component';
import { NotificacionesService } from 'src/app/servicios/notificaciones/notificaciones.service';
import { PerfilComponent } from 'src/app/componentes/perfil/perfil.component';
import { ProdAltaComponent } from 'src/app/componentes/prod-alta/prod-alta.component';
import { TruequeComponent } from 'src/app/componentes/trueque/trueque.component';
import { FirebaseService } from 'src/app/servicios/firebase.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  public listado: Array<Producto> = [];
  filtroBuscar = '';
  public userLogin;
  public desplegado:boolean = true;
  public pestania: string = "inicio";

  constructor(
    private fireServ: FirebaseService,
    private alertCtrl: AlertController, 
    private router: Router,
    private modal: ModalController,
    private AFauth: AngularFireAuth,
    private userServ: UsuariosService,
    private actionSheetController: ActionSheetController,
    
    ) { }

  ngOnInit() {
    //this.mensServ.getMensajesXUsuario(['']);
    this.traerTodos();
    this.traerUsuario();
  }

  traerUsuario(){
    this.AFauth.authState.subscribe(async res => {
      this.userLogin = res.email;
      this.userServ.getUsuario(this.userLogin).subscribe(pro => {
        this.userLogin = []
        this.userLogin = pro;
        localStorage.setItem("userLogin", JSON.stringify(this.userLogin))
        //let a = localStorage.getItem("userLogin")
        //console.log(a);
      })
    })
    //this.userLogin = localStorage.getItem("userLogin")
  }

  public presentAlert(header: string, subHeader: string, message: string) {
    this.alertCtrl.create({
      header,
      subHeader,
      message,
      buttons: [ 
      {
        text: 'No',
        role: 'Cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'Oka',
        handler: () => {
          this.router.navigate(['/ecomapa']);
          //console.log('Buy clicked');
        }
      }
    ]
    }).then(a => { a.present(); });
  }

  public recarga(){
    this.traerTodos();
  }

  //sin uso, se trajo de organicapp - simula accordion
  /*public desplegar(item){
    this.itemSelected = item;
    if (this.desplegado === true) {
      this.desplegado = false;
    } else {
      this.desplegado = true;
    }
  }*/

  buscarProducto(event){
    const texto = event.target.value;
    this.filtroBuscar = texto;
  }

  async traerTodos() {
    await this.fireServ.getDoc('productos').subscribe((productsSnapshot) => {
      this.listado = [];
      //this.listado = productsSnapshot;
      productsSnapshot.forEach((productData: any) => {
        this.listado.push(
          {
            id: productData.uid,
            nombre: productData.nombre,
            apodo: productData.apodo,
            owner: productData.owner,
            descripcion: productData.descripcion,
            etiquetas: productData.etiquetas,
            imagen: productData.imagen,
            zona: productData.zona,
            album: productData.album,         
        });
      })
    });
  }
  /*Para evitar la dependencia circular:
    abrimos el producto en un modal y para tomar una accion cerramos el modal y abrimos otro*/
  async openProduct(producto){
    const modal = await this.modal.create({
      component: ProductoComponent,
      componentProps: {
        producto: producto
      }
    });
    await modal.present();
    const data = await modal.onWillDismiss().then(async (res:any) =>{//res puede trae {action:"verPerfil",datos:this.usuarioP}
      //console.log(res)
      if (res.data != undefined) {
        if (res.data.action === "verPerfil") {
          const modalPe = await this.modal.create({
            component: PerfilComponent,
            componentProps: {
              perfil: res.data.datos
            }
          });
          await modalPe.present()
        } else if (res.data.action === "trocar") {
          let datos = res.data.datos;
          console.log(datos);
          const modalPe = await this.modal.create({
            component: TruequeComponent,
      componentProps: {
        troqueV: datos[0],
        troqueC: datos[1],
        usuarioL: datos[2],
        usuarioP: datos[3]
      }
          });
          await modalPe.present()
        }
      }
      
    })
  }

  async publicar(){
    const accSheet = await this.actionSheetController.create({
      header: 'Agrega tu Troque',
      cssClass: 'my-custom-class2',
      buttons: [{
        text: 'Sacar Foto',
        icon: 'camera',
        handler: () => {
          this.openCamera('')
        }
      }, {
        text: 'Subir desde Galería',
        icon: 'image',
        handler: () => {
          this.openGallery('')
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
    const  data  = await accSheet.onDidDismiss().then(()=>{
      console.log("cossooooooooooooooooooooooooooovich")
    });
  }

  async openGallery(prod) {
    const modal = await this.modal.create({
      component: ProdAltaComponent,
      componentProps: {
        prod: prod,
        modo: "gallery"
      }
    });
    modal.present();
    const data = await modal.onDidDismiss().then(async res=>{
      if (res.data.action === "verAlbumes") {
        console.log("casaaaaaaaaaaaaavich")
        const modal2 = await this.modal.create({
          component: AlbumesComponent,
          componentProps: {
            usuarioP: res.data.datos
          }
        });
        modal2.present();
      } 
      console.log("cossooooooooooooooooooooooooooovich")
    });
  }

  async openCamera(prod) {
    const modal = await this.modal.create({
      component: ProdAltaComponent,
      componentProps: {
        prod: prod,
        modo: "camera"
      }
    });
    modal.present();
    const data = await modal.onDidDismiss().then(async res=>{
      if (res.data.action === "verAlbumes") {
        console.log("casaaaaaaaaaaaaavich")
        const modal2 = await this.modal.create({
          component: AlbumesComponent,
          componentProps: {
            usuarioP: res.data.datos
          }
        });
        modal2.present();
      } 
      console.log("cossooooooooooooooooooooooooooovich")
    });
  }
  segmentChanged(ev: any) {
    console.log('Segment changed', ev.detail.value);
    this.pestania = ev.detail.value;
  }
  /* public abrirAlbum(modo:string){
    this.modal.create({
      component: AlbumesComponent,
      componentProps: {
        modo: modo
      }
    }).then((modal)=>modal.present())
  } */
}
