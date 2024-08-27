import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-failed-events',
  templateUrl: './failed-events.component.html',
  styleUrls: ['./failed-events.component.css']
})
export class FailedEventsComponent implements OnChanges {
  @Input() flexibleEvents: any[] = [];
  @Input() newEvent: any = null;
  @Output() change = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['flexibleEvents']) {
      this.cdr.detectChanges();
    }
    if (changes['newEvent']) {
      this.cdr.detectChanges();
    }
  }

  onChangeClicked() {
    console.log('Change clicked');
    this.change.emit();
  }

  onCancelClicked() {
    console.log('Cancel clicked');
    this.cancel.emit();
  }
}
