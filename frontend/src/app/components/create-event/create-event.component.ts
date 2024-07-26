import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreateEventService } from '../../shared/services/create-event.service';
import { SidebarService } from '../../shared/services/sidebar.service';
import { Category } from "../../shared/enum/event-category.enum";
import { Router } from '@angular/router';
import { timeRangeValidator } from '../../shared/classes/time-range.validator';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css']
})
export class CreateEventComponent implements OnInit {
  eventForm: FormGroup;
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

  constructor(
    private fb: FormBuilder,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private createEventService: CreateEventService,
    private SidebarService: SidebarService,
    private router: Router
  ) {
    this.eventForm = this.fb.group({
      name: ['', Validators.required],
      priority: ['', Validators.required],
      flexibility: ['', Validators.required],
      start_date: [''],
      setTime: this.fb.group({
        from: [''],
        until: ['']
      }, { validators: timeRangeValidator }),
      whole_day: [false],
      repeat: [false],
      repeatOptions: this.fb.group({
        frequency: [0],
        always: [false],
        times: [1]
      }),
      location: ['', Validators.required],
      category: [Category.WORK, Validators.required],
      description: ['', Validators.required],
      alarms: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.setupPriorityBoxes();
    this.setupEventListeners();
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
      const setTimeGroup = form.get('setTime') as FormGroup | null;

      if (value === 'yes') {
        setTimeGroup?.get('from')?.clearValidators();
        setTimeGroup?.get('until')?.clearValidators();
      } else if (value === 'no') {
        setTimeGroup?.get('from')?.setValidators(Validators.required);
        setTimeGroup?.get('until')?.setValidators(Validators.required);
      }

      setTimeGroup?.get('from')?.updateValueAndValidity();
      setTimeGroup?.get('until')?.updateValueAndValidity();
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

  onSubmit() {
    if (this.eventForm.valid) {
      const formData = this.eventForm.value;
      console.log(formData);

      let start_date = new Date(formData.start_date);

      let start_time, end_time;

      if (formData.whole_day) {
        // Set default start time to 00:00 and end time to 23:59
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
        user_id: this.SidebarService.getUserId(),
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
      let res = this.createEventService.createEvent(event);
      res.subscribe((data) => {
        this.router.navigate(['/my-calendar']);
      })
    } else {
      console.log('Form is invalid. Please correct the errors.');
    }
  }
}
