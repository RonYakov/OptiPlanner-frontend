import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private userName = new BehaviorSubject<string>((typeof localStorage !== 'undefined' ? localStorage.getItem('userName') : null) || 'User');
  private userId = new BehaviorSubject<string>((typeof localStorage !== 'undefined' ? localStorage.getItem('userId') : null) || '');
  private isOpen = new BehaviorSubject<boolean>(
    (typeof localStorage !== 'undefined' && localStorage.getItem('isOpen') !== null)
      ? localStorage.getItem('isOpen') === 'true'
      : false
  );

  isOpen$ = this.isOpen.asObservable();
  userName$ = this.userName.asObservable();

  setUserName(name: string): void {
    this.userName.next(name);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('userName', name);
    }
  }

  clearUserData(): void {
    this.userName.next('User');
    this.userId.next('');
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('userName');
      localStorage.removeItem('userId');
      localStorage.removeItem('isSignOutDisabled');
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

  getIsOpen(): boolean {
    return this.isOpen.value;
  }

  toggleIsOpen(): void {
    const newValue = !this.isOpen.value;
    this.isOpen.next(newValue);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('isOpen', String(newValue));
    }
  }
}
