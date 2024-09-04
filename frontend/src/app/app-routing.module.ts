import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarComponent } from './components/calendar/calendar.component';
import { CreateEventComponent } from "./components/create-event/create-event.component";
import { AboutComponent } from "./components/about/about.component";
import { StatisticsComponent } from './components/statistics/statistics.component';
import {HelperComponent} from "./shared/helper/helper.component";

const routes: Routes = [
  {
    path:'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  { path: 'my-calendar', component: CalendarComponent },
  { path: 'create-event', component: CreateEventComponent },
  { path: 'about', component: AboutComponent },
  { path: 'statistics', component: StatisticsComponent },
  { path: 'calendar', component: HelperComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
