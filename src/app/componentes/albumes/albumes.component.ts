import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
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
  public modo: string;
  constructor(
    private albServ: AlbumesService,
    private modal: ModalController,
    private modalP: ModalController,
    private userServ: UsuariosService,
    private navParams: NavParams,
    private router: Router,
    private location: Location
  ) { }

  async ngOnInit() {
    if (localStorage.getItem('userP') !== "") {
      this.userParam = JSON.parse(localStorage.getItem('userP'));
    }
    if (this.userParam !== undefined && this.userParam !== "") {
      //SE MODIFICÓ, SE TOMARÁ POR LOCALSTORAGE
      this.userLogin = this.userParam;
    } else {
      this.userLogin = JSON.parse(localStorage.getItem('userLogin'));
    }
    this.traerAlbumes()
    this.modo = await this.navParams.get('modo');
    if (this.modo != undefined) {
      setTimeout(() => {
        if (this.modo === 'cam') {
          this.openCamera({})
        } else if (this.modo === 'gal') {
          this.openGallery({})
        }
      }, 2000);

    }
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

  async openAlbum(album) {
    const modal = await this.modalP.create({
      component: AlbumComponent,
      componentProps: {
        album: album,
        userLogin: this.userLogin
      }
    });
    await modal.present()
    const data = await modal.onWillDismiss().then(res =>{
      //recargar el album
    })
  }

  openGallery(prod) {
    console.log(prod)
    this.modal.create({
      component: ProdAltaComponent,
      componentProps: {
        prod: prod,
        modo: "gallery"
      }
    }).then((modal) => modal.present())
  }

  openCamera(prod) {
    console.log(prod)
    this.modal.create({
      component: ProdAltaComponent,
      componentProps: {
        prod: prod,
        modo: "camera"
      }
    }).then((modal) => modal.present())
  }
  //sirve solo cuando se entra a ver el perfil de otro usuario
  closeAlbum() {
    localStorage.setItem("userP", "")
    //this.modal.dismiss()
    //this.router.navigate(['/folder/Perfil'] )
    this.location.back();
  }

}
