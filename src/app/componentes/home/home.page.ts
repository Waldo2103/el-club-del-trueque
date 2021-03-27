import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/servicios/firebase/firebase.service';
import { Producto } from '../../clases/producto/producto';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

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
    private firebaseService: FirebaseService, 
    private alertCtrl: AlertController, 
    private router: Router
    ) { }

  ngOnInit() {
    this.traerTodos();
  }

  public presentAlert(header: string, subHeader: string, message: string) {
    this.alertCtrl.create({
      header,
      subHeader,
      message,
      buttons: [ 
      {
        text: 'Nop',
        role: 'cancel',
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
    await this.firebaseService.getProductos().subscribe((productsSnapshot) => {
      this.listado = [];
      productsSnapshot.forEach((productData: any) => {
        this.listado.push(
          {
            id: productData.payload.doc.id,
            nombre: productData.payload.doc.data().nombre,
            duenio: productData.payload.doc.data().duenio,
            descripcion: productData.payload.doc.data().descripcion,
            zona: productData.payload.doc.data().zona,
            rutaDeFoto: productData.payload.doc.data().rutaDeFoto         
        });
        //console.log(this.listado[0].open = true);
      })
    });
  }

}
