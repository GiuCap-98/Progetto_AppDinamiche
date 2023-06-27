import { Component, OnInit, EventEmitter, Input, Output} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ServiceRentService } from '../service/service-rent.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthServiceService } from '../service/authservice.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent  implements OnInit  {

  public error: string | null | undefined;
  form!: FormGroup;
  theme: string = 'theme1-toolbar';
  currentTheme!: string;
  coloreCard!: string;
  coloreTextCard!: string;
  user: any;

  username!: string;
  password!: string;


  constructor( private serviceRent: ServiceRentService,
    private _router: Router,
    private authService: AuthServiceService,
    private fb: FormBuilder
    ) {
      this.form = this.fb.group({
        email: ['', Validators.required],
        password: ['', Validators.required]
    });
     }

  ngOnInit(): void {
    this.serviceRent.theme$.subscribe((theme) => {
      this.currentTheme = theme === 'theme1-toolbar' ? 'theme1-other' : 'theme2-other';
      this.coloreCard = theme === 'theme1-toolbar' ? '#e8e8e8' : '#2E343B';
      this.coloreTextCard = theme === 'theme1-toolbar' ? 'black' : 'white';
    });
  }
  logout() {
      this.authService.clearAuthToken(); // Cancella il token
      this._router.navigateByUrl('/');
  }


  getLogged() {
    this.authService.getLogged(this.username,this.password).subscribe((response) => {
      this.user = response.data.findUser;
      if (this.user) {
        // Aggiungi qui la navigazione verso la pagina successiva dopo il login
        this._router.navigate(['dashboard'])
      } else {
        this.error= 'Utente o password errati'

      }
    });
  }


  getLoggedToken() {
    this.authService.getLogged(this.username,this.password).subscribe((response) => {
      this.user = response.data.findUser;
      if (this.user) {
        // Salva il token JWT nel localStorage
        localStorage.setItem('jwtToken', response.token);

        // Aggiungi qui la navigazione verso la pagina successiva dopo il login
        this._router.navigate(['dashboard']);
      } else {
        this.error = 'Utente o password errati';
      }
    });
  }



}
