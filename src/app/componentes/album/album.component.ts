import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavParams } from '@ionic/angular';
import { Producto } from 'src/app/clases/producto/producto';
import { AlbumesService } from 'src/app/servicios/albumes/albumes.service';
import { ProductoComponent } from '../producto/producto.component';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.scss'],
})
export class AlbumComponent implements OnInit {

  public alb: any;
  public album: Array<Producto> = [];
  public usuarioL: any;
  public usuarioP: any = [];
  public uidChat: string;
  public ownerOfAlbum: boolean = true;
  filtroBuscar = '';

  constructor(
    public modal: ModalController,
    public modalP: ModalController,
    //private AFauth: AngularFireAuth,
    private navParams: NavParams,
    private albServ: AlbumesService,
    //private userServ: UsuariosService,
    private router: Router

  ) { }

  ngOnInit() {
    //console.log("aaaa"+this.album.length)
    this.traerAlbum()
  }

  traerAlbum() {
    this.alb = this.navParams.get('album')
    //console.log("aaaa"+this.alb)
    this.albServ.getAlbum(this.alb.id).subscribe(al => {
      this.album = al;
      //console.log("bbbb" + JSON.stringify(al))
    })

  }

  buscarProducto(event){
    const texto = event.target.value;
    this.filtroBuscar = texto;
  }

  openProduct(producto){
    //producto = JSON.stringify(producto);
    //producto = JSON.parse(producto);
    //console.log("producto en open modal"+producto)
    this.modalP.create({
      component: ProductoComponent,
      componentProps: {
        producto: producto
      }
    }).then((modal)=>modal.present())
  }

  closeAlbum(){
    this.modal.dismiss()
  }

}
