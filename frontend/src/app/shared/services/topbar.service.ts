import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TopbarService {
  private userName = new BehaviorSubject<string>('User');
  private isSignOutDisabled = new BehaviorSubject<boolean>(true);

  userName$ = this.userName.asObservable();
  isSignOutDisabled$ = this.isSignOutDisabled.asObservable();

  setUserName(name: string): void {
    this.userName.next(name);
  }

  toggleSignOutButton(): void {
    this.isSignOutDisabled.next(!this.isSignOutDisabled.value);
  }
}
