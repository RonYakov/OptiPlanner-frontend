import { Component, ChangeDetectorRef, OnInit, ViewChild } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import moment from 'moment';
import HebrewDate from 'hebrew-date';
import { Task } from '../../shared/classes/task';
import { TasksPopupComponent } from '../tasks.popup/tasks.popup.component';


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent implements OnInit {
  @Output() dayClicked = new EventEmitter<Task[]>();
  @ViewChild(TasksPopupComponent) tasksPopup!: TasksPopupComponent;
  googleCalendarColors = {
    red: '#D50000',
    blue: '#2962FF',
    green: '#43A047',
    yellow: '#FDD835',
    orange: '#FB8C00',
    deepPurple: '#8E24AA',
    lightBlue: '#039BE5',
    teal: '#00BFA5',
    lime: '#AEEA00',
    deepOrange: '#E64A19',
    indigo: '#304FFE',
    lightGreen: '#64DD17',
    amber: '#FFAB00',
    brown: '#795548',
    grey: '#9E9E9E',
    blueGrey: '#607D8B'
  };
  currentDate: moment.Moment = moment();
  currentMonth: string = this.currentDate.format('MMMM, YYYY');
  days: any[] = [];
  selectedDayTasks: Task[] = [
    // new Task(
    //   1, // user_id
    //   'Morning Run', // name
    //   new Date(2024, 5, 11), // start_date
    //   new Date(2024, 5, 11), // end_date
    //   false, // whole_day
    //   new Date(2022, 1, 1, 6, 0), // start_time
    //   new Date(2022, 1, 1, 7, 0), // end_time
    //   true, // repeat
    //   1, // repeat_type
    //   1, // repeat_interval
    //   'Park', // location
    //   1, // category
    //   'Running in the park' // description
    // ),
    new Task(
      1,
      'Team Meeting',
      new Date(2024, 5, 8), // start_date
      new Date(2024, 5, 8), // end_date
      false,
      new Date(2024, 5, 8, 10, 0), // start_time
      new Date(2024, 5, 10, 11, 0), // end_time
      true,
      4,
      5,
      'Office',
      2,
      'Discussing the progress of the project'
    ),
    // new Task(
    //   1,
    //   'Lunch with John',
    //   new Date(2024, 5, 15), // start_date
    //   new Date(2024, 5, 15), // end_date
    //   false,
    //   new Date(2022, 1, 1, 13, 0),
    //   new Date(2022, 1, 1, 14, 0),
    //   false,
    //   undefined,
    //   undefined,
    //   'Restaurant',
    //   3,
    //   'Catching up with John'
    // ),
    // new Task(
    //   1,
    //   'Reading',
    //   new Date(2024, 5, 30), // start_date
    //   new Date(2024, 5, 30), // end_date
    //   false,
    //   new Date(2022, 1, 1, 20, 0),
    //   new Date(2022, 1, 1, 21, 0),
    //   true,
    //   1,
    //   1,
    //   'Home',
    //   4,
    //   'Reading a new book'
    // )
  ];

  hebrewMonths: { [key: string]: string } = {};

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
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
    this.updateCalendar();
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
    console.log(`Tasks for day ${day}:`, tasksForDay); // Log the tasks for the day
    let dayData = {
      date: day,
      tasks: tasksForDay,
      isFiller: false
    };

    return dayData;
  }

  getTasksForDay(date: Date) {
    return this.selectedDayTasks.filter(task => {
      let taskStartDate = new Date(task.start_date);
      let taskEndDate = new Date(task.end_date);

      if (taskStartDate <= date && date <= taskEndDate) {
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
              break;
            case 2: // WEEKLY
              let weeksDifference = Math.floor(daysDifference / 7);
              if (weeksDifference >= 0 && weeksDifference < repeatInterval && taskStartDate.getDay() === date.getDay()) {
                return true;
              }
              break;
            case 3: // MONTHLY
              let monthsDifference = (date.getFullYear() - taskStartDate.getFullYear()) * 12 + date.getMonth() - taskStartDate.getMonth();
              if (monthsDifference >= 0 && monthsDifference < repeatInterval && taskStartDate.getDate() === date.getDate()) {
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

  showTasks(day: any) {
    console.log("Tasks for: ", day);
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
    }

    this.cdr.detectChanges();
  }
}


