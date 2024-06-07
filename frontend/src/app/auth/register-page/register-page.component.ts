
declare var google: any;

import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { IUser } from "../../shared/interface/user.interface";
import { AuthService } from "../../shared/services/auth.service";
import { isPlatformBrowser } from '@angular/common';




@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css'],
})
export class RegisterPageComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  displayMessage: string = "";
  showPassword = false;

  constructor(private router: Router,
              private authService: AuthService,
              private formBuilder: FormBuilder,
              @Inject(PLATFORM_ID) private platformId: Object) {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadGoogleSignInScript();
    }
  }

  loadGoogleSignInScript() {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      this.initializeGoogleSignIn();
    };
    script.onerror = (error) => {
      console.error('Error loading Google Sign-In script:', error);
    };
    document.head.appendChild(script);
  }

  initializeGoogleSignIn() {
    if (typeof google !== 'undefined' && google.accounts) {
      google.accounts.id.initialize({
        client_id: "756316002330-vqdsffqig8drfgs8iitafeirkah5opii.apps.googleusercontent.com",
        callback: (resp: any) => {
          console.log(resp);
          const googleToken = resp.credential;

          this.authService.signUpWithGoogle(googleToken).subscribe(res => {
            if (res.status === 200) {

              console.log("sign up with google successful")
              //todo- redirect to home page

            } else {
              this.displayMessage = res.data;
            }
          })

          if(true)// todo- testing: true will signout automatically
          {
            console.log("Signing out")
            google.accounts.id.disableAutoSelect();
          }
        }
      });
      google.accounts.id.renderButton(document.getElementById("google-btn"), {
        theme: "filled_blue",
        size: "large",
        shape: "rectangle",
        width: "350",
      });
    } else {
      console.error("Google Sign-In script not loaded.");
    }
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
      } else {
        this.displayMessage = res.data;
      }
    })
  }

}
