import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ModalController, NavParams } from '@ionic/angular';
import { AlbumesService } from 'src/app/servicios/albumes/albumes.service';
import { UsuariosService } from 'src/app/servicios/usuarios/usuarios.service';
import { AlbumComponent } from '../album/album.component';
import { ProdAltaComponent } from '../prod-alta/prod-alta.component';

@Component({
  selector: 'app-albumes',
  templateUrl: './albumes.component.html',
  styleUrls: ['./albumes.component.scss'],
})
export class AlbumesComponent implements OnInit {
  public albumes: any = [];
  public albumesBis: any = [];
  public userLogin: any;
  public usuario;
  public userParam: any;
  constructor(
    private albServ: AlbumesService,
    private modal: ModalController,
    private modalP: ModalController,
    private userServ: UsuariosService,
    private navParams: NavParams
  ) { }

  async ngOnInit() {
    this.userParam = await this.navParams.get('usuarioP');
    if (this.userParam !== undefined) {
      this.userLogin = this.userParam;
    } else {
      this.userLogin = JSON.parse(localStorage.getItem('userLogin'));
    }
    this.traerAlbumes()
  }

  traerAlbumes() {
      let uns = this.albServ.getAlbumesXUsuario(this.userLogin.correo).subscribe(albumes => {
        this.albumes = []
        this.albumes = albumes
        //console.log(this.albumes)
        this.userServ.getUsuario(this.userLogin.correo).subscribe(pro => {
          this.usuario = []
          this.usuario = pro;
          //uns.unsubscribe() LO COMENTO PORQUE SINO CUANDO SE CREA UNO NUEVO NO SE ACTUALIZA EL LISTADO
        })
      });


  }

  openAlbum(album){
    this.modalP.create({
      component: AlbumComponent,
      componentProps: {
        album: album,
        userLogin: this.userLogin
      }
    }).then((modal)=>modal.present())
  }

  openGallery(prod){
    this.modal.create({
      component: ProdAltaComponent,
      componentProps: {
        prod: prod,
        modo: "gallery"
      }
    }).then((modal)=>modal.present())
  }

  openCamera(prod){
    this.modal.create({
      component: ProdAltaComponent,
      componentProps: {
        prod: prod,
        modo: "camera"
      }
    }).then((modal)=>modal.present())
  }
//sirve solo cuando se entra a ver el perfil de otro usuario
  closeAlbum(){
    this.modal.dismiss()
  }

}
