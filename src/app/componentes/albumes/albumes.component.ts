import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ModalController } from '@ionic/angular';
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
  public userLogin: string;
  public usuario;
  constructor(
    private albServ: AlbumesService,
    private modal: ModalController,
    private AFauth: AngularFireAuth,
    private userServ: UsuariosService
  ) { }

  ngOnInit() {
    this.traerUserLogin()
  }

  traerUserLogin() {
    this.AFauth.authState.subscribe(async res => {
      this.userLogin = res.email

      let uns = await this.albServ.getAlbumesXUsuario(this.userLogin).subscribe(albumes => {
        this.albumes = []
        this.albumes = albumes
        //console.log(this.albumes)
        this.userServ.getUsuario(this.userLogin).subscribe(pro => {
          this.usuario = []
          this.usuario = pro;
          //this.validacionChat();
          uns.unsubscribe()
        })
      });

    });

  }

  openAlbum(album){
    //console.log("genial")
    this.modal.create({
      component: AlbumComponent,
      componentProps: {
        album: album
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

}
