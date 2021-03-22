import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Cliente, ClienteAConfirmar, ClienteKey } from '../clases/cliente/cliente';
import { Router } from '@angular/router';


import * as firebase from 'firebase/app';

import { AngularFirestore, QuerySnapshot, DocumentSnapshot } from '@angular/fire/firestore';

import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public AFauth: AngularFireAuth, public router: Router, private db: AngularFirestore, private face: Facebook) { }

  async sendVerificationEmail(): Promise<void>{
    return (await this.AFauth.currentUser).sendEmailVerification();
  }

  async registerUser(email: string, pass: string){
    try {
      const result = await this.AFauth.createUserWithEmailAndPassword(email, pass);
      this.sendVerificationEmail();
      return result;
    } catch (error) {
      console.log(error);
      
    }
    /*return new Promise((resolve,reject) => {
      this.AFauth.createUserWithEmailAndPassword(email,pass)
      .then( userData => resolve(userData),
      err => reject (err));
    })*/
  }

  async login(email: string, password: string){
    try {
      const result = await this.AFauth.signInWithEmailAndPassword(email, password);
      return result;
    } catch (error) {
      console.log(error);
    }
    /*return new Promise((resolve, rejected) =>{
      this.AFauth.signInWithEmailAndPassword(email, password).then(user => {
        resolve(user)
        
      }).catch(err => rejected(err))
    })*/
    
  }

  loginWithFacebook(){
    var permissions =['email', 'public_profile'];
    return this.face.login(permissions).then((response: FacebookLoginResponse)=>{
      const credential_face = firebase.default.auth.FacebookAuthProvider.credential(response.authResponse.accessToken);
      return this.AFauth.signInWithCredential(credential_face);
    });
  }

  loginFacebookUser() {
    //return this.AFauth.signInWithPopup(new auth.FacebookAuthProvider())
      //.then(credential => this.updateUserData(credential.user))
  }

  loginGoogleUser() {
    //return this.AFauth.signInWithPopup(new auth.GoogleAuthProvider())
     // .then(credential => this.updateUserData(credential.user))
  }

  logoutUser() {
    return this.AFauth.signOut();
  }

  

  /*
   *permite guardar un usuario del tipo cliente en una base provisional de firebase a travez de un correo y contraseña
    guarda sus datos en bases de datos llamado 'clientes-confirmar'.
   @usuario : el cliente que se quiere guardar, posee correo.
   @clave : la contraseña empleada para el acceso a firebase.
   CONFIRMAR DIRECTAMENTE
  */
 RegistrarClienteDatos(usuario: Cliente, clave: string) {
  const d: ClienteAConfirmar = usuario as ClienteAConfirmar;
  d.clave = clave;
  console.log("entre al servicio")
  return this.db.collection('clientes').add({
    apellido: d.apellido,
    //clave: d.clave,
    correo: d.correo,
    foto: d.foto,
    nombre: d.nombre
  });
}
}
