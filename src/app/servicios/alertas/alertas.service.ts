import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { producto } from '../productos/productos.service';

@Injectable({
  providedIn: 'root'
})
export class AlertasService {

  constructor(
    public alertCtrl: AlertController
  ) { }
  public alertaConfirmacion(header: string, troque: producto, message: string) {
    this.alertCtrl.create({
      header,
      message,
      buttons: [ 
      {
        text: 'No',
        role: 'Cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'Si',
        handler: () => {
          //this.troque = troque;
          //this.closeAlbum()
          //console.log('Buy clicked');
        }
      }
    ]
    }).then(a => { a.present(); });
  }
}
