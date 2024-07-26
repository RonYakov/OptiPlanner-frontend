import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {
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
