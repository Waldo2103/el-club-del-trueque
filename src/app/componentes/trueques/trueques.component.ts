import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ModalController } from '@ionic/angular';
import { TruequeService } from 'src/app/servicios/trueque/trueque.service';
import { UsuariosService } from 'src/app/servicios/usuarios/usuarios.service';
import { TruequeComponent } from '../trueque/trueque.component';

@Component({
  selector: 'app-trueques',
  templateUrl: './trueques.component.html',
  styleUrls: ['./trueques.component.scss'],
})
export class TruequesComponent implements OnInit {
  constructor(
    private truequeServ: TruequeService,
    private modalTrueque: ModalController,
    private AFauth: AngularFireAuth,
    private userServ: UsuariosService
  ) {}
    public userLogin;
    public usuarioP;
    public trueques;
  ngOnInit() {
    this.traerUser()
    
  }

  traerUser(){
    let userLS = JSON.parse(localStorage.getItem('userLogin'));
    this.AFauth.authState.subscribe(res =>{
      
      if (res.email === userLS) {
        this.userLogin = res.email
      } else {
        this.userServ.getUsuario(res.email).subscribe(pro => {
          this.userLogin = pro;
          this.traerTrueques();
        })
      }
    });
  }
  traerTrueques(){
    console.log(this.userLogin)
    this.truequeServ.getTruequesXOwner(this.userLogin.correo).subscribe(trueq=>{
      this.trueques = trueq;
    })
  }

  openTrueque(trueque){
    let troqueC = undefined;
    /**validar quien es el userP asi pasar el apodo que esta en trueque.c o v .apodo */
    //console.log(trueque.vendedor.apodo +"dassad"+ trueque.comprador.apodo)
    if (this.userLogin.correo === trueque.comprador.owner) {
      this.usuarioP = {
        apodo: trueque.vendedor.apodo,
        correo: trueque.vendedor.owner
      }
    } else if(this.userLogin.correo === trueque.vendedor.owner){
      this.usuarioP = {
        apodo: trueque.comprador.apodo,
        correo: trueque.comprador.owner
      }
    }
    
    this.modalTrueque.create({
      component: TruequeComponent,
      componentProps: {
        /* troqueV:trueque.vendedor,
        troqueC: trueque.comprador,
        truequeEstado: trueque.estado, */
        usuarioL: this.userLogin,
        usuarioP: this.usuarioP,
        trueque: trueque
        //uid: trueque.uid
      }
    }).then((modalT)=>{modalT.present();console.log("creo modal de trueque existente")})
  }
}
