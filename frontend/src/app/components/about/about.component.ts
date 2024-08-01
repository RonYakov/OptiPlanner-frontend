import { Component, OnInit, OnDestroy } from '@angular/core';
import { SidebarService } from '../../shared/services/sidebar.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent implements OnInit, OnDestroy {
  isSideBarOpen: boolean = false;
  private subscription: Subscription | undefined;

  constructor(private sidebarService: SidebarService) { }

  ngOnInit() {
    this.isSideBarOpen = this.sidebarService.getIsOpen();
    this.subscription = this.sidebarService.isOpen$.subscribe(isOpen => {
      this.isSideBarOpen = isOpen;
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  teamMembers = [
    { name: 'John Doe', role: 'CEO', image: 'assets/john-doe.jpg' },
    { name: 'Jane Smith', role: 'CTO', image: 'assets/jane-smith.jpg' },
    // Add more team members as needed
  ];

  companyValues = [
    { icon: 'fa-lightbulb', title: 'Innovation', description: 'We constantly push boundaries.' },
    { icon: 'fa-users', title: 'Teamwork', description: 'We achieve more together.' },
    { icon: 'fa-globe', title: 'Sustainability', description: 'We care for our planet.' },
  ];
}
