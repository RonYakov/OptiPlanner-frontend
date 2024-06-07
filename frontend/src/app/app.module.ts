import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {AuthModule} from "./auth/auth.module";
import {SharedModule} from "./shared/shared.module";
import { CalendarComponent } from './components/calendar/calendar.component';
import { CreateAnEventComponent } from './components/create-an-event/create-an-event.component';
import { TasksPopupComponent } from './components/tasks.popup/tasks.popup.component';
import { WINDOW_PROVIDERS } from './shared/componnets/sidebar/window.providers';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


@NgModule({
  declarations: [
    AppComponent,
    CalendarComponent,
    CreateAnEventComponent,
    TasksPopupComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    AuthModule,
    SharedModule,
    FontAwesomeModule
  ],
  providers: [
    provideClientHydration(),
    WINDOW_PROVIDERS
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
