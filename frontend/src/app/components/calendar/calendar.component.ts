import { Component, ChangeDetectorRef } from '@angular/core';
import moment from 'moment';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})

export class CalendarComponent {
  currentDate: moment.Moment = moment();
  currentMonth: string = this.currentDate.format('MMMM, YYYY'); // Updated line
  days: any[] = this.generateCalendar(this.currentDate.year(), this.currentDate.month());

  constructor(private cdr: ChangeDetectorRef) {
    this.updateCalendar(); // Call updateCalendar in the constructor
  }

  generateCalendar(year: number, month: number): any[][] {
    const firstDayOfMonth = moment([year, month, 1]);
    const startDay = moment(firstDayOfMonth).startOf('month');
    const endDay = moment(firstDayOfMonth).endOf('month');

    const calendarData = [];
    let week = [];

    let currentDate = moment(startDay);

    // Add blank days at the beginning of the month
    for (let i = 0; i < currentDate.day(); i++) {
      week.push({});
    }

    // Loop through all days from startDay to endDay
    while (currentDate.isSameOrBefore(endDay)) {
      week.push({
        date: currentDate.date(),
        month: currentDate.month(),
        year: currentDate.year(),
        tasks: [] // You can add logic here to fetch tasks for this day
      });

      // If it's the end of the week, push the week into calendarData and reset week
      if (currentDate.day() === 6) {
        calendarData.push(week);
        week = [];
      }

      // Move to the next day
      currentDate.add(1, 'day');
    }

    // Push the last week into calendarData if it's not empty
    if (week.length > 0) {
      calendarData.push(week);
    }

    return calendarData;
  }

  prevMonth() {
    this.currentDate = this.currentDate.subtract(1, 'month');
    this.updateCalendar();
    this.cdr.detectChanges(); // Manually trigger change detection
  }

  nextMonth() {
    this.currentDate = this.currentDate.add(1, 'month');
    this.updateCalendar();
    this.cdr.detectChanges(); // Manually trigger change detection
  }

  isCurrentDay(day: any): boolean {
    const today = new Date();
    return day.date === today.getDate() &&
      day.month === today.getMonth() &&
      day.year === today.getFullYear();
  }

  showTasks(day: any) {
    // Logic to display tasks for the clicked day
    console.log("Tasks for: ", day);
  }

  getMonthName(monthIndex: number): string {
    return moment.months()[monthIndex];
  }

  private updateCalendar() {
    this.currentMonth = this.currentDate.format('MMMM, YYYY');
    this.days = this.generateCalendar(this.currentDate.year(), this.currentDate.month());
  }
}
