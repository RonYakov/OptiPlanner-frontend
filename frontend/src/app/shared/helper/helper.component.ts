import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-helper',
  templateUrl: './helper.component.html',
  styleUrl: './helper.component.css'
})
export class HelperComponent implements OnInit {

  constructor(private router: Router) {
  }

  async ngOnInit() {
    await this.router.navigate(['/my-calendar']);
  }
}
