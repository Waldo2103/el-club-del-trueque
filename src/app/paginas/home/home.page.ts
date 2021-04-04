import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/servicios/firebase/firebase.service';
import { Producto } from '../../clases/producto/producto';
import { AlertController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ProductoComponent } from 'src/app/componentes/producto/producto.component';
import { producto, ProductosService } from 'src/app/servicios/productos/productos.service';
import { MensajesService } from 'src/app/servicios/mensajes/mensajes.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  public listado: Array<Producto> = [];
  filtroBuscar = '';
  public desplegado:boolean = true;
  public itemSelected /*:Producto*/ = {
    id:'0',
    correo: 'string',
    clave: 'string',
    nombre: 'string',
    domicilio: 'string',
    responsable: 'string',
    telefono: 'string',
    tipo: 'string' ,
    productos: 'string', 
    zonas: 'string', 
    rutaDeFoto: 'string'
  };

  constructor(
    private prodServ: ProductosService, 
    private alertCtrl: AlertController, 
    private router: Router,
    private modal: ModalController,
    private mensServ: MensajesService,
    ) { }

  ngOnInit() {
    //this.mensServ.getMensajesXUsuario(['']);
    this.traerTodos();
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
  public desplegar(item){
    this.itemSelected = item;
    if (this.desplegado === true) {
      this.desplegado = false;
    } else {
      this.desplegado = true;
    }
  }

  buscarProducto(event){
    
    const texto = event.target.value;
    this.filtroBuscar = texto;
  }

  async traerTodos() {
    await this.prodServ.getProductos().subscribe((productsSnapshot) => {
      this.listado = [];
      this.listado = productsSnapshot
      /*productsSnapshot.forEach((productData: any) => {
        this.listado.push(
          {
            id: productData.payload.doc.id,
            nombre: productData.payload.doc.data().nombre,
            owner: productData.payload.doc.data().owner,
            descripcion: productData.payload.doc.data().descripcion,
            etiquetas: productData.payload.doc.data().etiquetas,
            imagen: productData.payload.doc.data().imagen         
        });
        //console.log(this.listado[0].open = true);
      })*/
    });
  }

  openProduct(producto){
    //producto = JSON.stringify(producto);
    //producto = JSON.parse(producto);
    //console.log("producto en open modal"+producto)
    this.modal.create({
      component: ProductoComponent,
      componentProps: {
        producto: producto
      }
    }).then((modal)=>modal.present())
  }

}
