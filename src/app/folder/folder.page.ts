import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { PopComponent } from '../componentes/pop/pop.component';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  public folder: string;
  public opcion: string;

  constructor(private activatedRoute: ActivatedRoute,
    private pop: PopoverController
    ) { }

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');
  }

  async presentPopover(ev: any) {
    const popover = await this.pop.create({
      component: PopComponent,
      cssClass: '../componentes/pop/pop.component.scss',
      componentProps: {modo: 'grupos'},
      event: ev,
      translucent: true,
      mode: 'md'
    });
    await popover.present();
  
    const { data } = await popover.onWillDismiss();
   
    if (data != undefined) { //'Crear Grupo', 'Unirse a un Grupo'
      this.opcion = data.item;
      
    }
  
  }

}
