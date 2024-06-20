import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {map, Observable} from 'rxjs';
import { catchError } from 'rxjs/operators';
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CreateEventService {

  constructor(private http: HttpClient) {}


  createEvent(eventData:any){
    return this.http.post<any>( environment.API_URL + '/events/create-absolute-event', {...eventData}).pipe(map((res: any) => res))
}

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    throw error;
  }
}
