import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { ConfirmRegisterPageComponent } from './confirm-register-page/confirm-register-page.component';
import {AuthPageComponent} from "./auth-page/auth-page.component";
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    AuthPageComponent,
    ConfirmRegisterPageComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
  ]
})
export class AuthModule { }
