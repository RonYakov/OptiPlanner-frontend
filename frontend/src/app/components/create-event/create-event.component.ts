import { Component, OnInit, Renderer2, ElementRef, Optional } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, FormControl} from '@angular/forms';
import { CreateEventService } from '../../shared/services/create-event.service';
import { SidebarService } from '../../shared/services/sidebar.service';
import { Category } from "../../shared/enum/event-category.enum";
import { Router } from '@angular/router';
import { timeRangeValidator } from '../../shared/classes/time-range.validator';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css'],
})
export class CreateEventComponent implements OnInit {
  task: any;
  isModal: boolean = false;
  eventForm: FormGroup = this.fb.group({});
  priorityLevels = Array.from({length: 7}, (_, i) => i + 1).reverse();
  flexibilityOptions = [
    {value: 'yes', label: 'Yes'},
    {value: 'no', label: 'No'}
  ];
  frequencyOptions = [
    {label: 'Daily', value: 1},
    {label: 'Weekly', value: 2},
    {label: 'Monthly', value: 3}
  ];
  alarmUnits = ['Month', 'Week', 'Day', 'Hour', 'Minute'];
  time = {hour: 13, minute: 30};

  constructor(
    private fb: FormBuilder,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private createEventService: CreateEventService,
    private sidebarService: SidebarService,
    private router: Router,
    @Optional() public activeModal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.isModal = !!this.activeModal;
    if (this.isModal && this.task) {
      this.populateForm();
    }
    this.setupPriorityBoxes();
    this.setupEventListeners();
  }

  private initForm(): void {
    this.eventForm = this.fb.group({
      name: ['', Validators.required],
      priority: ['', Validators.required],
      flexibility: ['', Validators.required],
      default_date: [''],
      date_range: this.fb.group({
        start: [''],
        end: ['']
      }),
      time_range: this.fb.group({
        start: [''],
        end: ['']
      }),
      start_time: [''],
      end_time: [''],
      start_date: [''],
      setTime: this.fb.group({
        from: [''],
        until: ['']
      }, {validators: timeRangeValidator}),
      whole_day: [false],
      repeat: [false],
      repeatOptions: this.fb.group({
        frequency: [0],
        times: [1]
      }),
      location: ['', Validators.required],
      category: [Category.WORK, Validators.required],
      description: ['', Validators.required],
      alarms: this.fb.array([])
    });
  }

  private populateForm(): void {
    if (!this.task) return;

    // Parse and format the start_date
    const startDateString = this.task.start_date;
    const startDate = new Date(startDateString);
    const formattedStartDate = startDate.toISOString().split('T')[0];

    // Parse and format the end_date if it exists
    let formattedEndDate = null;
    if (this.task.end_date) {
      const endDateString = this.task.end_date;
      const endDate = new Date(endDateString);
      formattedEndDate = endDate.toISOString().split('T')[0];
    }
    // Parse and format the start_time
    const startTimeString = this.task.start_time;
    const startTime = new Date(startTimeString);
    const formattedStartTime = startTime.toTimeString().split(' ')[0];

    // Parse and format the end_time
    const endTimeString = this.task.end_time;
    const endTime = new Date(endTimeString);
    const formattedEndTime = endTime.toTimeString().split(' ')[0];

    // Define categories array
    const categories = [
      'WORK', 'PERSONAL', 'FAMILY', 'HEALTH', 'EDUCATION',
      'FINANCE', 'SOCIAL', 'TRAVEL', 'ENTERTAINMENT', 'SPORTS',
      'MEETING', 'HOLIDAY', 'APPOINTMENT', 'REMINDER', 'SHOPPING', 'OTHER'
    ];

    // Get the category based on index
    const category = categories[this.task.category - 1];

    this.eventForm.patchValue({
      name: this.task.name,
      priority: this.task.priority,
      flexibility: this.task.flexible ? 'yes' : 'no',
      default_date: formattedStartDate,
      date_range: {
        start: formattedStartDate,
        end: formattedEndDate
      },
      time_range: {
        start: formattedStartTime,
        end: formattedEndTime
      },
      start_time: formattedStartTime,
      end_time: formattedEndTime,
      start_date: formattedStartDate,
      setTime: {
        from: formattedStartTime,
        until: formattedEndTime
      },
      whole_day: this.task.whole_day,
      repeat: this.task.repeat,
      repeatOptions: {
        frequency: this.task.repeat_type,
        times: this.task.repeat_interval
      },
      location: this.task.location,
      category: category,
      description: this.task.description
    });
  }


  setupPriorityBoxes(): void {
    const priorityColor = '#4B7F72';
    const priorityContainer = this.elementRef.nativeElement.querySelector('#priority');
    if (priorityContainer) {
      priorityContainer.innerHTML = ''; // Clear existing content
      this.priorityLevels.forEach(level => {
        const color = this.lightenDarkenColor(priorityColor, (level - 1) * 10);
        const box = this.renderer.createElement('div');
        this.renderer.addClass(box, 'priority-box');
        this.renderer.setStyle(box, 'backgroundColor', color);
        this.renderer.setProperty(box, 'dataset.value', level);
        this.renderer.listen(box, 'click', () => {
          this.eventForm.get('priority')?.setValue(level);
          this.highlightSelectedPriorityBox(box);
        });
        this.renderer.appendChild(priorityContainer, box);
      });
    }
  }

  highlightSelectedPriorityBox(selectedBox: HTMLElement): void {
    const boxes = this.elementRef.nativeElement.querySelectorAll('.priority-box');
    boxes.forEach((box: HTMLElement) => this.renderer.removeClass(box, 'selected'));
    this.renderer.addClass(selectedBox, 'selected');
  }

  setupEventListeners(): void {
    const form = this.eventForm;

    form.get('flexibility')?.valueChanges.subscribe(value => {
      const startTimeControl = form.get('start_time');
      const endTimeControl = form.get('end_time');
      const timeRangeGroup = form.get('time_range') as FormGroup | null;
      if (value === 'yes') {
        startTimeControl?.setValidators(Validators.required);
        endTimeControl?.setValidators(Validators.required);
        timeRangeGroup?.get('start')?.setValidators(Validators.required);
        timeRangeGroup?.get('end')?.setValidators(Validators.required);
      } else {
        startTimeControl?.clearValidators();
        endTimeControl?.clearValidators();
        timeRangeGroup?.get('start')?.clearValidators();
        timeRangeGroup?.get('end')?.clearValidators();
      }
      startTimeControl?.updateValueAndValidity();
      endTimeControl?.updateValueAndValidity();
      timeRangeGroup?.get('start')?.updateValueAndValidity();
      timeRangeGroup?.get('end')?.updateValueAndValidity();
    });

    form.get('default_date')?.valueChanges.subscribe(value => {
      const dateRangeGroup = form.get('date_range') as FormGroup | null;

      if (value) {
        dateRangeGroup?.setValidators(this.dateRangeValidator(value));
      } else {
        dateRangeGroup?.clearValidators();
      }

      dateRangeGroup?.updateValueAndValidity();
    });

    form.get('start_time')?.valueChanges.subscribe(value => {
      const endTimeControl = form.get('end_time');
      const timeRangeControl = form.get('time_range');

      if (value && endTimeControl?.value) {
        timeRangeControl?.setValidators([Validators.required, this.timeRangeValidator(value, endTimeControl?.value)]);
        timeRangeControl?.updateValueAndValidity();
      }
    });

    form.get('end_time')?.valueChanges.subscribe(value => {
      const startTimeControl = form.get('start_time');
      const timeRangeControl = form.get('time_range');

      if (value && startTimeControl?.value) {
        timeRangeControl?.setValidators([Validators.required, this.timeRangeValidator(startTimeControl?.value, value)]);
        timeRangeControl?.updateValueAndValidity();
      }
    });

    form.get('whole_day')?.valueChanges.subscribe(value => {
      const setTimeGroup = form.get('setTime') as FormGroup | null;

      if (setTimeGroup) {
        if (value) {
          setTimeGroup.get('from')?.clearValidators();
          setTimeGroup.get('until')?.clearValidators();
          setTimeGroup.get('from')?.setValue(''); // Clear the time values
          setTimeGroup.get('until')?.setValue('');
        } else {
          setTimeGroup.get('from')?.setValidators(Validators.required);
          setTimeGroup.get('until')?.setValidators(Validators.required);
        }

        setTimeGroup.get('from')?.updateValueAndValidity();
        setTimeGroup.get('until')?.updateValueAndValidity();
      }
    });
  }

  dateRangeValidator(defaultDate: string): ValidatorFn {
    return (group: AbstractControl): {[key: string]: any} | null => {
      const startDate = new Date(group.get('start')?.value);
      const endDate = new Date(group.get('end')?.value);
      const defaultDateObj = new Date(defaultDate);

      if (startDate > endDate) {
        return { 'startDateAfterEndDate': { value: group.value } };
      } else if (startDate <= defaultDateObj && defaultDateObj <= endDate) {
        return null; // return null if default date is within the range
      } else {
        return { 'dateOutOfRange': { value: group.value } };
      }
    };
  }

  timeRangeValidator(startTime: string, endTime: string): ValidatorFn {
    return (group: AbstractControl): {[key: string]: any} | null => {
      const startRange = new Date(`1970-01-01T${group.get('start')?.value}:00`);
      const endRange = new Date(`1970-01-01T${group.get('end')?.value}:00`);
      const start = new Date(`1970-01-01T${startTime}:00`);
      const end = new Date(`1970-01-01T${endTime}:00`);
      const diff = Math.abs(end.getTime() - start.getTime()) / 3600000; // difference in hours
      const range = Math.abs(endRange.getTime() - startRange.getTime()) / 3600000; // range in hours

      if (startRange > endRange) {
        return { 'startRangeAfterEndRange': { value: group.value } };
      } else if (start > end) {
        return { 'startTimeAfterEndTime': { value: group.value } };
      } else if (diff <= range) {
        return null;
      } else {
        return { 'timeRangeExceeded': { value: group.value } };
      }
    };
  }

  lightenDarkenColor(col: string, amt: number): string {
    let usePound = false;
    if (col[0] === '#') {
      col = col.slice(1);
      usePound = true;
    }

    const num = parseInt(col, 16);
    let r = (num >> 16) + amt;
    let g = ((num >> 8) & 0x00FF) + amt;
    let b = (num & 0x0000FF) + amt;

    r = r > 255 ? 255 : r < 0 ? 0 : r;
    g = g > 255 ? 255 : g < 0 ? 0 : g;
    b = b > 255 ? 255 : b < 0 ? 0 : b;

    return (usePound ? '#' : '') + ((r << 16) | (g << 8) | b).toString(16);
  }

  addAlarm(): void {
    const alarmGroup = this.fb.group({
      time: ['', Validators.required],
      unit: ['', Validators.required]
    });
    this.alarms.push(alarmGroup);
  }

  removeAlarm(index: number): void {
    this.alarms.removeAt(index);
  }

  get alarms(): FormArray {
    return this.eventForm.get('alarms') as FormArray;
  }

  closeModal() {
    if (this.activeModal) {
      this.activeModal.dismiss('Cross click');
    }
  }

  onSubmit() {
    if (this.eventForm.valid) {
      const formData = this.eventForm.value;

      if (this.eventForm.get('flexibility')?.value === 'no') {
        let start_date = new Date(formData.start_date);

        let start_time, end_time;

        if (formData.whole_day) {
          start_time = new Date(start_date.setHours(0, 0));
          end_time = new Date(start_date.setHours(23, 59));
        } else {
          let startTimeString = formData.setTime.from.split(':');
          let endTimeString = formData.setTime.until.split(':');

          start_time = new Date(start_date.setHours(startTimeString[0], startTimeString[1]));
          end_time = new Date(start_date.setHours(endTimeString[0], endTimeString[1]));
        }

        console.log(start_time);

        let event = {
          user_id: this.sidebarService.getUserId(),
          name: formData.name,
          priority: formData.priority,
          flexible: false,
          start_date: start_date,
          end_date: start_date,
          whole_day: formData.whole_day,
          start_time: start_time,
          end_time: end_time,
          repeat: formData.repeat,
          repeat_type: formData.repeatOptions.frequency,
          repeat_interval: formData.repeatOptions.times,
          location: formData.location,
          category: formData.category,
          description: formData.description,
          alarms: formData.alarms
        }
        if (!this.isModal) {
          let res = this.createEventService.createEvent(event);
          res.subscribe((data) => {
            this.router.navigate(['/my-calendar']);
          })
        } else {
          switch (event.category) {
            case 'WORK':
              event.category = 1;
              break;
            case 'PERSONAL':
              event.category = 2;
              break;
            case 'FAMILY':
              event.category = 3;
              break;
            case 'HEALTH':
              event.category = 4;
              break;
            case 'EDUCATION':
              event.category = 5;
              break;
            case 'FINANCE':
              event.category = 6;
              break;
            case 'SOCIAL':
              event.category = 7;
              break;
            case 'TRAVEL':
              event.category = 8;
              break;
            case 'ENTERTAINMENT':
              event.category = 9;
              break;
            case 'SPORTS':
              event.category = 10;
              break;
            case 'MEETING':
              event.category = 11;
              break;
            case 'HOLIDAY':
              event.category = 12;
              break;
            case 'APPOINTMENT':
              event.category = 13;
              break;
            case 'REMINDER':
              event.category = 14;
              break;
            case 'SHOPPING':
              event.category = 15;
              break;
            case 'OTHER':
              event.category = 16;
              break;
            default:
              event.category = -1;
          }
          this.activeModal.close(event);
        }
      } else{
        console.log("flexible event");
      }
    } else {
      console.log('Form is invalid. Please correct the errors.');
      console.log(this.eventForm.value);
      console.log(this.eventForm.errors);
    }
  }
}
