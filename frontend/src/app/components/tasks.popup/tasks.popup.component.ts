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

  times: { time: string, displayTime: string, isAfternoon: boolean }[] = [];
  closestTime: string = "";

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
    // Sort tasks by start time
    const sortedTasks = tasks.sort((a, b) => this.timeToMinutes(a.getStartTime()) - this.timeToMinutes(b.getStartTime()));

    const overlappingTasks = [];
    let currentOverlapGroup = [sortedTasks[0]];

    for (let i = 1; i < sortedTasks.length; i++) {
      const currentTask = sortedTasks[i];
      const lastTaskInGroup = currentOverlapGroup[currentOverlapGroup.length - 1];

      // If the current task starts before the last task in the group ends, they are overlapping
      if (this.timeToMinutes(currentTask.getStartTime()) < this.timeToMinutes(lastTaskInGroup.getEndTime())) {
        currentOverlapGroup.push(currentTask);
      } else {
        overlappingTasks.push(currentOverlapGroup);
        currentOverlapGroup = [currentTask];
      }
    }

    overlappingTasks.push(currentOverlapGroup);

    return overlappingTasks;
  }

  calculateTaskWidthAndPosition(task: Task, tasks: Task[]): { width: string, left: string } {
    const overlappingGroup = this.identifyOverlappingTasks(tasks).find(group => group.includes(task));

    if (!overlappingGroup) {
      return { width: 'calc(70% - 80px)', left: '80px' }; // Adjust the left value as needed
    }

    const numTasks = overlappingGroup.length;
    const remainingWidth = `calc(95% - 80px)`;
    const width = `calc(${remainingWidth} / ${numTasks + numTasks*0.5})`;
    const taskIndex = overlappingGroup.indexOf(task);
    const left = `calc(80px + (${taskIndex} * (${remainingWidth} / ${numTasks})))`;

    return { width, left };
  }

  highlightTasks(tasks: Task[]) {
    this.tasks = tasks;
    console.log(this.tasks)
    this.showPopup = true;
  }
}
