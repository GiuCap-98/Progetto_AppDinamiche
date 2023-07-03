import { Component, OnInit, EventEmitter, Input, Output} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ServiceRentService } from '../service/service-rent.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent  implements OnInit  {

  email!: string;
  password!: string;

  public error: string | null | undefined;
  form!: FormGroup;
  theme: string = 'theme1-toolbar';
  currentTheme!: string;
  coloreCard!: string;
  coloreTextCard!: string;
  user: any;


  constructor( private serviceRent: ServiceRentService,
    private _router: Router,
    private authService: AuthService,
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

  login() {
    this.authService.login(this.email, this.password).subscribe(
      response => {
        const token = response.data.login;
        // Salva il token JWT nel localStorage
        localStorage.setItem('token', token); 
        // Reindirizza alla pagina del dashboard dopo il login
        this._router.navigate(['/dashboard']); 
      },
      error => {
        console.error(error);
      }
    );
  }

}