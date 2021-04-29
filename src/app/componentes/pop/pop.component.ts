import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-pop',
  templateUrl: './pop.component.html',
  styleUrls: ['./pop.component.scss'],
})
export class PopComponent implements OnInit {
  public items = ["Editar"];
  
  constructor(
    private popo: PopoverController,
    private navParams: NavParams
    ) { }

  ngOnInit() {
  }

  onClick(i: number){
    this.items[i]
    this.popo.dismiss({
      item: this.items[i]
    })
  }

}
