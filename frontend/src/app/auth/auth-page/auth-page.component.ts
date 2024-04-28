import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {IUser} from "../../shared/interface/user.interface";
import {AuthService} from "../../shared/services/auth.service";

@Component({
  selector: 'app-auth-page',
  templateUrl: './auth-page.component.html',
  styleUrl: './auth-page.component.css',
})
export class AuthPageComponent {
  isConfirmed: boolean = false;
  user:IUser = {} as IUser;
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  displayMessage: string = "";

  constructor(private route: Router,
              private authService: AuthService,
              private formBuilder: FormBuilder,
              ){
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }



  onSubmit() {

    this.user.email = this.registerForm.value.email;
    this.user.password = this.registerForm.value.password;
    this.user.name = this.registerForm.value.name;

    this.authService.signUp(this.user.name, this.user.email, this.user.password).subscribe(res => {
      if(res.status === 200){
        this.isConfirmed = true;

        if(this.isConfirmed){
          this.route.navigate(['/confirm-register']);
        }
      }
      this.displayMessage = res.data;
    })
  }
}
