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

}
