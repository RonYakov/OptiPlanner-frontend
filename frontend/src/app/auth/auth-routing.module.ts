import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthPageComponent} from "./auth-page/auth-page.component";
import {ConfirmRegisterPageComponent} from "./confirm-register-page/confirm-register-page.component";

const routes: Routes = [
  {path: '',component: AuthPageComponent,
    children:[
      {path: 'confirm-register',component: ConfirmRegisterPageComponent},
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
