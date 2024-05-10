import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { IUser } from "../../shared/interface/user.interface";
import { AuthService } from "../../shared/services/auth.service";

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css'],
})
export class RegisterPageComponent {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  displayMessage: string = "";
  showPassword = false;

  constructor(private router: Router,
              private authService: AuthService,
              private formBuilder: FormBuilder) {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }
  passwordMatchValidator(formGroup: FormGroup) {
    return formGroup.get('password')?.value === formGroup.get('confirmPassword')?.value ? null : { 'mismatch': true };
  }

  onSubmit() {
    this.submitted = true;

    if (this.registerForm.invalid) {
      if (this.registerForm.errors?.['mismatch']) {
        this.displayMessage = 'Unmatched password, please try again.';
      }
      return;
    }

    const user: IUser = {
      name: this.registerForm.value.name,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password
    };

    this.authService.signUp(user.name, user.email, user.password).subscribe(res => {
      if (res.status === 200) {
        this.router.navigate(['/confirm-register']);
      }
      else{
        this.displayMessage = res.data;
      }
    })
  }
}
