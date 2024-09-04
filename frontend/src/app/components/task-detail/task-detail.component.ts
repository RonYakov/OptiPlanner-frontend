import {Component, Input, OnInit, Output, EventEmitter, ChangeDetectorRef} from '@angular/core';
import { Task } from '../../shared/classes/task';
import { CalendarService } from '../../shared/services/calendar.service';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { CreateEventComponent } from '../create-event/create-event.component';
import { CreateEventService } from '../../shared/services/create-event.service';
import { LoadingService } from '../../shared/services/loading.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.css']
})
export class TaskDetailComponent implements OnInit {
  @Input() task!: Task;
  @Output() close = new EventEmitter<void>();

  originalEvent: any;
  showResolver = false;
  conflictingEvents: any[] = [];
  newEvent: any = null;

  constructor(private calendarService: CalendarService,
              private modalService: NgbModal,
              private  createEventService: CreateEventService,
              private loadingService: LoadingService,
              private router: Router,
     ) { }

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
    this.originalEvent = Object.assign({}, this.task);
    const modalRef = this.modalService.open(CreateEventComponent, { size: 'lg' });
    modalRef.componentInstance.task = this.task;

    modalRef.result.then((event) => {
      this.task = Object.assign(this.task, event);
      this.loadingService.setLoading(true);
      let res = this.createEventService.editEvent(this.task);
      res.subscribe(async (data) => {
        this.loadingService.setLoading(false);
        if(data.status === 200){
          //window.location.reload();
          //this.modalService.dismissAll();
          await this.router.navigate(['/calendar']);
        } else {
          this.ifEventCreationFailed(data);
        }
      });
    }).catch((error) => {
    });
  }
  async onDelete() {
    if (window.confirm('Are you sure you want to delete this task?')) {
      this.calendarService.deleteEvent(this.task.id).subscribe(async res => {
        if (res.status === 200) {
          //window.location.reload();
          //this.activeModal.close();
          await this.router.navigate(['/calendar']);
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
    this.loadingService.setLoading(true);
    this.createEventService.createEvent(this.originalEvent).subscribe(async (data) => {
      this.loadingService.setLoading(false);
      //window.location.reload();
      await this.router.navigate(['/calendar']);
    });
  }

  private retryEventCreation() {
    this.loadingService.setLoading(true);

    let res = this.createEventService.editChangeEvents(this.task, this.conflictingEvents);
    res.subscribe(async (data) => {
      this.loadingService.setLoading(false);

      if(data.status === 200) {
        //window.location.reload();
        await this.router.navigate(['/calendar']);
      } else{
        this.ifEventCreationFailed(data);
      }
    });
  }
}
