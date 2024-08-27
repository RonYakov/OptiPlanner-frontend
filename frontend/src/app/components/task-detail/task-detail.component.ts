import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Task } from '../../shared/classes/task';
import { CalendarService } from '../../shared/services/calendar.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateEventComponent } from '../create-event/create-event.component';
import { CreateEventService } from '../../shared/services/create-event.service';
import { LoadingService } from '../../shared/services/loading.service';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.css']
})
export class TaskDetailComponent implements OnInit {
  @Input() task!: Task;
  @Output() close = new EventEmitter<void>();

  showResolver = false;
  conflictingEvents: any[] = [];
  newEvent: any = null;

  constructor(private calendarService: CalendarService,
              private modalService: NgbModal,
              private  createEventService: CreateEventService,
              private loadingService: LoadingService) { }

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
    this.newEvent = this.task.name;
    const modalRef = this.modalService.open(CreateEventComponent, { size: 'lg' });
    modalRef.componentInstance.task = this.task;

    modalRef.result.then((event) => {
      this.task = Object.assign(this.task, event);
      this.loadingService.setLoading(true);
      let res = this.createEventService.editEvent(this.task);
      res.subscribe((data) => {
        this.loadingService.setLoading(false);
        if(data.status === 200){
          window.location.reload();
        } else {
          this.ifEventCreationFailed(data);
        }
      });
    }).catch((error) => {
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

  private ifEventCreationFailed(data: any) {
    this.conflictingEvents = data.object1;
    this.showResolver = true;
  }

  onResolveConflicts() {
    this.showResolver = false;
    this.retryEventCreation();
  }

  onCancelEditing() {
    this.showResolver = false;
    window.location.reload();
  }

  private retryEventCreation() {
    this.loadingService.setLoading(true);

    let res = this.createEventService.editChangeEvents(this.task, this.conflictingEvents);
    res.subscribe((data) => {
      this.loadingService.setLoading(false);

      if(data.status === 200) {
        window.location.reload();
      } else{
        this.ifEventCreationFailed(data);
      }
    });
  }
}
