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
  userName: string = 'User';
  private subscriptions: Subscription[] = [];

  constructor(private authService: AuthService, private topbarService: TopbarService, private router: Router) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.topbarService.userName$.subscribe(name => this.userName = name)
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}

//todo- move to higher module, create a real background main page
