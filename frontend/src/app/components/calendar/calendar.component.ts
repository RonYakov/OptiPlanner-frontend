import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import moment from 'moment';
import HebrewDate from 'hebrew-date';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent implements OnInit {
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
      week.push({});
    }

    while (currentDate.isSameOrBefore(endDay)) {
      const hebrewDate = HebrewDate(currentDate.year(), currentDate.month() + 1, currentDate.date());

      // Get the Hebrew month name
      const monthName = hebrewDate.month_name as keyof typeof this.hebrewMonths;
      const hebrewMonthName = this.hebrewMonths[monthName] || 'Unknown Month';

      // Generate some demo tasks for the day
      const tasksForTheDay = currentDate.date() === 1 ? [
        { title: 'Demo Task 1', color: this.googleCalendarColors.red },
        { title: 'Demo Task 2', color: this.googleCalendarColors.blue }
      ] : [];

      week.push({
        date: currentDate.date(),
        month: currentDate.month(),
        year: currentDate.year(),
        hebrewDate: `${this.toHebrewNumerals(hebrewDate.date)} ב${hebrewMonthName}`,
        tasks: tasksForTheDay,
        taskCount: tasksForTheDay.length
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
    this.selectedDay = day;
    this.showPopup = true;
  }
}
