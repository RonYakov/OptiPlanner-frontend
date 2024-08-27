import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import { catchError } from 'rxjs/operators';
import {environment} from "../../../environments/environment";
import {Task} from "../classes/task";

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  constructor(private http: HttpClient) {}

  getCurrentMonthEvents(userId: string): Observable<Record<string, number>> {
    return this.http.get<Record<string, number>>(
      `${environment.API_URL}/statistics/getCurrentMonthEvents`,
      { params: { userId } }
    );
  }

  getCurrentWeekEvents(userId: string): Observable<Record<string, number>> {
    return this.http.get<Record<string, number>>(
      `${environment.API_URL}/statistics/getCurrentWeekEvents`,
      { params: { userId } }
    );
  }
}
