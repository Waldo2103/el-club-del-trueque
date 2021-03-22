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

  constructor(private alertCtrl: AlertController, private activatedRoute: ActivatedRoute, private authService: AuthService, public router: Router, public toastController: ToastController) { }

  ngOnInit() {
  }
  autocomplete(user: string){
    if (user == "admin") {
      this.email = "admin@admin.com";
      this.password = "111111";
    } else if (user == "invitado") {
      this.email = "invitado@invitado.com";
      this.password = "222222";
    } else if (user == "cristian") {
      this.email = "usuario@usuario.com";
      this.password = "333333";
    } else if (user == "aitu") {
      this.email = "anonimo@anonimo.com";
      this.password = "444444";
    } else if (user == "tester") {
      this.email = "tester@tester.com";
      this.password = "555555";
    } else {
      this.email = "";
      this.password = "";
    }
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

  /*onLoginGoogle(): void {
    this.authService.loginGoogleUser()
      .then((res) => {
        this.onLoginRedirect();
      }).catch(err => console.log('err', err.message));
  }*/
  loginFacebook(): void {
    //this.authService.signInWithPopup(new auth.FacebookAuthProvider());
    this.authService.loginWithFacebook()
    .then(res =>{
      this.router.navigate(['/home']);
    }).catch(err =>{
      alert("hubo un error");
    });
      
  }

  onLoginRedirect(): void {
    this.router.navigate(['home']);
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'los datos son incorrectos o no existe el usuario',
      duration: 2000,
      color: "secondary"
    });
    toast.present();
  }
}
