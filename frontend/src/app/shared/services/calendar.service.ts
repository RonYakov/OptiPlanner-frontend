import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {map, Observable} from "rxjs";
import { Task } from '../classes/task';
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  constructor(private http: HttpClient) {}

  getUserEvents(userid: string): Observable<Task[]> {
    return this.http.get(environment.API_URL + `/calendar/getUserEvents`, { params: { userid }, observe: 'response' })
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
            // Handle non-200 status codes appropriately
            console.error(`Received status code ${res.status}`);
            return [];
          }
        })
      );
  }

  deleteEvent(eventId: string): Observable<any> {
    return this.http.delete(environment.API_URL + `/calendar/deleteEvent`, { params: { eventId }, observe: 'response' })
      .pipe(
        map((res: HttpResponse<any>) => {
          return res;
        })
      );
  }
}
