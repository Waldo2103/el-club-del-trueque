import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../servicios/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

import { ToastController, AlertController, MenuController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email: string;
  password: string;
  public folder: string;
  public mostrar = false;

  constructor(private ctrl: MenuController, 
    private alertCtrl: AlertController,
     private activatedRoute: ActivatedRoute, 
     private authService: AuthService, 
     public router: Router, 
     public toastController: ToastController,
     private loadingCtrl: LoadingController
     ) { }

     enLogin: boolean;

  ngOnInit() {
    this.ctrl.enable(false);
  }
  

  public presentAlert(header: string, subHeader: string, message: string) {
    this.alertCtrl.create({
      header,
      subHeader,
      message,
      buttons: ['OK']
    }).then(a => { a.present(); });
  }

  async OnSubmitLogin() {
    const loading = await this.loadingCtrl.create();
    await loading.present();
    try {
      const user = await this.authService.login(this.email, this.password).then(res =>{
        loading.dismiss();
        if (res /*&& user.user.emailVerified*/) {
          this.ctrl.enable(true);
          this.router.navigate(['/home']);
        } /*else if(user) {
          this.router.navigate(['/send-email']);
        }*/else {
          this.presentAlert('Error!', null, '¡Los datos ingresados NO son válidos!');
          //this.router.navigate(['/registro-cliente']);
        }
      });
      
      
    } catch (error) {
      loading.dismiss();
      this.presentAlert('Error!', null, '¡Los datos ingresados NO son válidos!');
    }
  }

  /*presentLoadingDefault() {
    let loading = this.loadingCtrl.create({
      spinner: 'dots'
    });
  
    loading.present();
  
    setTimeout(() => {
      loading.dismiss();
    }, 5000);
  }*/
  
  loginGoogle(): void {
    this.authService.loginWithGoogle()
    .then(() =>{
      this.router.navigate(['/home']);
    }).catch(err =>{
      this.presentAlert('Error!', null, '¡Se produjo un error!');
    });
      
  }
  loginFacebook(): void {
    this.authService.loginWithFacebook()
    .then(res =>{
      this.router.navigate(['/home']);
    }).catch(err =>{
      this.presentAlert('Error!', null, '¡Se produjo un error!');
    });
      
  }

  onLoginRedirect(): void {
    this.router.navigate(['home']);
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'los datos son incorrectos o no existe el usuario',
      duration: 2000,
      color: "danger"
    });
    toast.present();
  }
//Muestra para ingresar  las credenciales
  public sesion(){
    if (this.mostrar === true) {
      this.mostrar = false
    } else {
      this.mostrar = true
    }
  }
  
}
