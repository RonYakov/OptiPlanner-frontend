import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Task } from '../../shared/classes/task';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.css']
})
export class TaskDetailComponent implements OnInit {
  @Input() task!: Task;
  @Output() close = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void { }

  getFormattedDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US');
  }

  getFormattedTime(date: Date): string {
    return new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }

  onClose() {
    this.close.emit();
  }

  onDelete() {
    //todo after Ido add the id to the task
  }
}
