import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {ITask} from "../../shared/interface/task.interface";

@Component({
  selector: 'app-tasks-popup',
  templateUrl: './tasks.popup.component.html',
  styleUrls: ['./tasks.popup.component.css']
})
export class TasksPopupComponent implements OnInit {
  @Input() showPopup!: boolean;
  @Input() selectedDay: any;
  @Output() close = new EventEmitter<void>();

  times: { time: string, displayTime: string, isAfternoon: boolean }[] = [];
  closestTime: string = "";

  tasks: ITask[] = [
    { title: "AWS project work", description: "Front work need to be done!", startTime: '12:50', endTime: '13:30' },
    { title: "Football with friends", description: "I need to get my Liverpool shirt ready", startTime: '12:20', endTime: '13:20' },
    { title: "Test", description: "test", startTime: '12:00', endTime: '13:40' },
    { title: "Lunch Time", description: "Today i have pasta with meatballs", startTime: '14:10', endTime: '15:40' }
  ]; // Dummy tasks

  ngOnInit() {
    this.generateTimes();
    this.calculateClosestTime();
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

  isTaskInTimeRange(task: ITask, time: string): boolean {
    const [taskStartHours, taskStartMinutes] = task.startTime.split(':').map(Number);
    const [taskEndHours, taskEndMinutes] = task.endTime.split(':').map(Number);
    const [currentHours, currentMinutes] = time.split(':').map(Number);

    const taskStartTime = taskStartHours * 60 + taskStartMinutes;
    const taskEndTime = taskEndHours * 60 + taskEndMinutes;
    const currentTime = currentHours * 60 + currentMinutes;

    return currentTime >= taskStartTime && currentTime <= taskEndTime;
  }

  calculateTaskTop(task: ITask, time: string): number {
    let [taskStartHours, taskStartMinutes] = task.startTime.split(':').map(Number);

    // If the task starts in the afternoon, subtract 12 hours
    if (taskStartHours >= 12) {
      taskStartHours -= 12;
    }

    const taskStartTime = taskStartHours * 60 + taskStartMinutes;
    const top = taskStartTime * 2 + 20; // Add 20 to offset the tasks from the top of the timeline

    console.log(`Task start time: ${task.startTime}, Calculated top: ${top}`);

    return top;
  }

  calculateTaskHeight(task: ITask): number {
    const [taskStartHours, taskStartMinutes] = task.startTime.split(':').map(Number);
    const [taskEndHours, taskEndMinutes] = task.endTime.split(':').map(Number);

    const taskStartTime = taskStartHours * 60 + taskStartMinutes;
    const taskEndTime = taskEndHours * 60 + taskEndMinutes;
    const height = (taskEndTime - taskStartTime) * 2; // Multiply by 2 to convert minutes to pixels

    console.log(`Task start time: ${task.startTime}, Task end time: ${task.endTime}, Calculated height: ${height}`);

    return height - 11;
  }

  identifyOverlappingTasks(tasks: ITask[]): ITask[][] {
    // Sort tasks by start time
    const sortedTasks = tasks.sort((a, b) => this.timeToMinutes(a.startTime) - this.timeToMinutes(b.startTime));

    const overlappingTasks = [];
    let currentOverlapGroup = [sortedTasks[0]];

    for (let i = 1; i < sortedTasks.length; i++) {
      const currentTask = sortedTasks[i];
      const lastTaskInGroup = currentOverlapGroup[currentOverlapGroup.length - 1];

      // If the current task starts before the last task in the group ends, they are overlapping
      if (this.timeToMinutes(currentTask.startTime) < this.timeToMinutes(lastTaskInGroup.endTime)) {
        currentOverlapGroup.push(currentTask);
      } else {
        // If the current task does not overlap with the last task in the group, start a new group
        overlappingTasks.push(currentOverlapGroup);
        currentOverlapGroup = [currentTask];
      }
    }

    // Add the last group of overlapping tasks
    overlappingTasks.push(currentOverlapGroup);

    return overlappingTasks;
  }

  calculateTaskWidthAndPosition(task: ITask, tasks: ITask[]): { width: string, left: string } {
    const overlappingGroup = this.identifyOverlappingTasks(tasks).find(group => group.includes(task));

    if (!overlappingGroup) {
      // If there are no overlapping tasks, return default width and left values
      return { width: 'calc(70% - 80px)', left: '80px' }; // Adjust the left value as needed
    }

    // Number of overlapping tasks
    const numTasks = overlappingGroup.length;

    // Calculate the remaining width after the initial 80px
    const remainingWidth = `calc(95% - 80px)`;

    // Calculate the width for each task based on the number of overlapping tasks
    const width = `calc(${remainingWidth} / ${numTasks + numTasks*0.5})`;

    // Find the position of the current task in the overlapping group
    const taskIndex = overlappingGroup.indexOf(task);

    // Calculate the left position for each task
    const left = `calc(80px + (${taskIndex} * (${remainingWidth} / ${numTasks})))`;

    // Return the calculated width and left values
    return { width, left };
  }

}
