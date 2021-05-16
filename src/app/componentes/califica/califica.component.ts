import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ModalController, NavParams } from '@ionic/angular';
import { califica, CalificaService } from 'src/app/servicios/califica/califica.service';
import { trueque, TruequeService } from 'src/app/servicios/trueque/trueque.service';

@Component({
  selector: 'app-califica',
  templateUrl: './califica.component.html',
  styleUrls: ['./califica.component.scss'],
})
export class CalificaComponent implements OnInit {
  public estrellas: number = 0;
  public comentario: string = "";
  public cantCarac: number = 120;
  public califica: califica;
  public trueque: trueque;
  public usuarioL;
  public truequeF;
  public texto;
  constructor(
    private modal: ModalController,
    private navParams: NavParams,
    private calificaServ: CalificaService,
    private truequeServ: TruequeService
  ) { }

  ngOnInit() {
    this.trueque = this.navParams.get("trueque");
    this.usuarioL = this.navParams.get("usuarioL");
    this.truequeF = this.navParams.get("truequeF");
  }

  contador(e){
    this.texto = e.target.value;
    let cantText = this.texto.length;
    this.cantCarac = 120 - cantText;
    //console.log(texto)
  }

  calificar(){
    let uid = "";
    if (this.usuarioL.correo === this.trueque.comprador.owner) {
      uid = this.trueque.vendedor.owner;
    } else if (this.usuarioL.correo === this.trueque.vendedor.owner) {
      uid = this.trueque.comprador.owner;
    } else {
      alert("error al identificar a quien vas a calificar")
    }
    this.comentario = this.texto
    this.califica = {
      usuario: this.usuarioL.correo, //calificador
      uid, //va a ser el calificado
      estrellas: this.estrellas,
      comentario: this.comentario,
    }
    //alert(JSON.stringify(this.truequeF))
    if (this.estrellas > 0) {
      this.calificaServ.createCalifica(this.califica);
      this.truequeServ.updateTruequeFinalizar(this.truequeF);
      this.modal.dismiss()
      
    } else {
      alert("Por favor califica al troquero con estrellas")
    }
    
  }

  cancelar(){
    this.modal.dismiss();
  }

  puntuar(e:number){
    this.estrellas = e;
  }

}
