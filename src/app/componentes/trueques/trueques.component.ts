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
  ) { }
  public userLogin;
  public usuarioP;
  public trueques;
  public truequesP = [];
  public truequesC = [];
  public truequesF = [];
  public pestania: string = "pendientes";
  ngOnInit() {
    this.traerUser()

  }
  segmentChanged(ev: any) {
    console.log('Segment changed', ev.detail.value);
    this.pestania = ev.detail.value;
  }

  traerUser() {
    let userLS = JSON.parse(localStorage.getItem('userLogin'));
    this.AFauth.authState.subscribe(res => {

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
  traerTrueques() {
    
    this.truequeServ.getTruequesXOwner(this.userLogin.correo).subscribe(trueq => {
      this.trueques = trueq;
      //console.log(this.trueques)
      for(let t of this.trueques){
        //console.log(t)
        if (t.estado.trueque === "pendiente") {
          this.truequesP.push(t);
        } else if (t.estado.trueque === "confirmado") {
          this.truequesC.push(t);
          //console.log(this.truequesC)
        } else if (t.estado.trueque === "finalizado") {
          this.truequesF.push(t);
        } else {
          
        }
      }
    })
  }

  openTrueque(trueque) {
    let troqueC = undefined;
    /**validar quien es el userP asi pasar el apodo que esta en trueque.c o v .apodo */
    //console.log(trueque.vendedor.apodo +"dassad"+ trueque.comprador.apodo)
    if (this.userLogin.correo === trueque.comprador.owner) {
      this.usuarioP = {
        apodo: trueque.vendedor.apodo,
        correo: trueque.vendedor.owner
      }
    } else if (this.userLogin.correo === trueque.vendedor.owner) {
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
    }).then((modalT) => { modalT.present(); console.log("creo modal de trueque existente") })
  }
}
