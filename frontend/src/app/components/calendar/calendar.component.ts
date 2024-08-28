import { Component, ChangeDetectorRef, OnInit, ViewChild, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Output, EventEmitter } from '@angular/core';
import moment from 'moment';
import HebrewDate from 'hebrew-date';
import { Task } from '../../shared/classes/task';
import { TasksPopupComponent } from '../tasks.popup/tasks.popup.component';
import { SidebarService} from "../../shared/services/sidebar.service";
import {CalendarService} from "../../shared/services/calendar.service";
import { AuthService } from '../../shared/services/auth.service';


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent implements OnInit {
  @Output() dayClicked = new EventEmitter<Task[]>();
  @ViewChild(TasksPopupComponent) tasksPopup!: TasksPopupComponent;
  googleCalendarColors:Record<string, string> = {
     'WORK': '#7395c5',
     'PERSONAL': '#36A2EB',
     'FAMILY': '#A680B8',
     'HEALTH': '#FF9F40',
     'EDUCATION': '#97D077',
     'FINANCE': '#966738',
     'SOCIAL': '#EA6B66',
     'TRAVEL': '#E64735',
     'ENTERTAINMENT': '#E3AD42',
     'SPORTS': '#FFCE56',
     'MEETING': '#B5739D',
     'HOLIDAY': '#0F996B',
     'APPOINTMENT': '#4BC0C0',
     'REMINDER': '#009999',
     'SHOPPING': '#ee5985',
     'OTHER': '#607D8B'
  };

  categories = ['WORK', 'PERSONAL', 'FAMILY', 'HEALTH', 'EDUCATION', 'FINANCE', 'SOCIAL', 'TRAVEL', 'ENTERTAINMENT', 'SPORTS', 'MEETING', 'HOLIDAY', 'APPOINTMENT', 'REMINDER', 'SHOPPING', 'OTHER'];

  currentDate: moment.Moment = moment();
  currentMonth: string = this.currentDate.format('MMMM, YYYY');
  days: any[] = [];
  selectedDayTasks: Task[] = [];
  isLoading = true;

  hebrewMonths: { [key: string]: string } = {};

  constructor(private cdr: ChangeDetectorRef,
              private authService: AuthService,
              private sidebarService: SidebarService,
              private calendarService: CalendarService,
              @Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    this.isLoading = true;
    this.hebrewMonths = {
      'Nisan': 'ניסן',
      'Iyyar': 'אייר',
      'Sivan': 'סיוון',
      'Tammuz': 'תמוז',
      'Av': 'אב',
      'Elul': 'אלול',
      'Tishri': 'תשרי',
      'Heshvan': 'חשוון',
      'Kislev': 'כסלו',
      'Tevet': 'טבת',
      'Shevat': 'שבט',
      'Adar': 'אדר',
      'AdarI': 'אדר',
      'AdarII': 'אדר ב'
    };

    if (isPlatformBrowser(this.platformId)) {
      const userId = localStorage.getItem('userId');

      if (userId) {
        this.calendarService.getUserEvents(userId).subscribe(tasks => {
          this.selectedDayTasks = tasks;
          this.updateCalendar();
          this.isLoading = false;
        }, error => {
          console.error('Error fetching user events:', error);
          this.isLoading = false;
        });
      } else {
        console.error('User ID is null or undefined after initial check');
        this.isLoading = false;
      }
    } else {
      console.warn('This code is running on the server side (Angular Universal), localStorage is not available.');
    }
  }

  toHebrewNumerals(number: number): string {
    const hebrewNumerals = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י'];
    if (number <= 10) {
      return `${hebrewNumerals[number - 1]}'`;
    } else if (number < 20) {
      return `י"${hebrewNumerals[number - 11]}`;
    } else if (number === 20) {
      return `כ'`;
    } else if (number < 30) {
      return `כ"${hebrewNumerals[number - 21]}`;
    } else if (number === 30) {
      return `ל'`;
    } else {
      return `ל"${hebrewNumerals[number - 31]}`;
    }
  }

  generateCalendar(year: number, month: number): any[][] {
    const firstDayOfMonth = moment([year, month, 1]);
    const startDay = moment(firstDayOfMonth).startOf('month');
    const endDay = moment(firstDayOfMonth).endOf('month');

    const calendarData = [];
    let week = [];

    let currentDate = moment(startDay);

    // Push empty days for the days before the start of the month
    for (let i = 0; i < currentDate.day(); i++) {
      week.push({ isFiller: true });
    }

    while (currentDate.isSameOrBefore(endDay)) {
      const hebrewDate = HebrewDate(currentDate.year(), currentDate.month() + 1, currentDate.date());

      // Get the Hebrew month name
      const monthName = hebrewDate.month_name as keyof typeof this.hebrewMonths;
      const hebrewMonthName = this.hebrewMonths[monthName] || 'Unknown Month';

      // Generate tasks for the day using the generateDay method
      const dayData = this.generateDay(currentDate.date(), currentDate.month(), currentDate.year());

      week.push({
        date: currentDate.date(),
        month: currentDate.month(),
        year: currentDate.year(),
        hebrewDate: `${this.toHebrewNumerals(hebrewDate.date)} ב${hebrewMonthName}`,
        tasks: dayData.tasks,
        taskCount: dayData.tasks.length
      });

      if (currentDate.day() === 6) {
        calendarData.push(week);
        week = []; // Reset week array for the next week
      }

      currentDate.add(1, 'day');
    }
    if (week.length > 0) {
      calendarData.push(week);
    }

    return calendarData;
  }

  getColorForCategory(categoryNumber: number): string {
    if (categoryNumber >= 1 && categoryNumber <= this.categories.length) {
      const category = this.categories[categoryNumber - 1]; // Subtract 1 because array indices start at 0
      return this.googleCalendarColors[category];
    } else {
      return this.googleCalendarColors['OTHER'];
    }
  }

  prevMonth() {
    this.currentDate = this.currentDate.subtract(1, 'month');
    this.updateCalendar();
    this.cdr.detectChanges();
  }

  nextMonth() {
    this.currentDate = this.currentDate.add(1, 'month');
    this.updateCalendar();
    this.cdr.detectChanges();
  }

  isCurrentDay(day: any): boolean {
    const today = new Date();
    return day.date === today.getDate() &&
      day.month === today.getMonth() &&
      day.year === today.getFullYear();
  }

  generateDay(day: number, month: number, year: number) {
    let date = new Date(year, month, day);
    let tasksForDay = this.getTasksForDay(date);
    let dayData = {
      date: day,
      tasks: tasksForDay,
      isFiller: false
    };

    return dayData;
  }

  getTasksForDay(date: Date) {
    return this.selectedDayTasks.filter(task => {
      let taskStartDate = task.start_date;
      let taskEndDate = task.end_date;

      if (taskStartDate.getDate() <= date.getDate() &&
        taskStartDate.getMonth() <= date.getMonth() &&
        taskStartDate.getFullYear() <= date.getFullYear() &&
        date.getDate() <= taskEndDate.getDate() &&
        date.getMonth() <= taskEndDate.getMonth() &&
        date.getFullYear() <= taskEndDate.getFullYear()) {

        return true;
      }
      else{
        if (task.repeat) {
          let daysDifference = Math.floor((date.getTime() - taskStartDate.getTime()) / (1000 * 60 * 60 * 24));
          let repeatInterval = task.repeat_interval || 1;

          switch (task.repeat_type) {
            case 1: // DAILY
              if (daysDifference >= 0 && daysDifference < repeatInterval) {
                return true;
              }
              break;
            case 2: // WEEKLY
              let weeksDifference = Math.floor(daysDifference / 7);
              if (weeksDifference >= 0 && weeksDifference < repeatInterval && taskStartDate.getDay() === date.getDay()) {
                return true;
              }
              break;
            case 3: // MONTHLY
              let monthsDifference = (date.getFullYear() - taskStartDate.getFullYear()) * 12 + date.getMonth() - taskStartDate.getMonth();
              if (monthsDifference >= 0 && monthsDifference <= repeatInterval && taskStartDate.getDate() === date.getDate()) {
                return true;
              }
              break;
            case 4: // YEARLY
              let yearsDifference = date.getFullYear() - taskStartDate.getFullYear();
              if (yearsDifference >= 0 && yearsDifference < repeatInterval && taskStartDate.getDate() === date.getDate() && taskStartDate.getMonth() === date.getMonth()) {
                return true;
              }
              break;
            case 5: // NONE
            default:
              return false;
          }
        }
        return false;
      }
    });
  }


  getMonthName(monthIndex: number): string {
    return moment.months()[monthIndex];
  }

  private updateCalendar() {
    this.currentMonth = this.currentDate.format('MMMM, YYYY');
    this.days = this.generateCalendar(this.currentDate.year(), this.currentDate.month());
  }

  showPopup = false;
  selectedDay: any;

  onDayClick(day: any) {
    if(day.isFiller){
      return;
    }
    this.dayClicked.emit(this.getTasksForDay(new Date(day.year, day.month, day.date)));

    if (!day.isFiller) {
      this.tasksPopup.highlightTasks(this.getTasksForDay(new Date(day.year, day.month, day.date)));
      console.log('Tasks for the day:', this.getTasksForDay(new Date(day.year, day.month, day.date)));
    }

    this.cdr.detectChanges();
  }
}


