import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  form: FormGroup;
  error: string | null | undefined;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.form = this.fb.group({
      customer_id: ['', Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  register() {
    if (this.form.valid) {
      const user = this.form.value;
      this.authService.register(user).subscribe(
        response => {
          console.log('Registration successful:', response);
          // Optionally, you can redirect the user to the login page
          // after successful registration.
        },
        error => {
          console.error('Registration failed:', error);
          this.error = 'Registration failed. Please try again.';
        }
      );
    }
  }
}
