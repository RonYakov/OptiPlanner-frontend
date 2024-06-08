import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { WINDOW } from './window.providers';
import { faCalendar, faPlus, faChartBar, faCog, faQuestionCircle, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import {Subscription} from "rxjs";
import { TopbarService } from '../../services/topbar.service';
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {
  isSignOutDisabled = true;
  private subscriptions: Subscription[] = [];
  isOpen = false;
  faCalendar = faCalendar;
  faPlus = faPlus;
  faChartBar = faChartBar;
  faCog = faCog;
  faQuestionCircle = faQuestionCircle;
  faSignOutAlt = faSignOutAlt;

  constructor(@Inject(WINDOW) private window: Window, private router: Router, private topbarService: TopbarService, private authService: AuthService) {}

  toggleSidebar() {
    this.isOpen = !this.isOpen;
  }

  ngOnInit(): void {
    this.window.addEventListener('scroll', this.scroll, true);
    this.subscriptions.push(
      this.topbarService.isSignOutDisabled$.subscribe(status => this.isSignOutDisabled = status)
    );
  }

  ngOnDestroy(): void {
    this.window.removeEventListener('scroll', this.scroll, true);
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  scroll = (): void => {
    const sidebar = this.window.document.getElementById('sidebar');
    if (sidebar) {
      const initialTop = 155;
      const scrollPosition = this.window.pageYOffset;
      const newTop = initialTop - scrollPosition;

      // Ensure the top value doesn't go below 0
      sidebar.style.top = `${Math.max(newTop, 0)}px`;

      // Adjust the height of the sidebar based on the scroll position
      const newHeight = (scrollPosition / this.window.innerHeight) * 100;
      sidebar.style.height = `${Math.max(newHeight, 100)}%`;
    }
  };

  navigateToCalendar() {
    this.router.navigate(['/my-calendar']);
  }

  navigateToNewEvent() {
    this.router.navigate(['/create-event']);
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
