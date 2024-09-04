import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
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
import {NgbActiveModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { LoadingService } from './shared/services/loading.service';

@NgModule({
  declarations: [
    AppComponent,
    CalendarComponent,
    CreateEventComponent,
    TasksPopupComponent,
    TaskDetailComponent,
    AboutComponent,
    StatisticsComponent,
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        ReactiveFormsModule,
        AuthModule,
        SharedModule,
        FontAwesomeModule,
        NgbModule,
        FormsModule
    ],
  providers: [
    provideClientHydration(),
    WINDOW_PROVIDERS,
    LoadingService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}
