import { Component } from '@angular/core';

@Component({
  selector: 'app-topbar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent {
  isSignOutDisabled = true;
  userName: string = 'User';

  toggleSignOutButton(): void {
    this.isSignOutDisabled = !this.isSignOutDisabled;
  }

  setUserName(name: string): void {
    this.userName = name;
  }
}


//todo- move to higher module, create a real background main page
