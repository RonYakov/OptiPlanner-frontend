import { Component, OnInit, OnDestroy } from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import { SidebarService } from '../../services/sidebar.service';
import { Subscription } from 'rxjs';
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-topbar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit, OnDestroy {
  userName: string = 'User';
  private subscriptions: Subscription[] = [];
  src: string = environment.API_URL + '/Optiplanner-logo.png';

  constructor(private authService: AuthService, private topbarService: SidebarService, private router: Router) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.topbarService.userName$.subscribe(name => this.userName = name)
    );
  }

  goToAbout(): void {
    this.router.navigate(['/about']);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}

