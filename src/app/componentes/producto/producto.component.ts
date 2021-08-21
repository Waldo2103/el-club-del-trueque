import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { ModalController, NavParams } from '@ionic/angular';
import { mensaje, MensajesService } from 'src/app/servicios/mensajes/mensajes.service';
import { producto, ProductosService } from 'src/app/servicios/productos/productos.service';
import { trueque } from 'src/app/servicios/trueque/trueque.service';
import { UsuariosService } from 'src/app/servicios/usuarios/usuarios.service';
import { message } from "../../models/message";
import { ChatComponent } from '../chat/chat.component';
//import { PerfilComponent } from '../perfil/perfil.component';
//import { TruequeComponent } from '../trueque/trueque.component';

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
  public uidChat: string;
  public ownerOfProduct: boolean = true;

  constructor(
    public modal: ModalController,
    public modalChat: ModalController,
    public modalChatEx: ModalController,
    public modalPerfil: ModalController,
    public modalTrueque: ModalController,
    private AFauth: AngularFireAuth,
    private navParams: NavParams,
    private prodServ: ProductosService,
    private userServ: UsuariosService,
    private mensServ: MensajesService,
    private router: Router

  ) { }

  ngOnInit() {
    this.traerUserLogin()
  }

  traerUserLogin(){
    this.AFauth.authState.subscribe(res =>{
      this.userLogin = res.email
      this.userServ.getUsuario(this.userLogin).subscribe( user =>{
        this.usuarioL = user;
      })
      this.traerProducto();
    this.traerOwnerProduct();
    });

    
  }
  async traerProducto(){
    this.prod = this.navParams.get('producto')
    this.prodServ.getProducto(this.prod.id).subscribe( pro =>{
      this.producto = pro;
      this.producto.id = this.prod.id;
      //console.log(JSON.stringify(pro)+"al traer producto")
    })
    
  }

  async traerOwnerProduct(){
    this.userServ.getUsuario(this.prod.owner).subscribe( userP =>{
      this.usuarioP = userP;
    if (this.usuarioL.correo === this.usuarioP.correo) {
      this.ownerOfProduct = true;
    } else if (this.usuarioL.correo != this.usuarioP.correo) {
      this.ownerOfProduct = false;
    }
    })
    
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
          this.modalChatEx.create({
            component: ChatComponent,
            componentProps: {
              chat: chatE
            }
          }).then((modalE)=>{modalE.present();this.modal.dismiss();console.log("creo modal de chat exist")})
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
          /* messages:  {
            content: "",
            type: "",   
            date: new Date(),
            owner: ""
          } */
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
        this.modalChat.create({
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

  verPerfil(){
    const data = {action:"verPerfil",datos:this.usuarioP}
    this.modal.dismiss(data);//cierro el modal y en AlbumComponent y HomePage los derivo a Perfil
    /* this.modalPerfil.create({
      component: PerfilComponent,
      componentProps: {
        perfil: this.usuarioP
      }
    }).then((modalP)=>{modalP.present();this.modal.dismiss();console.log("creo modal de perfil nuevo")}) */
  }

  closeProduct(){
    this.modal.dismiss()
  }

  trocar(troqueV){
    console.log(troqueV)
    let troqueC = undefined;
    /* this.modalTrueque.create({
      component: TruequeComponent,
      componentProps: {
        troqueV,
        troqueC,
        usuarioL: this.usuarioL,
        usuarioP: this.usuarioP
      }
    }).then((modalP)=>{modalP.present();this.modal.dismiss();console.log("creo modal de trueque nuevo")}) */
  }

}
