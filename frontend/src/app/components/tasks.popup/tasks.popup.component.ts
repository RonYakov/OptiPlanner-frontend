import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChange } from '@angular/core';
import {Task} from "../../shared/classes/task";

@Component({
  selector: 'app-tasks-popup',
  templateUrl: './tasks.popup.component.html',
  styleUrls: ['./tasks.popup.component.css']
})
export class TasksPopupComponent implements OnInit, OnChanges {
  @Input() showPopup!: boolean;
  @Input() selectedDay: any;
  @Input() tasks: Task[] = [];
  @Output() close = new EventEmitter<void>();

  selectedTask?: Task;
  showTaskDetail = false;
  times: { time: string, displayTime: string, isAfternoon: boolean }[] = [];
  closestTime: string = "";
  googleCalendarColors:Record<string, string> = {
    'WORK': '#2962FF',
    'PERSONAL': '#43A047',
    'FAMILY': '#FB8C00',
    'HEALTH': '#D50000',
    'EDUCATION': '#8E24AA',
    'FINANCE': '#FDD835',
    'SOCIAL': '#00BFA5',
    'TRAVEL': '#039BE5',
    'ENTERTAINMENT': '#E64A19',
    'SPORTS': '#AEEA00',
    'MEETING': '#304FFE',
    'HOLIDAY': '#64DD17',
    'APPOINTMENT': '#FFAB00',
    'REMINDER': '#795548',
    'SHOPPING': '#9E9E9E',
    'OTHER': '#607D8B'
  };
  googleCalendarDarkerColors: Record<string, string> = {
    'WORK': '#1D47B2',
    'PERSONAL': '#2E7A35',
    'FAMILY': '#C06B00',
    'HEALTH': '#9C0000',
    'EDUCATION': '#661D79',
    'FINANCE': '#BDA600',
    'SOCIAL': '#008373',
    'TRAVEL': '#0273A2',
    'ENTERTAINMENT': '#A83614',
    'SPORTS': '#7EAD00',
    'MEETING': '#2335B3',
    'HOLIDAY': '#469B12',
    'APPOINTMENT': '#C38300',
    'REMINDER': '#5A3E37',
    'SHOPPING': '#6B6B6B',
    'OTHER': '#455A64'
  };
  categories = ['WORK', 'PERSONAL', 'FAMILY', 'HEALTH', 'EDUCATION', 'FINANCE', 'SOCIAL', 'TRAVEL', 'ENTERTAINMENT', 'SPORTS', 'MEETING', 'HOLIDAY', 'APPOINTMENT', 'REMINDER', 'SHOPPING', 'OTHER'];

  ngOnInit() {
    this.generateTimes();
    this.calculateClosestTime();
  }

  ngOnChanges(changes: Record<string, SimpleChange>) {
  }

  generateTimes() {
    for (let i = 0; i < 24; i++) {
      for (let j = 0; j < 60; j += 10) {
        const time = this.pad(i) + ':' + this.pad(j);
        const displayTime = j % 30 === 0 ? time : ''; // Only display the time every 30 minutes
        const isAfternoon = i >= 12;
        const timeObject = { time, displayTime, isAfternoon };

        this.times.push(timeObject);
      }
    }
  }

  getColorForCategory(categoryNumber: number | undefined): string {
    if (categoryNumber !== undefined && categoryNumber >= 1 && categoryNumber <= this.categories.length) {
      const category = this.categories[categoryNumber - 1]; // Subtract 1 because array indices start at 0
      return this.googleCalendarColors[category];
    } else {
      return this.googleCalendarColors['OTHER'];
    }
  }

  getBorderColorForCategory(categoryNumber: number | undefined): string {
    if (categoryNumber !== undefined && categoryNumber >= 1 && categoryNumber <= this.categories.length) {
      const category = this.categories[categoryNumber - 1]; // Subtract 1 because array indices start at 0
      return this.googleCalendarDarkerColors[category];
    } else {
      return this.googleCalendarDarkerColors['OTHER'];
    }
  }

  pad(num: number) {
    return num < 10 ? '0' + num : num.toString();
  }

  closePopup() {
    this.showPopup = false;
    this.close.emit();
  }

  calculateClosestTime(): void {
    const now = new Date();
    const currentTime = this.pad(now.getHours()) + ':' + this.pad(now.getMinutes());

    // Find the time that is closest to the current time
    this.closestTime = this.times.reduce((prev, curr) => {
      return Math.abs(this.timeToMinutes(currentTime) - this.timeToMinutes(curr.time)) < Math.abs(this.timeToMinutes(currentTime) - this.timeToMinutes(prev.time)) ? curr : prev;
    }).time;
  }

  timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  isCloseToCurrentTime(time: string): boolean {
    return time === this.closestTime;
  }

  isTaskInTimeRange(task: Task, time: string): boolean {
    const [taskStartHours, taskStartMinutes] = task.getStartTime().split(':').map(Number);
    const [taskEndHours, taskEndMinutes] = task.getEndTime().split(':').map(Number);
    const [currentHours, currentMinutes] = time.split(':').map(Number);

    const taskStartTime = taskStartHours * 60 + taskStartMinutes;
    const taskEndTime = taskEndHours * 60 + taskEndMinutes;
    const currentTime = currentHours * 60 + currentMinutes;

    return currentTime >= taskStartTime && currentTime <= taskEndTime;
  }

  calculateTaskTop(task: Task, time: string): number {
    let [taskStartHours, taskStartMinutes] = task.getStartTime().split(':').map(Number);

    const taskStartTime = taskStartHours * 60 + taskStartMinutes;
    const top = taskStartTime * 2 + 20;

    return top;
  }

  calculateTaskHeight(task: Task): number {
    const [taskStartHours, taskStartMinutes] = task.getStartTime().split(':').map(Number);
    const [taskEndHours, taskEndMinutes] = task.getEndTime().split(':').map(Number);

    const taskStartTime = taskStartHours * 60 + taskStartMinutes;
    const taskEndTime = taskEndHours * 60 + taskEndMinutes;
    const height = (taskEndTime - taskStartTime) * 2; // Multiply by 2 to convert minutes to pixels

    return height - 11;
  }

  identifyOverlappingTasks(tasks: Task[]): Task[][] {
    const filteredTasks = tasks.filter(task => !this.isWholeDayTask(task));

    const sortedTasks = filteredTasks.sort((a, b) =>
      this.timeToMinutes(a.getStartTime()) - this.timeToMinutes(b.getStartTime())
    );

    const overlappingTasks: Task[][] = [];
    let currentOverlapGroup: Task[] = [];
    let latestEndTime = 0;

    for (const task of sortedTasks) {
      const taskStartTime = this.timeToMinutes(task.getStartTime());
      const taskEndTime = this.timeToMinutes(task.getEndTime());

      if (currentOverlapGroup.length === 0 || taskStartTime >= latestEndTime) {
        // Start a new group if this is the first task or if it doesn't overlap
        if (currentOverlapGroup.length > 0) {
          overlappingTasks.push(currentOverlapGroup);
        }
        currentOverlapGroup = [task];
        latestEndTime = taskEndTime;
      } else {
        // Add to the current group if there's an overlap
        currentOverlapGroup.push(task);
        latestEndTime = Math.max(latestEndTime, taskEndTime);
      }
    }

    if (currentOverlapGroup.length > 0) {
      overlappingTasks.push(currentOverlapGroup);
    }

    return overlappingTasks;
  }

  calculateTaskWidthAndPosition(task: Task, tasks: Task[]): { width: string, left: string } {
    const overlappingGroup = this.identifyOverlappingTasks(tasks).find(group => group.includes(task));

    if (!overlappingGroup) {
      return { width: 'calc(95% - 80px)', left: '80px' };
    }

    const numTasks = overlappingGroup.length;
    const remainingWidth = 'calc(95% - 80px)';
    const taskIndex = overlappingGroup.indexOf(task);

    const spacing = '10px';
    const width = `calc((${remainingWidth} / ${numTasks}) - ${spacing})`;
    const left = `calc(80px + (${taskIndex} * (${remainingWidth} / ${numTasks})) + (${taskIndex} * ${spacing}))`;

    return { width, left };
  }

  highlightTasks(tasks: Task[]) {
    this.tasks = tasks;
    this.showPopup = true;
  }

  selectTask(task: Task) {
    console.log(task);
    this.selectedTask = task;
  }

  isWholeDayTask(task: Task): boolean {
    return task.whole_day;
  }

  closeTaskDetail() {
    this.selectedTask = undefined;
  }

}
