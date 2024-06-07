import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { WINDOW } from './window.providers';
import { faCalendar, faPlus, faChartBar, faCog, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {
  isOpen = false;
  faCalendar = faCalendar;
  faPlus = faPlus;
  faChartBar = faChartBar;
  faCog = faCog;
  faQuestionCircle = faQuestionCircle;

  constructor(@Inject(WINDOW) private window: Window, private router: Router) {}

  toggleSidebar() {
    this.isOpen = !this.isOpen;
  }

  ngOnInit(): void {
    this.window.addEventListener('scroll', this.scroll, true);
  }

  ngOnDestroy(): void {
    this.window.removeEventListener('scroll', this.scroll, true);
  }

  scroll = (): void => {
    const sidebar = this.window.document.getElementById('sidebar');
    if (sidebar) {
      const initialTop = 160;
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
    this.router.navigate(['/create-an-event']);
  }
}
