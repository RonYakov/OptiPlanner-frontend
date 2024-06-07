import { Component, AfterViewInit, Renderer2, ElementRef } from '@angular/core';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css']
})
export class CreateEventComponent implements AfterViewInit {

  constructor(private renderer: Renderer2, private elementRef: ElementRef) { }

  ngAfterViewInit(): void {
    this.setupPriorityBoxes();
    this.setupEventListeners();

    // Set up event listener for "Set another alarm" button
    const addAlarmButton = this.elementRef.nativeElement.querySelector('#add-alarm');
    addAlarmButton.addEventListener('click', () => this.addAlarm());
  }


  setupPriorityBoxes(): void {
    console.log('Setting up priority boxes...');

    // Use Renderer2 to create and append DOM elements
    const priorityContainer = this.elementRef.nativeElement.querySelector('#priority') as HTMLElement;
    const priorityValue = this.elementRef.nativeElement.querySelector('#priority-value') as HTMLInputElement;
    const priorityColor = '#4B7F72';

    // Check if priorityContainer already has children to avoid duplicates
    if (priorityContainer.children.length === 0) {
      for (let i = 7; i >= 1; i--) { // Reversed the loop to start with brightest color first
        const box = this.renderer.createElement('div');
        this.renderer.addClass(box, 'priority-box');
        this.renderer.setStyle(box, 'backgroundColor', this.lightenDarkenColor(priorityColor, (i - 1) * 10));
        this.renderer.setProperty(box, 'dataset.value', i.toString());
        this.renderer.listen(box, 'click', () => {
          console.log('Priority box clicked:', box.dataset['value']!);
          priorityValue.value = box.dataset['value']!;
          // Remove 'selected' class from all priority boxes
          document.querySelectorAll('.priority-box').forEach(b => b.classList.remove('selected'));
          // Add 'selected' class to the clicked priority box
          box.classList.add('selected');
        });
        this.renderer.appendChild(priorityContainer, box);
      }
    }
  }

  setupEventListeners(): void {
    const flexibilityYes = this.elementRef.nativeElement.querySelector('#flexibility-yes') as HTMLInputElement;
    const flexibilityNo = this.elementRef.nativeElement.querySelector('#flexibility-no') as HTMLInputElement;
    const flexibilityYesOptions = this.elementRef.nativeElement.querySelector('#flexibility-yes-options') as HTMLElement;
    const flexibilityNoOptions = this.elementRef.nativeElement.querySelector('#flexibility-no-options') as HTMLElement;
    const wholeDayYes = this.elementRef.nativeElement.querySelector('#whole-day-yes') as HTMLInputElement;
    const wholeDayNo = this.elementRef.nativeElement.querySelector('#whole-day-no') as HTMLInputElement;
    const timeRangeYesOptions = this.elementRef.nativeElement.querySelector('#time-range-yes-options') as HTMLElement;
    const timeRangeNoOptions = this.elementRef.nativeElement.querySelector('#time-range-no-options') as HTMLElement;
    const totalTimeNeededContainer = this.elementRef.nativeElement.querySelector('#total-time-needed-container') as HTMLElement;
    const repeat = this.elementRef.nativeElement.querySelector('#repeat') as HTMLInputElement;
    const repeatOptions = this.elementRef.nativeElement.querySelector('#repeat-options') as HTMLElement;
    const always = this.elementRef.nativeElement.querySelector('#always') as HTMLInputElement;
    const repeatCountOptions = this.elementRef.nativeElement.querySelector('#repeat-count-options') as HTMLElement;

    flexibilityYes.addEventListener('change', () => {
      flexibilityYesOptions.style.display = 'block';
      flexibilityNoOptions.style.display = 'none';
    });

    flexibilityNo.addEventListener('change', () => {
      flexibilityYesOptions.style.display = 'none';
      flexibilityNoOptions.style.display = 'block';
    });

    wholeDayYes.addEventListener('change', () => {
      if (wholeDayYes.checked) {
        timeRangeYesOptions.style.display = 'none';
        totalTimeNeededContainer.style.display = 'none';
      } else {
        timeRangeYesOptions.style.display = 'block';
        totalTimeNeededContainer.style.display = 'block';
      }
    });

    wholeDayNo.addEventListener('change', () => {
      if (wholeDayNo.checked) {
        timeRangeNoOptions.style.display = 'none';
      } else {
        timeRangeNoOptions.style.display = 'block';
      }
    });

    repeat.addEventListener('change', () => {
      if (repeat.checked) {
        repeatOptions.style.display = 'block';
      } else {
        repeatOptions.style.display = 'none';
      }
    });

    always.addEventListener('change', () => {
      if (always.checked) {
        repeatCountOptions.style.display = 'none';
      } else {
        repeatCountOptions.style.display = 'block';
      }
    });
  }



  lightenDarkenColor(col: string, amt: number): string {
    let usePound = false;
    if (col[0] === "#") {
      col = col.slice(1);
      usePound = true;
    }

    const num = parseInt(col, 16);
    let r = (num >> 16) + amt;
    if (r > 255) r = 255;
    else if (r < 0) r = 0;

    let g = ((num >> 8) & 0x00FF) + amt;
    if (g > 255) g = 255;
    else if (g < 0) g = 0;

    let b = (num & 0x0000FF) + amt;
    if (b > 255) b = 255;
    else if (b < 0) b = 0;

    return (usePound ? "#" : "") + (b | (g << 8) | (r << 16)).toString(16);
  }

  addAlarm() {
    const alarmDiv = this.renderer.createElement('div');
    this.renderer.addClass(alarmDiv, 'form-group');

    const label = this.renderer.createElement('label');
    const labelText = this.renderer.createText('Set another alarm:');
    this.renderer.appendChild(label, labelText);
    this.renderer.appendChild(alarmDiv, label);

    const input = this.renderer.createElement('input');
    this.renderer.setProperty(input, 'type', 'number');
    this.renderer.setProperty(input, 'min', '1');
    this.renderer.setProperty(input, 'max', '99');
    this.renderer.setProperty(input, 'required', true);
    this.renderer.appendChild(alarmDiv, input);

    const select = this.renderer.createElement('select');
    ['Month', 'Week', 'Day', 'Hour', 'Minute'].forEach(unit => {
      const option = this.renderer.createElement('option');
      this.renderer.setProperty(option, 'value', unit.toLowerCase());
      const optionText = this.renderer.createText(unit);
      this.renderer.appendChild(option, optionText);
      this.renderer.appendChild(select, option);
    });
    this.renderer.setProperty(select, 'required', true);
    this.renderer.appendChild(alarmDiv, select);

    const span = this.renderer.createElement('span');
    const spanText = this.renderer.createText('before');
    this.renderer.appendChild(span, spanText);
    this.renderer.appendChild(alarmDiv, span);

    const additionalAlarms = this.elementRef.nativeElement.querySelector('#additional-alarms');
    if (additionalAlarms) {
      this.renderer.appendChild(additionalAlarms, alarmDiv);
    } else {
      console.error('Element with ID "additional-alarms" not found');
    }
  }
}


