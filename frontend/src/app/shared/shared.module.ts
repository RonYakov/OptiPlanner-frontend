import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './componnets/sidebar/sidebar.component';
import { TopBarComponent } from './componnets/topbar/top-bar.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LoaderComponent } from './componnets/loader/loader.component';
import { FailedEventsComponent } from './componnets/failed-events/failed-events.component';
import { HelperComponent } from './helper/helper.component';

@NgModule({
  declarations: [
    SidebarComponent,
    TopBarComponent,
    LoaderComponent,
    FailedEventsComponent,
    HelperComponent
  ],
  exports: [
    SidebarComponent,
    TopBarComponent,
    LoaderComponent,
    FailedEventsComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule
  ]
})
export class SharedModule { }
