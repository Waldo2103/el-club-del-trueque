import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertasService {
  constructor(
    public alertCtrl: AlertController
  ) { }
  //Se muestra un titulo, un mensaje y las opciones Si y No
  async alertaConfirmacion(header: string, message: string, buttons:Array<string>) {
    var resp: Boolean;

    const alCont = await this.alertCtrl.create({
      header,
      message,
      buttons: [ 
      {
        text: buttons[1],
        handler: () => {
          resp = false;
        }
      },
      {
        text: buttons[0],
        handler: () => {
          resp = true;
        }
      }
    ]
    })
    await alCont.present()
    await alCont.onWillDismiss().then( () =>{
        return resp;
      }
    );
    return resp;
  }

  async alertaInformacion(header: string, message: string, button:string) {
    var resp: Boolean;

    const alCont = await this.alertCtrl.create({
      header,
      message,
      buttons: [ 
      {
        text: button,
        handler: () => {
          resp = true;
        }
      }
    ]
    })
    await alCont.present()
    await alCont.onWillDismiss().then( () =>{
        return resp;
      }
    );
    return resp;
  }
}