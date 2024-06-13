import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {map, BehaviorSubject} from "rxjs";
import { SidebarService } from './sidebar.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  loggedIn$ = this.loggedIn.asObservable();

  constructor(private http: HttpClient,
              private sidebarService: SidebarService) { }


  signUp(name: string, email:string, password:string){
    return this.http.post( `http://localhost:3000/auth/sign-up`,{name, email, password}).pipe(map((res: any) => res))
  }

  signUpWithGoogle(googleToken: string){
    return this.http.post(`http://localhost:3000/auth/google-sign-up`, { token: googleToken }).pipe(map((res: any) => res));
  }

  confirmRegister(email :String, confirmationCode: string){
    return this.http.post( `http://localhost:3000/auth/confirm-register`,{email, confirmationCode}).pipe(map((res: any) => res))
  }

  login(email: string, password: string){
    return this.http.post( `http://localhost:3000/auth/login`,{email, password}).pipe(
      map((res: any) => {
        // After a successful login, store the user ID in localStorage
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('userId', res.userId);
        }
        return res;
      })
    )
  }

  signout(){
    return this.http.post( `http://localhost:3000/auth/signout`,{}).pipe(
      map((res: any) => {
        // After a successful logout, clear the user data
        this.sidebarService.clearUserData();
        return res;
      })
    )
  }
}
