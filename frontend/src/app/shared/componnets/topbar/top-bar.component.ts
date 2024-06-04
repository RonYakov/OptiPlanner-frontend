import { Component, OnInit, OnDestroy } from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import { TopbarService } from '../../services/topbar.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-topbar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit, OnDestroy {
  isSignOutDisabled = true;
  userName: string = 'User';
  private subscriptions: Subscription[] = [];

  constructor(private authService: AuthService, private topbarService: TopbarService, private router: Router) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.topbarService.userName$.subscribe(name => this.userName = name),
      this.topbarService.isSignOutDisabled$.subscribe(status => this.isSignOutDisabled = status)
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  signOut(): void {
    this.authService.signout().subscribe(res => {
      if (res.status === 200) {
        this.topbarService.setUserName('User');
        this.topbarService.toggleSignOutButton();
        this.router.navigate(['/auth/login']);
      }
    });
  }
}

//todo- move to higher module, create a real background main page
