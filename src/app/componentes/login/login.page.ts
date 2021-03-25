import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../servicios/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

import { ToastController, AlertController } from '@ionic/angular';

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

  constructor(private alertCtrl: AlertController, private activatedRoute: ActivatedRoute, private authService: AuthService, public router: Router, public toastController: ToastController) { }

  ngOnInit() {
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
    try {
      const user = await this.authService.login(this.email, this.password);
      if (user /*&& user.user.emailVerified*/) {
        this.router.navigate(['/home']);
      } /*else if(user) {
        this.router.navigate(['/send-email']);
      }*/else {
        this.presentAlert('Error!', null, '¡Los datos ingresados NO son válidos!');
        //this.router.navigate(['/registro-cliente']);
      }
    } catch (error) {
      this.presentAlert('Error!', null, '¡Los datos ingresados NO son válidos!');
    }
    /*this.folder = this.activatedRoute.snapshot.paramMap.get('id')
    //console.log(this.email,"----", this.password)
    const user = await this.authService.login(this.email, this.password).then(res => {
      
      this.router.navigate(['/folder/Inbox']);
    }).catch(err => {
      console.log(err)
      //alert('los datos son incorrectos o no existe el usuario');
      // Implementar toast
      this.presentToast()
    })
    */
  }

  
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

  public sesion(){
    if (this.mostrar === true) {
      this.mostrar = false
    } else {
      this.mostrar = true
    }
  }
  
}
