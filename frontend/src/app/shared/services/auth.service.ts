import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {map} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  constructor(private http: HttpClient) { }


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
    return this.http.post( `http://localhost:3000/auth/login`,{email, password}).pipe(map((res: any) => res))
  }

}
