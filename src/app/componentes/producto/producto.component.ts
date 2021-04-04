import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { ModalController, NavParams } from '@ionic/angular';
import { mensaje, MensajesService } from 'src/app/servicios/mensajes/mensajes.service';
import { ProductosService } from 'src/app/servicios/productos/productos.service';
import { UsuariosService } from 'src/app/servicios/usuarios/usuarios.service';
import { message } from "../../models/message";
import { ChatComponent } from '../chat/chat.component';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.scss'],
})
export class ProductoComponent implements OnInit {

  public userLogin: string;
  public prod: any;
  public producto: any;
  public usuarioL: any;
  public usuarioP: any = [];
  public msg: message;

  constructor(
    public modal: ModalController,
    public modalChat: ModalController,
    private AFauth: AngularFireAuth,
    private navParams: NavParams,
    private prodServ: ProductosService,
    private userServ: UsuariosService,
    private mensServ: MensajesService,
    private router: Router

  ) { }

  ngOnInit() {
    this.traerUserLogin()
    //this.traerProducto();
    //this.traerOwnerProduct();
  }

  traerUserLogin(){
    this.AFauth.authState.subscribe(res =>{
      this.userLogin = res.email
      this.userServ.getUsuario(this.userLogin).subscribe( user =>{
        this.usuarioL = user;
        //console.log(user)
      })
      this.traerProducto();
    this.traerOwnerProduct();
    });

    
  }
  async traerProducto(){
    this.prod = this.navParams.get('producto')
    //console.log(this.prod)
    this.prodServ.getProducto(this.prod.id).subscribe( pro =>{
      this.producto = pro;
      //console.log(pro)
      
    })
    
  }

  async traerOwnerProduct(){
    //console.log(this.prod.owner)
    this.userServ.getUsuario(this.prod.owner).subscribe( userP =>{
      this.usuarioP = userP;
      //console.log(this.usuarioP)
    })
  }


  crearChat(){
    //this.usuarioP = JSON.stringify(this.usuarioP)
    //console.log(this.usuarioL+ this.usuarioP)
    let data: mensaje = {
      nombre: [this.usuarioL.nombre,this.usuarioP.nombre],
      descripcion: '',
      id: [this.usuarioL.correo,this.usuarioP.correo],
      imagen: [this.usuarioL.foto,this.usuarioP.foto],
      uid: ``/*,
      messages: this.msg {
        content: "",
        type: "",   //ENCONTRAR COMO PPASAR ESTE VALOR QUE ROMPE TO, PROBAR NO PASANDOLO Y SACAN
        date: new Date(),
        owner: ""
      }*/
    }
    console.log(data)
    this.mensServ.createMensajes(data)
    //this.router.navigate['folder/Mensajes']
    this.modal.dismiss()
    this.modalChat.create({
      component: ChatComponent,
      componentProps: {
        data: data
      }
    }).then((modalC)=>modalC.present())
  }

  closeProduct(){
    this.modal.dismiss()
  }

}
