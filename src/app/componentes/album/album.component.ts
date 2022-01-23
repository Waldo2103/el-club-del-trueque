import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController, NavParams } from '@ionic/angular';
import { Producto } from 'src/app/clases/producto/producto';
import { AlbumesService } from 'src/app/servicios/albumes/albumes.service';
import { ProductosService } from 'src/app/servicios/productos/productos.service';
import { PerfilComponent } from '../perfil/perfil.component';
import { ProductoComponent } from '../producto/producto.component';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.scss'],
})
export class AlbumComponent implements OnInit {

  public alb: any;
  public album: Array<Producto> = [];
  public ownerAlbum: any;
  public usuarioP: any;
  public uidChat: string;
  public ownerOfAlbum: boolean = true;
  filtroBuscar = '';
  public enTrueque: boolean = false;
  public troque: Producto;
  public userLogin;

  constructor(
    public modal: ModalController,
    public modalP: ModalController,
    //private AFauth: AngularFireAuth,
    private navParams: NavParams,
    private albServ: AlbumesService,
    //private userServ: UsuariosService,
    private router: Router,
    private alertCtrl: AlertController,
    private prodServ: ProductosService

  ) { }

  ngOnInit() {
    //console.log("aaaa"+this.album.length)
    this.traerAlbum()
    this.enTrueque = this.navParams.get("enTrueque");
    
    console.log(this.enTrueque+"asi quedo en trueque, si sale undefined agregar valdiacion")
  }

  traerAlbum() {
    this.alb = this.navParams.get('album')
    this.ownerAlbum = this.navParams.get("ownerAlbum");
    this.userLogin = this.navParams.get("userLogin");//NO SE ESTA USANDO PERO SE PODRIA PASAR A PRODUCTO
    if (this.alb === undefined) {
      this.ownerOfAlbum = false;
      this.prodServ.getProductosXOwner(this.ownerAlbum).subscribe(prods=>{
        this.album = prods;
      })
    } else {
      this.ownerOfAlbum = true;
      this.albServ.getAlbum(this.alb.id).subscribe(al => {
      this.album = al;
    })
    }
    

  }

  buscarProducto(event){
    const texto = event.target.value;
    this.filtroBuscar = texto;
  }

  async openProduct(producto){
    
    if (!this.enTrueque) {
      const modal = await this.modalP.create({
      component: ProductoComponent,
      componentProps: {
        producto: producto
      }
    });//.then((modal)=>modal.present())
    await modal.present();
    const data = await modal.onWillDismiss().then(async (res:any) =>{//res puede trae {action:"verPerfil",datos:this.usuarioP}
      if (res.data.action === "verPerfil") {
        const modalPe = await this.modal.create({
          component: PerfilComponent,
          componentProps: {
            perfil: res.data.datos
          }
        });//.then((modalP)=>{modalP.present();this.modal.dismiss();console.log("creo modal de perfil nuevo")})
        await modalPe.present()
      }
      
    })

    }
    
  }

  closeAlbum(){
    if(this.enTrueque){
      this.modal.dismiss({data:this.troque})
    }else{
      this.modal.dismiss()
    }
  }

  aTrueque(troque){
    this.alertaConfirmacion("Selección de Troque",troque,"¿Estás seguro de que esto es lo que querés trocar?")
  }

  public alertaConfirmacion(header: string, troque: Producto, message: string) {
    this.alertCtrl.create({
      header,
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
        text: 'Si',
        handler: () => {
          this.troque = troque;
          this.closeAlbum()
          //console.log('Buy clicked');
        }
      }
    ]
    }).then(a => { a.present(); });
  }

}
