import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Task } from '../../shared/classes/task';
import { CalendarService } from '../../shared/services/calendar.service'

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.css']
})
export class TaskDetailComponent implements OnInit {
  @Input() task!: Task;
  @Output() close = new EventEmitter<void>();

  constructor(private calendarService: CalendarService) { }

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
    if (window.confirm('Are you sure you want to delete this task?')) {
      this.calendarService.deleteEvent(this.task.id).subscribe(res => {
        if (res.status === 200) {
          window.location.reload();
        } else {
          console.error(res.data);
        }
      });
    }
  }
}
