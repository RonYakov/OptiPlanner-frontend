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

  getCurrentMonthEvents(userid: string): Observable<Task[]> {
    return this.http.get(environment.API_URL + `/statistics/getCurrentMonthEvents`, { params: { userid }, observe: 'response' })
      .pipe(
        map((res: HttpResponse<any>) => {
          if (res.body.status === 200) {
            return res.body.data.map((task: Partial<Task>) => new Task(
              task.id || '',
              task.user_id || '',
              task.name || '',
              task.priority || 0,
              task.flexible || false,
              new Date(task.start_date || 0),
              new Date(task.end_date || 0),
              task.whole_day || false,
              new Date(task.start_time || 0),
              new Date(task.end_time || 0),
              task.repeat || false,
              task.repeat_type || 0,
              task.repeat_interval || 0,
              task.location || '',
              task.category || 0,
              task.description || '',
              task.alarms || []
            ));
          } else {
            console.error(`Received status code ${res.status}`);
            return [];
          }
        })
      );
  }
}
