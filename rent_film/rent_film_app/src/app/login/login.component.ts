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
  form = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  public submitted = false;

  constructor( private servizioRent: ServiceRentService,
    private _router: Router,
    private _activatedRoute:ActivatedRoute
    ) { }

  ngOnInit(): void {}
  
  @Input() error: string | null | undefined;

  //@Output() sendDataEvent = new EventEmitter();
  @Output() loginSuccess = new EventEmitter();

  submit() {
    //if (this.form.valid) {
      this.loginSuccess.emit(null)
      this._router.navigate(['start-button'])
      console.log(false);
    //}
  }



  email = new FormControl('', [Validators.required, Validators.email]);
  hide = true;
  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  onLogin(): void {
    // console.log(this.loginForm.value);
    this.submitted = true;

  }



/*
  public loginForm: FormGroup = this.formBuilder.group({
      email: ["", [Validators.email, Validators.required]],
      password: [
        "",
        [
          Validators.required,
          Validators.pattern(
            "(?=.*[A-Za-z])(?=.*[0-9])(?=.*[$@$!#^~%*?&,.<>\"'\\;:{\\}\\[\\]\\|\\+\\-\\=\\_\\)\\(\\)\\`\\/\\\\\\]])[A-Za-z0-9d$@].{7,}"
          )
        ]
      ]
    });
  public submitted = false;

  ngOnInit(): void {
    this.heroForm = new FormGroup({
      name: new FormControl(this.hero.name, [
        Validators.required,
        Validators.minLength(4),
        forbiddenNameValidator(/bob/i) // <-- Here's how you pass in the custom validator.
      ]),
      alterEgo: new FormControl(this.hero.alterEgo),
      power: new FormControl(this.hero.power, Validators.required)
    });

  }

  get name() { return this.heroForm.get('name'); }

  get power() { return this.heroForm.get('power'); }

  get email() {
    return this.loginForm.get('email') as FormControl;
  }

  onLogin(): void {
    // console.log(this.loginForm.value);
    this.submitted = true;
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
      localStorage.setItem("user-Data", JSON.stringify(this.loginForm.value));
      this.router.navigate(["/"]);
    }
  }


  /*
  form = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });


  @Input() error: string | null | undefined;

  @Output() sendDataEvent = new EventEmitter();

  submit() {
    if (this.form.valid) {
      this.sendDataEvent.emit(this.form.value);
    }
    else{
      this.sendDataEvent.emit(this.error);
    }
  }



  email = new FormControl('', [Validators.required, Validators.email]);
  hide = true;
  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }
  */
}
