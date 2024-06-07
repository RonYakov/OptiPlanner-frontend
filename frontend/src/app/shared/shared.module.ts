import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './componnets/sidebar/sidebar.component';
import { TopBarComponent } from './componnets/topbar/top-bar.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


@NgModule({
  declarations: [
    SidebarComponent,
    TopBarComponent
  ],
  exports: [
    SidebarComponent,
    TopBarComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule
  ]
})
export class SharedModule { }
