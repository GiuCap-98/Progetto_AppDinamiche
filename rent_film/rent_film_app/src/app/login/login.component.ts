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
  form!: FormGroup;
  error: string | null | undefined;
  auth_error: boolean = false;

  theme: string = 'theme1-toolbar';
  currentTheme!: string;
  coloreCard!: string;
  coloreTextCard!: string;

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

  login(): void {
    this.authService.login(this.email, this.password).subscribe(
      response => {
        const token = response.data.login;

        if(!token) {
          this.form.reset();
          this.auth_error = true
        } else {
          this.authService.setAuthToken(token);
          this._router.navigate(['/dashboard']);
        }}
    );
  }

}
