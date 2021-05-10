import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController, NavParams } from '@ionic/angular';
import { Producto } from 'src/app/clases/producto/producto';
import { AlbumesService } from 'src/app/servicios/albumes/albumes.service';
import { producto, ProductosService } from 'src/app/servicios/productos/productos.service';
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
  public troque: producto;
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

  openProduct(producto){
    
    if (!this.enTrueque) {
      this.modalP.create({
      component: ProductoComponent,
      componentProps: {
        producto: producto
      }
    }).then((modal)=>modal.present())
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

  public alertaConfirmacion(header: string, troque: producto, message: string) {
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
