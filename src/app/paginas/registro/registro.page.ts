import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../servicios/auth.service';
import { Cliente } from '../../clases/cliente/cliente';
//import { Anonimo } from '../../clases/anonimo';
//import { Herramientas } from '../../clases/herramientas/herramientas';
//import { CajaSonido } from '../../clases/cajaSonido';

import * as firebase from 'firebase';
//import { Camera } from '@ionic-native/camera/ngx';
//import { CameraOptions } from '@ionic-native/camera';
//import { BarcodeScannerOptions, BarcodeScanResult, BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { AlertController, MenuController } from '@ionic/angular';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  form: FormGroup;
  validation_messages = {
    'mail': [
      { type: 'required', message: 'Debe ingresar un email.' },
      { type: 'email', message: 'Debe ingresar un email válido.' }
    ],
    'password': [
      { type: 'required', message: 'Debe ingresar una contraseña.' }
    ],
    'password2': [
      {type:'required', message:'Lo ingresado debe coincidir con la contraseña anterior.'}
    ]
  };

 mail:string;
 password:string;
 password2:string;
  modalText: string;

  constructor(private authService: AuthService,
    //private resulService: ResultadosService,
    private alertCtrl: AlertController,
    private ctrl: MenuController,
    private router: Router, private formBuilder: FormBuilder) { // private toastService: ToastrService

      this.form = this.formBuilder.group({
        mail: new FormControl('', Validators.compose([
          Validators.required,
          Validators.email
        ])),
        password: new FormControl('', Validators.compose([
          Validators.required,
          Validators.min(6)
        ])),
        password2: new FormControl('', Validators.compose([
          Validators.required,
          Validators.min(6)
        ])),
        nombre: new FormControl('', Validators.required),
        apellido: new FormControl('', Validators.required)
      });
      this.usuario = new Cliente();

    }

ngOnInit() {
  this.usuario = new Cliente();
  this.ctrl.enable(false);
}
loguear(user: any){
  //this.resulService.createLog(user);
  //localStorage.setItem("email", user.email)//no esta en uso
}
private usuario: Cliente;

public presentAlert(header: string, subHeader: string, message: string) {
  this.alertCtrl.create({
    header,
    subHeader,
    message,
    buttons: ['OK']
  }).then(a => { a.present(); });
}

public RegistrarCliente() {
   
  this.authService.RegistrarClienteDatos(this.usuario, this.password).then(auth => {
    this.usuario = new Cliente();
    this.password = '';
    //this.ocultarSeccion0 = false;
    //this.ocultarSeccion1 = true;
    //this.ocultarSeccion2 = true;
    this.presentAlert('Exito!', null, '¡Usted ha sido registrado!');
  }).catch(err => {
    this.presentAlert('¡Error!', 'Error en el registro.', 'Error en base de datos.');
    console.log(err);
  });
}

OnSubmitRegister(){
  if (this.form.get('password').value === this.form.get('password2').value) {
    this.authService.registerUser(this.form.get('mail').value, this.form.get('password').value).then( authService => {
      //LET F SIRVE EN EL FUTURO SI SE QUIERE PERSISTIR DATOS DEL USUARIO
      let f = new Date;
        var fec: string = f.getDate()+"/"+f.getMonth()+"/"+f.getUTCFullYear()+" - "+f.getUTCHours()+":"+f.getUTCMinutes()+":"+f.getUTCSeconds();
        let data = { email: this.form.get('mail').value,fec}
        //this.loguear(data);//no esta en uso
        //localStorage.setItem("email", this.form.get('mail').value);//no esta en uso
        this.RegistrarCliente();
        this.presentAlert('Exito!', null, '¡Usted ha sido registrado!');
      //this.router.navigate(['/send-email']);//Esta linea se habilita cuando se agregue envio de mail
      this.ctrl.enable(true)
      this.router.navigate(['home'])
    }).catch(error => {
      (<HTMLButtonElement>document.getElementById('btnModal')).click();
      if (error.code === 'auth/email-already-in-use') {
        this.presentAlert('¡Error!',"","El usuario ya existe!");
        //this.toastService.error('Usuario no encontrado.');
      } else if (error.code === 'auth/wrong-password') {
        this.presentAlert('¡Error!',"","Contraseña incorrecta.");
        //this.toastService.error('Contraseña incorrecta.');
      } else {
        console.log(error.code,". ERROR CODE")
        this.presentAlert('¡Error!', 'Error en el registro.', 'Ocurrió un error con el servidor.');
      }
    }/*err=> alert('los datos son incorrectos', err.code)*/);
  } else {
    this.presentAlert('¡Error!', 'Error en el registro.', 'Las contraseñas no coinciden');
  }
  
}
}
