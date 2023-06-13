import { Component, OnInit, EventEmitter, Input, Output} from '@angular/core';
import {FormControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ServiceRentService } from '../service/service-rent.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent  implements OnInit  {

  public submitted = false;
  public error: string | null | undefined;
  public isLoggedIn = false;
  theme: string = 'theme1-toolbar';
  currentTheme!: string;
  coloreCard!: string;
  coloreTextCard!: string;

  constructor( private serviceRent: ServiceRentService,
    private _router: Router,
    private _activatedRoute:ActivatedRoute
    ) { }

  ngOnInit(): void {
    this.serviceRent.theme$.subscribe((theme) => {
      this.currentTheme = theme === 'theme1-toolbar' ? 'theme1-other' : 'theme2-other';
      this.coloreCard = theme === 'theme1-toolbar' ? '#e8e8e8' : '#2E343B';
      this.coloreTextCard = theme === 'theme1-toolbar' ? 'black' : 'white';
    });
  }

  //@Input() error: string | null | undefined;

  //@Output() sendDataEvent = new EventEmitter();
  @Output() loginSuccess = new EventEmitter();

  submit() {
    //if (this.form.valid) {
      this.loginSuccess.emit(null)
      this.isLoggedIn = true; // Imposta isLoggedIn a true dopo un accesso riuscito
      this._router.navigate(['start-button'])
      console.log(false);
    //}
  }



  onLogin(): void {
    // console.log(this.loginForm.value);
    this.submitted = true;

  }
  


  loginValido(): boolean {
    // Ottenere i valori inseriti dall'utente per username e password
    const username = (<HTMLInputElement>document.getElementById('username')).value;
    const password = (<HTMLInputElement>document.getElementById('password')).value;


    // Esempio di verifica delle credenziali
    // Implementa la tua logica di verifica qui, ad esempio, controlla le credenziali nel tuo sistema di autenticazione
    // Restituisci true se le credenziali sono valide, altrimenti false

    // Esempio di verifica delle credenziali hard-coded
    const usernameCorretto = 'utente';
    const passwordCorretta = 'password';

    if (username === usernameCorretto && password === passwordCorretta) {
      return true;
    } else {
      return false;
    }
}

login(): void {
    // Effettua il login utilizzando il servizio AuthService
    if (this.loginValido()) {
      //this.servizioRent.setValue(true);
      this._router.navigate(['dashboard']);
      this.serviceRent.isLoggedIn$.next(true)
      this.isLoggedIn = true; // Imposta isLoggedIn a true dopo un accesso riuscito
    } else {
      this.error = 'Credenziali non valide'; // Imposta l'errore per un accesso non valido
    }
  }

}
