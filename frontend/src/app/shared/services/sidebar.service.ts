import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private userName = new BehaviorSubject<string>((typeof localStorage !== 'undefined' ? localStorage.getItem('userName') : null) || 'User');
  private userId = new BehaviorSubject<string>((typeof localStorage !== 'undefined' ? localStorage.getItem('userId') : null) || '');
  private isSignOutDisabled = new BehaviorSubject<boolean>((typeof localStorage !== 'undefined' ? localStorage.getItem('isSignOutDisabled') : null) === 'true' || false);
  userName$ = this.userName.asObservable();
  isSignOutDisabled$ = this.isSignOutDisabled.asObservable();

  setUserName(name: string): void {
    this.userName.next(name);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('userName', name);
    }
  }

  setUserId(id: string): void {
    this.userId.next(id);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('userId', id);
    }
  }

  getUserId(): string {
    return this.userId.value;
  }

  toggleSignOutButton(): void {
    const newValue = !this.isSignOutDisabled.value;
    this.isSignOutDisabled.next(newValue);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('isSignOutDisabled', String(newValue));
    }
  }
}
