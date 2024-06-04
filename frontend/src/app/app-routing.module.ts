import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthPageComponent} from "./auth/auth-page/auth-page.component";
import { CalendarComponent } from './components/calendar/calendar.component';
import {CreateAnEventComponent} from "./components/create-an-event/create-an-event.component";

const routes: Routes = [
  {
    path:'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'my-calendar', component: CalendarComponent
  },
  {
    path: 'create-an-event', component: CreateAnEventComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
