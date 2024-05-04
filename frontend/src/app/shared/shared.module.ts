import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TopbarComponent } from './topbar/topbar.component';



@NgModule({
  declarations: [
    SidebarComponent,
    TopbarComponent
  ],
  exports: [
    TopbarComponent
  ],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
