import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Task } from '../../shared/classes/task';
import { CalendarService } from '../../shared/services/calendar.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateEventComponent } from '../create-event/create-event.component';
import { CreateEventService } from '../../shared/services/create-event.service';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.css']
})
export class TaskDetailComponent implements OnInit {
  @Input() task!: Task;
  @Output() close = new EventEmitter<void>();

  constructor(private calendarService: CalendarService,
              private modalService: NgbModal,
              private  createEventService: CreateEventService) { }

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

  onEdit() {
    const modalRef = this.modalService.open(CreateEventComponent, { size: 'lg' });
    modalRef.componentInstance.task = this.task;

    modalRef.result.then((event) => {
      this.task = Object.assign(this.task, event);

      let res = this.createEventService.editEvent(this.task);
      res.subscribe((data) => {
        window.location.reload();
      });
    }).catch((error) => {
      console.log(error);
    });
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
