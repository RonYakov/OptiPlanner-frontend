import { Component, OnInit, OnDestroy } from '@angular/core';
import { SidebarService } from '../../shared/services/sidebar.service';
import { Subscription } from 'rxjs';
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent implements OnInit, OnDestroy {
  isSideBarOpen: boolean = false;
  private subscription: Subscription | undefined;
  zivImg: string = environment.API_URL + '/ZivImage.jpg';
  idoImg: string = environment.API_URL + '/IdoHirschmannImage.jpg';
  ronImg: string = environment.API_URL + '/RonYakovPassport.jpg';

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
