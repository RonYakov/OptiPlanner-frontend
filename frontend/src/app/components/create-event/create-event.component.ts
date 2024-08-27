import { Component, OnInit, Renderer2, ElementRef, Optional } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
  ValidatorFn,
  AbstractControl,
  FormControl,
  ValidationErrors
} from '@angular/forms';
import { CreateEventService } from '../../shared/services/create-event.service';
import { SidebarService } from '../../shared/services/sidebar.service';
import { Category } from "../../shared/enum/event-category.enum";
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LoadingService } from '../../shared/services/loading.service';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css'],
})
export class CreateEventComponent implements OnInit {
  showResolver = false;
  conflictingEvents: any[] = [];
  eventName: any = null;

  task: any;
  isModal: boolean = false;
  eventForm: FormGroup = this.fb.group({});
  priorityLevels = Array.from({length: 2}, (_, i) => i + 1).reverse();
  flexibilityOptions = [
    {value: 'yes', label: 'Yes'},
    {value: 'no', label: 'No'}
  ];
  frequencyOptions = [
    {label: 'Daily', value: 1},
    {label: 'Weekly', value: 2},
    {label: 'Monthly', value: 3},
    {label: 'Yearly', value: 4}
  ];
  alarmUnits = ['Month', 'Week', 'Day', 'Hour', 'Minute'];
  time = {hour: 13, minute: 30};
  untilTimeChecker: any;

  constructor(
    private fb: FormBuilder,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private createEventService: CreateEventService,
    private sidebarService: SidebarService,
    private router: Router,
    @Optional() public activeModal: NgbActiveModal,
    private loadingService: LoadingService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.setupImmediateValidation();
    this.isModal = !!this.activeModal;
    if (this.isModal && this.task) {
      this.populateForm();
    }

    this.eventForm.get('flexibility')?.valueChanges.subscribe(value => {
      if (value === 'yes') {
        setTimeout(() => {
          this.setupPriorityBoxes();
        });
      }
    });

    this.setupEventListeners();
  }

  ngOnChanges(changes: any) {

  }

  private setupImmediateValidation(): void {
    const setTimeGroup = this.eventForm.get('setTime') as FormGroup;
    setTimeGroup.get('from')?.valueChanges.subscribe(() => {
      setTimeGroup.updateValueAndValidity();
    });
    setTimeGroup.get('until')?.valueChanges.subscribe(() => {
      setTimeGroup.updateValueAndValidity();
    });
  }

  private initForm(): void {
    this.eventForm = this.fb.group({
      name: ['', Validators.required],
      flexibility: ['', Validators.required],
      location: ['', Validators.required],
      category: [Category.WORK, Validators.required],
      description: ['', Validators.required],

      // Flexible fields
      priority: [''],
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

      // Non-flexible fields
      start_date: [''],
      setTime: this.fb.group({
        from: ['', Validators.required],
        until: ['', Validators.required]
      }, {validators: this.timeRangeValidator()}),
      whole_day: [false],

      // Other fields
      repeat: [false],
      repeatOptions: this.fb.group({
        frequency: [0],
        times: [1]
      }),
      alarms: this.fb.array([])
    });
  }

  private populateForm(): void {
    if (!this.task) return;

    // Parse and format the start_date
    const startDateString = this.task.start_date;
    const startDate = new Date(startDateString);
    startDate.setDate(startDate.getDate() + 1);
    const formattedStartDate = startDate.toISOString().split('T')[0];

    let formattedEndDate = null;
    if (this.task.end_date) {
      const endDateString = this.task.end_date;
      const endDate = new Date(endDateString);
      endDate.setDate(endDate.getDate() + 1);
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

    let dateRangeStart = formattedStartDate;
    let dateRangeEnd = formattedEndDate;
    let timeRangeStart = formattedStartTime;
    let timeRangeEnd = formattedEndTime;
    if(this.task.flexible) {
      console.log(this.task)
      const startDateRangeString = this.task.from_flexible_date;
      const startDateRange = new Date(startDateRangeString);
      startDateRange.setDate(startDateRange.getDate() + 1);
      dateRangeStart = startDateRange.toISOString().split('T')[0];

      const endDateRangeString = this.task.until_flexible_date;
      const endDateRange = new Date(endDateRangeString);
      endDateRange.setDate(endDateRange.getDate() + 1);
      dateRangeEnd = endDateRange.toISOString().split('T')[0];

      const startTimeRangeString = this.task.from_flexible_time;
      const startTimeRange = new Date(startTimeRangeString);
      timeRangeStart = startTimeRange.toTimeString().split(' ')[0];

      const endTimeRangeString = this.task.until_flexible_time;
      const endTimeRange = new Date(endTimeRangeString);
      timeRangeEnd = endTimeRange.toTimeString().split(' ')[0];
    }

    this.eventForm.patchValue({
      name: this.task.name,
      priority: this.task.priority,
      flexibility: this.task.flexible ? 'yes' : 'no',
      default_date: formattedStartDate,
      date_range: {
        start: dateRangeStart,
        end: dateRangeEnd
      },
      time_range: {
        start: timeRangeStart,
        end: timeRangeEnd
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
    console.log('Setting up priority boxes');
    const priorityColor = '#4B7F72';
    const priorityContainer = this.elementRef.nativeElement.querySelector('#priority');
    console.log('Priority container:', priorityContainer);
    console.log('Priority levels:', this.priorityLevels);

    if (priorityContainer) {
      priorityContainer.innerHTML = ''; // Clear existing content
      this.priorityLevels.forEach(level => {
        console.log('Creating box for level:', level);
        const color = this.lightenDarkenColor(priorityColor, (level - 1) * 10);
        const box = this.renderer.createElement('div');
        this.renderer.addClass(box, 'priority-box');
        this.renderer.setStyle(box, 'backgroundColor', color);
        this.renderer.setProperty(box, 'dataset.value', level);
        this.renderer.listen(box, 'click', () => {
          this.eventForm.get('priority')?.setValue(level);
          this.eventForm.get('priority')?.markAsTouched();
          this.eventForm.get('priority')?.updateValueAndValidity();
          this.highlightSelectedPriorityBox(box);
        });
        this.renderer.appendChild(priorityContainer, box);
      });
    } else {
      console.error('Priority container not found');
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
      const flexibleControls = ['priority', 'default_date', 'date_range', 'time_range', 'start_time', 'end_time'];
      const nonFlexibleControls = ['start_date', 'setTime', 'whole_day'];

      if (value === 'yes') {
        flexibleControls.forEach(control => {
          form.get(control)?.setValidators(Validators.required);
          form.get(control)?.updateValueAndValidity();
        });
        nonFlexibleControls.forEach(control => {
          form.get(control)?.clearValidators();
          form.get(control)?.updateValueAndValidity();
        });

        // Apply dateRangeValidator when default_date is set
        form.get('default_date')?.valueChanges.subscribe(defaultDate => {
          if (defaultDate) {
            form.get('date_range')?.setValidators(this.dateRangeValidator(defaultDate));
          } else {
            form.get('date_range')?.clearValidators();
          }
          form.get('date_range')?.updateValueAndValidity();
        });

        // Apply timeRangeValidator when start_time and end_time are set
        form.get('start_time')?.valueChanges.subscribe(startTime => {
          const endTime = form.get('end_time')?.value;
          if (startTime && endTime) {
            form.get('time_range')?.setValidators(this.timeRangeValidator());
            form.get('time_range')?.updateValueAndValidity();
          }
        });

        form.get('end_time')?.valueChanges.subscribe(endTime => {
          const startTime = form.get('start_time')?.value;
          if (startTime && endTime) {
            form.get('time_range')?.setValidators(this.timeRangeValidator());
            form.get('time_range')?.updateValueAndValidity();
          }
        });

      } else {
        flexibleControls.forEach(control => {
          form.get(control)?.clearValidators();
          form.get(control)?.updateValueAndValidity();
        });
        nonFlexibleControls.forEach(control => {
          if (control !== 'whole_day') {
            form.get(control)?.setValidators(Validators.required);
            form.get(control)?.updateValueAndValidity();
          }
        });

        // Clear flexible validators
        form.get('date_range')?.clearValidators();
        form.get('time_range')?.clearValidators();
        form.get('date_range')?.updateValueAndValidity();
        form.get('time_range')?.updateValueAndValidity();
      }

      // Special handling for setTime group
      const setTimeGroup = form.get('setTime') as FormGroup;
      if (value === 'no' && !form.get('whole_day')?.value) {
        setTimeGroup.get('from')?.setValidators(Validators.required);
        setTimeGroup.get('until')?.setValidators(Validators.required);
      } else {
        setTimeGroup.get('from')?.clearValidators();
        setTimeGroup.get('until')?.clearValidators();
      }
      setTimeGroup.get('from')?.updateValueAndValidity();
      setTimeGroup.get('until')?.updateValueAndValidity();
    });

    form.get('whole_day')?.valueChanges.subscribe(value => {
      const setTimeGroup = form.get('setTime') as FormGroup;
      if (form.get('flexibility')?.value === 'no') {
        if (value) {
          setTimeGroup.get('from')?.clearValidators();
          setTimeGroup.get('until')?.clearValidators();
          setTimeGroup.get('from')?.setValue('');
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

  // timeRangeValidator(startTime: string, endTime: string): ValidatorFn {
  //   return (group: AbstractControl): {[key: string]: any} | null => {
  //     const startRange = new Date(`1970-01-01T${group.get('start')?.value}:00`);
  //     const endRange = new Date(`1970-01-01T${group.get('end')?.value}:00`);
  //     const start = new Date(`1970-01-01T${startTime}:00`);
  //     const end = new Date(`1970-01-01T${endTime}:00`);
  //     const diff = Math.abs(end.getTime() - start.getTime()) / 3600000; // difference in hours
  //     const range = Math.abs(endRange.getTime() - startRange.getTime()) / 3600000; // range in hours
  //
  //     if (startRange > endRange) {
  //       return { 'startRangeAfterEndRange': { value: group.value } };
  //     } else if (start > end) {
  //       return { 'startTimeAfterEndTime': { value: group.value } };
  //     } else if (diff <= range) {
  //       return null;
  //     } else {
  //       return { 'timeRangeExceeded': { value: group.value } };
  //     }
  //   };
  // }

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

  createEventToSend(){
    const formData = this.eventForm.value;
    let event: any = {
      user_id: this.sidebarService.getUserId(),
      name: formData.name,
      flexible: formData.flexibility === 'yes',
      location: formData.location,
      category: formData.category,
      description: formData.description,
      repeat: formData.repeat,
      repeat_type: formData.repeatOptions.frequency,
      repeat_interval: formData.repeatOptions.times,
      alarms: formData.alarms
    };

    if (formData.flexibility === 'yes') {
      let start_date = new Date(formData.default_date);
      let end_date = new Date(formData.default_date);
      let from_flexible_date = new Date(formData.date_range.start);
      let until_flexible_date = new Date(formData.date_range.end);
      let start_time, end_time, from_flexible_time, until_flexible_time;

      let startTimeString = formData.start_time.split(':');
      let endTimeString = formData.end_time.split(':');
      let fromFlexibleTimeString = formData.time_range.start.split(':');
      let untilFlexibleTimeString = formData.time_range.end.split(':');

      start_time = new Date(start_date.setHours(startTimeString[0], startTimeString[1]));
      end_time = new Date(end_date.setHours(endTimeString[0], endTimeString[1]));
      from_flexible_time = new Date(start_date.setHours(fromFlexibleTimeString[0], fromFlexibleTimeString[1]));
      until_flexible_time = new Date(end_date.setHours(untilFlexibleTimeString[0], untilFlexibleTimeString[1]));

      return {
        ...event,
        priority: formData.priority,
        start_date: start_date,
        end_date: end_date,
        start_time: start_time,
        end_time: end_time,
        from_flexible_date: from_flexible_date,
        until_flexible_date: until_flexible_date,
        from_flexible_time: from_flexible_time,
        until_flexible_time: until_flexible_time
      };
    } else {
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
      return {
        ...event,
        priority: 3,
        start_date: start_date,
        end_date: start_date,
        whole_day: formData.whole_day,
        start_time: start_time,
        end_time: end_time
      };
    }
  }


  onSubmit() {
    if (this.eventForm.valid ) {
    const event = this.createEventToSend();

      if (!this.isModal) {
        this.loadingService.setLoading(true);
        this.createEventService.createEvent(event).subscribe(data => {
          this.loadingService.setLoading(false);

          if(data.status === 200) {
            this.router.navigate(['/my-calendar']);
          } else{
            this.ifEventCreationFailed(data);
          }
        });
      } else {
        if (typeof event.category === 'string') {
          const categories = [
            'WORK', 'PERSONAL', 'FAMILY', 'HEALTH', 'EDUCATION',
            'FINANCE', 'SOCIAL', 'TRAVEL', 'ENTERTAINMENT', 'SPORTS',
            'MEETING', 'HOLIDAY', 'APPOINTMENT', 'REMINDER', 'SHOPPING', 'OTHER'
          ];
          event.category = categories.indexOf(event.category) + 1;
        }
        this.activeModal.close(event);
      }
    } else {
      console.log('Form is invalid. Please correct the errors.');
      console.log(this.eventForm.value);
      console.log(this.eventForm.errors);

      Object.keys(this.eventForm.controls).forEach(key => {
        const control = this.eventForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  timeRangeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const fromTime = control.get('from')?.value;
      const untilTime = control.get('until')?.value;

      if (fromTime && untilTime && fromTime >= untilTime) {
        return { timeRangeInvalid: true };
      }
      return null;
    };
  }

  invalidUntilTime() {
    const setTimeGroup = this.eventForm.get('setTime') as FormGroup;
    const fromTime = setTimeGroup.get('from')?.value;
    const untilTime = setTimeGroup.get('until')?.value;

    if (fromTime && untilTime) {
      const [fromHour, fromMinute] = fromTime.split(':');
      const [untilHour, untilMinute] = untilTime.split(':');

      if(parseInt(fromHour) - parseInt(untilHour) < 0){
        return false;
      }else if(parseInt(fromHour) - parseInt(untilHour)  === 0){
        return parseInt(fromMinute) - parseInt(untilMinute) >= 0;
      }
      return true;
    }
    return false;
  }

  isUntilIn() {
    const setTimeGroup = this.eventForm.get('setTime') as FormGroup;

    return setTimeGroup.get('until')?.value !== '' && setTimeGroup.get('until')?.value;
  }

  validTimeToSubmit() {
    const setTimeGroup = this.eventForm.get('setTime') as FormGroup;
    const fromTime = setTimeGroup.get('from')?.value;
    const untilTime = setTimeGroup.get('until')?.value;


    return this.invalidUntilTime() && fromTime && untilTime;
  }

  invalidEndTime() {
    // const timeRange = this.eventForm.get('time_range') as FormGroup;
    // const start = timeRange.get('start_time')?.value;
    // const end = timeRange.get('end_time')?.value;
    let start = this.eventForm.get('start_time')?.value;
    let end = this.eventForm.get('end_time')?.value;

    if (start && end) {
      const [startHour, startMinute] = start.split(':');
      const [endHour, endMinute] = end.split(':');

      if(parseInt(startHour) - parseInt(endHour) < 0){
        return false;
      }else if(parseInt(startHour) - parseInt(endHour)  === 0){
        return parseInt(startMinute) - parseInt(endMinute) >= 0;
      }
      return true;
    }
    return false;
  }

  validFlexTimeToSubmit() {
    let start = this.eventForm.get('start_time')?.value;
    let end = this.eventForm.get('end_time')?.value;

    return this.invalidEndTime() && start && end;
  }

  invalidEndRangeTime() {
    const timeRange = this.eventForm.get('time_range') as FormGroup;
    const start = timeRange.get('start')?.value;
    const end = timeRange.get('end')?.value;


    if (start && end) {
      const [startHour, startMinute] = start.split(':');
      const [endHour, endMinute] = end.split(':');

      if(parseInt(startHour) - parseInt(endHour) < 0){
        return false;
      }else if(parseInt(startHour) - parseInt(endHour)  === 0){
        return parseInt(startMinute) - parseInt(endMinute) >= 0;
      }
      return true;
    }
    return false;
  }

  validFlexTimeRangeToSubmit() {
    const timeRange = this.eventForm.get('time_range') as FormGroup;
    const start = timeRange.get('start')?.value;
    const end = timeRange.get('end')?.value;

    return this.invalidEndRangeTime() && start && end;
  }

  private ifEventCreationFailed(data: any) {
    this.conflictingEvents = [...data.object1];
      this.showResolver = true;
  }

  onResolveConflicts() {
    this.showResolver = false;
    this.retryEventCreation();
  }

  onCancelEditing() {
    this.showResolver = false;
    this.router.navigate(['/my-calendar']);
  }

  private retryEventCreation() {
    this.loadingService.setLoading(true);

    let event = this.createEventToSend();
     this.createEventService.createChangeEvents(event, this.conflictingEvents).subscribe(data => {
       this.loadingService.setLoading(false);
        console.log(data)
       if(data.status === 200) {
         this.router.navigate(['/my-calendar']);
       } else{
         this.ifEventCreationFailed(data);
       }
     });
  }
}
