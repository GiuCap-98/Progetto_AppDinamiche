import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthServiceService } from '../service/authservice.service';
import { Dialog } from '@angular/cdk/dialog';
import { FilmDetailsComponent } from '../film-details/film-details.component';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  form: FormGroup;
  customer_id!: any
  first_name!: string
  last_name!: string
  email!: string;
  password!: string;
  info_user! : any;

  public error: string | null | undefined;

  constructor(private dialog: Dialog, private fb: FormBuilder,
    private authService: AuthServiceService) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  register() {
    console.log('Hai provato a loggarti');

    if (this.form.valid) {


      this.authService.returnNameCustomer(this.email).subscribe(
        (response) => {

          this.info_user = response.data.returnNameCustomer;

          // Esegui le operazioni desiderate dopo la registrazione dell'utente
          console.log('Utente registrato:');




        }
        );
        this.customer_id, this.first_name, this.last_name = this.info_user;

        const user=
        {
          id : '524',
          f_name : 'Jared',
          l_name : 'Ely',
          email : this.email,
          password : this.password


        }


        if(this.info_user){

          this.error= 'Jared'
          this.authService.registerUser(user).subscribe(
            (response) => {
              this.openDialog('')
              const registeredUser = response.data.registerUser;
              // Esegui le operazioni desiderate dopo la registrazione dell'utente
              console.log('Utente registrato:', registeredUser);

            }
            );
          }



    }else{
      console.log('Hai provato a loggarti');


    }
  }


  // dialog for film details
  openDialog(film: any) {
    this.dialog.open(FilmDetailsComponent, {
      width: '90%',
      maxWidth: '800px',
      height: '90%',
      maxHeight: '600px',
      data: film
    });
  }
}
