import { Component } from '@angular/core';
import {FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';
import {Router} from "@angular/router";
import {AuthService} from "../../shared/services/auth.service";
import {ILoginUser} from "../../shared/interface/login-user.interface";
import { SidebarService } from '../../shared/services/sidebar.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {
  loginForm: FormGroup;
  loading = false;
  displayMessage: string = "";

  constructor(private router: Router,
              private authService: AuthService,
              private sidebarService: SidebarService,
              private formBuilder: FormBuilder) {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    const user: ILoginUser = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    this.authService.login(user.email, user.password).subscribe(res => {
      if (res.status === 200) {
        console.log(res);
        this.sidebarService.setUserName(res.data.name);
        this.sidebarService.setUserId(res.data.id);
        this.sidebarService.toggleIsOpen();
        this.router.navigate(['/my-calendar']);
      }
      else{
        this.displayMessage = res.data;
      }})
    }
}

//todo- reset password
