import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { AuthModule } from "./auth/auth.module";
import { SharedModule } from "./shared/shared.module";
import { CalendarComponent } from './components/calendar/calendar.component';
import { CreateEventComponent } from './components/create-event/create-event.component';
import { TasksPopupComponent } from './components/tasks.popup/tasks.popup.component';
import { WINDOW_PROVIDERS } from './shared/componnets/sidebar/window.providers';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { provideClientHydration } from '@angular/platform-browser';
import { TaskDetailComponent } from './components/task-detail/task-detail.component';
import { AboutComponent } from './components/about/about.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    CalendarComponent,
    CreateEventComponent,
    TasksPopupComponent,
    TaskDetailComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    AuthModule,
    SharedModule,
    FontAwesomeModule,
    NgbModule
  ],
  providers: [
    provideClientHydration(),
    WINDOW_PROVIDERS
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}
