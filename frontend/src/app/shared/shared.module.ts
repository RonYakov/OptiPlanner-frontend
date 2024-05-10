import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './componnets/sidebar/sidebar.component';
import { TopBarComponent } from './componnets/topbar/top-bar.component';



@NgModule({
  declarations: [
    SidebarComponent,
    TopBarComponent
  ],
  exports: [
    TopBarComponent
  ],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
