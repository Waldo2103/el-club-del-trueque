import { Component, HostListener, Input, OnChanges, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, PopoverController } from '@ionic/angular';
import { Grupo } from 'src/app/clases/grupo';
import { AlertasService } from 'src/app/servicios/alertas/alertas.service';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { PerfilComponent } from '../../perfil/perfil.component';
import { PopComponent } from '../../pop/pop.component';
import { GrupoABMComponent } from '../grupo-abm/grupo-abm.component';
import { GrupoComponent } from '../grupo/grupo.component';

@Component({
  selector: 'app-grupo-lista',
  templateUrl: './grupo-lista.component.html',
  styleUrls: ['./grupo-lista.component.scss'],
})
export class GrupoListaComponent implements OnInit, OnChanges {

  public grupos: any = [];
  public gruposBis: any = [];
  public userLogin: any;
  public usuario;
  public userParam: any;
  public modo: string;
  public elimina;

  @Input() opcion: string;




  constructor(
    private fireServ: FirebaseService,
    private modal: ModalController,
    private router: Router,
    private pop: PopoverController,
    private alertServ: AlertasService
  ) { }

  async ngOnInit() {
    console.log("entre en grupo-lista")
    if (localStorage.getItem('userP') !== "" && localStorage.getItem('userP') !== null) {
      this.userParam = JSON.parse(localStorage.getItem('userP'));
    }
    if (this.userParam !== undefined && this.userParam !== "") {
      this.userLogin = this.userParam;
    } else {
      this.userLogin = JSON.parse(localStorage.getItem('userLogin'));
    }
    this.grupos = this.userLogin.grupos;
    console.log("aca la cant de grupos" + this.userLogin.cantGrupos)
  }
  //NO HACE FALTA TRAER GRUPOS PORUE LOS ESTAMOS TOMANDO DEL USUARIO

  ngOnChanges(changes) {

    if (this.opcion === 'Crear Grupo') {
      console.log(changes)
      this.modal.create({
        component: GrupoABMComponent,
        componentProps: {
          modo: "A"
        }
      }).then((modal) => modal.present())

    } else if (this.opcion === 'Unirse a un Grupo') {
      this.router.navigate([''])
    }
  }

  async openGrupo(grupo) {
    console.log(grupo)
    const modal = await this.modal.create({
      component: GrupoComponent,
      componentProps: {
        grupo: grupo
      }
    });
    await modal.present();
    const data = await modal.onWillDismiss().then(async (res: any) => {//res puede trae {action:"verPerfil",datos:this.usuarioP}
      //console.log(res)
      if (res.data != undefined) {
        if (res.data.action === "verPerfil") {
          const modalPe = await this.modal.create({
            component: PerfilComponent,
            componentProps: {
              perfil: res.data.datos
            }
          });
          await modalPe.present()
        }
      }

    })
  }

  async accion(modo: string, grupo: Grupo) {

    try {
      //if (modo === "M") {
        this.modal.create({
          component: GrupoABMComponent,
          componentProps: {
            modo,
            grupo
          }
        }).then((modal) => modal.present()) // AGREGAR QUE CUANDO SE CIERRE ACTUALICE LA LISTA
      //} else if (modo === "B") {
        // AL PEDO XQ FIRESTORE NO ELIMINA POR INDEX Localizamos el indice para removerlo del array grupos de usuario
        /* var elem = (element) => element.id == grupo.id;
        var indice = this.grupos.findIndex(elem); */
        // A futuro esto deberia enviar al componente GrupoABM y ahi solicitar confirmacion del usuario viendo los datos del grupo a eliminar
        let titulo = `Eliminar el grupo ${grupo.nombre}`;
        let mensaje = 'Estas seguro que querés borrarlo de forma permanente? Podés seleccionar otr';
        console.log(this.userLogin)
       /*  const a = await this.alertServ.alertaConfirmacion(titulo, mensaje).then(async resp => {
          if (resp) {
            //grup = JSON.stringify(grup)
            this.fireServ.updateField('grupos', grupo, 'usuarios', this.userLogin.correo, 'B')
            
          } else {
            console.log("ni M ni")
          }

        }); */
      /* } else {
        alert("Error no controlado")
      } */
    } catch (error) {
      console.log("Error no controlado\n" + error)
    }

  }
  /* async presentPopover(ev: any, grupo) {
    const popover = await this.pop.create({
      component: PopComponent,
      cssClass: 'my-custom-class',
      event: ev,
      translucent: true,
      mode: 'md'
    });
    await popover.present();
  
    const { data } = await popover.onWillDismiss();
    if (data != undefined) {
      if (data.item === "Editar") {
        this.modal.create({
          component: GrupoABMComponent,
          componentProps: {
            modo: "M",
            grupo
          }
        }).then((modal) => modal.present())
      }
    }
  
  } */

}
