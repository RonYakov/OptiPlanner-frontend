import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { ConfirmRegisterPageComponent } from './confirm-register-page/confirm-register-page.component';
import {AuthPageComponent} from "./auth-page/auth-page.component";
import {ReactiveFormsModule} from "@angular/forms";
import { RegisterPageComponent } from './register-page/register-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    AuthPageComponent,
    ConfirmRegisterPageComponent,
    RegisterPageComponent,
    LoginPageComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class AuthModule { }
