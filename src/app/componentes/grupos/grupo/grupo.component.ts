import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { PerfilComponent } from '../../perfil/perfil.component';
import { ProductoComponent } from '../../producto/producto.component';
import { TruequeComponent } from '../../trueque/trueque.component';

@Component({
  selector: 'app-grupo',
  templateUrl: './grupo.component.html',
  styleUrls: ['./grupo.component.scss'],
})
export class GrupoComponent implements OnInit {

  public gru: any;
  public grupo: any;
  public integrantes = [];
  public usuarioP: any = [];
  public listado = [];
  filtroBuscar = '';
  constructor(
    public modal: ModalController,
    private modal2: ModalController,
    private navParams: NavParams,
    private fireServ: FirebaseService,
  ) { }

  ngOnInit() {
    console.log("entre a grupo")
    this.traerGrupo();
    this.traerProdDeGgrupo();
  }
  async traerGrupo(){
    this.gru = this.navParams.get('grupo');
    
    this.fireServ.getDocId<any>('grupos',this.gru.id).subscribe( gr =>{
      this.grupo = gr;
      this.grupo.id = this.gru.id;
      //console.log(JSON.stringify(gr)+"al traer grupo")
      this.integrantes = this.grupo.integrantes;
      console.log(this.grupo)
    })
  }
  buscarProducto(event){
    const texto = event.target.value;
    this.filtroBuscar = texto;
  }
  async traerProdDeGgrupo() {
    //se arma esteobjeto porque es lo que espera el where. Un objeto que contenga esto
    let grupoWhere = {
      id: this.grupo.id,
      nombre: this.grupo.nombre
    }
    console.log(grupoWhere)
    await this.fireServ.getDocWhere('productos','grupos', 'array-contains', grupoWhere).subscribe((productsSnapshot) => {
      this.listado = [];
      productsSnapshot.forEach((productData: any) => {
        //console.log(productData.uid)
        this.listado.push(
          {
            id: productData.uid,
            nombre: productData.nombre,
            apodo: productData.apodo,
            owner: productData.owner,
            descripcion: productData.descripcion,
            etiquetas: productData.etiquetas,
            imagen: productData.imagen,
            zona: productData.zona,
            album: productData.album,         
        });
      })
    });
  }
  async openProduct(producto){
    const modal = await this.modal2.create({
      component: ProductoComponent,
      componentProps: {
        producto: producto
      }
    });
    await modal.present();
    const data = await modal.onWillDismiss().then(async (res:any) =>{//res puede trae {action:"verPerfil",datos:this.usuarioP}
      //console.log(res)
      if (res.data != undefined) {
        if (res.data.action === "verPerfil") {
          const modalPe = await this.modal2.create({
            component: PerfilComponent,
            componentProps: {
              perfil: res.data.datos
            }
          });
          await modalPe.present()
        } else if (res.data.action === "trocar") {
          let datos = res.data.datos;
          console.log(datos);
          const modalPe = await this.modal2.create({
            component: TruequeComponent,
      componentProps: {
        troqueV: datos[0],
        troqueC: datos[1],
        usuarioL: datos[2],
        usuarioP: datos[3]
      }
          });
          await modalPe.present()
        }
      }
      
    })
  }
  closeGrupo(){
    this.modal.dismiss()
  }
  verPerfil(){
    const data = {action:"verPerfil",datos:this.usuarioP}
    this.modal.dismiss(data);//cierro el modal y en AlbumComponent y HomePage los derivo a Perfil
  }

}
