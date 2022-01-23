import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-pop',
  templateUrl: './pop.component.html',
  styleUrls: ['./pop.component.scss'],
})
export class PopComponent implements OnInit {
  public items = ["Editar"];
  public modo;
  
  constructor(
    private popo: PopoverController,
    private navParams: NavParams
    ) { }

  ngOnInit() {
    this.modo = this.navParams.get('modo');
    if (this.modo === 'grupos') {
      this.items = ['Crear Grupo', 'Unirse a un Grupo']
    } else {
      this.items = ["Editar"];
    }
  }

  onClick(i: number){
    this.items[i]
    this.popo.dismiss({
      item: this.items[i]
    })
  }

}
