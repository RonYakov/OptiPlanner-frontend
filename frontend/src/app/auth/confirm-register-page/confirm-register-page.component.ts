import { Component } from '@angular/core';
import {FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';
import { Router } from "@angular/router";
import { AuthService } from "../../shared/services/auth.service";
import { IConfirmationRegister } from "../../shared/interface/confirmation-register.interface";


@Component({
  selector: 'app-confirm-register-page',
  templateUrl: './confirm-register-page.component.html',
  styleUrls: ['./confirm-register-page.component.css']
})
export class ConfirmRegisterPageComponent {
  confirmForm: FormGroup;
  loading = false;
  displayMessage: string = "";

  constructor( private router: Router,
               private authService: AuthService,
               private formBuilder: FormBuilder) {
    this.confirmForm = this.formBuilder.group({
      confirmationCode: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    const confirmation :IConfirmationRegister = {
      email: this.confirmForm.value.email,
      confirmationCode: this.confirmForm.value.confirmationCode
    };

    this.authService.confirmRegister(confirmation.email, confirmation.confirmationCode).subscribe(res => {
      if (res.status === 200) {
        this.router.navigate(['/login']);
        console.log('Register successfully!')
      }else {
        this.displayMessage = res.data;
      }})
  }
}
