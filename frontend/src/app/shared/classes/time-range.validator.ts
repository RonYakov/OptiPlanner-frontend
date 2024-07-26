import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const timeRangeValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const fromTime = control.get('from')?.value;
  const untilTime = control.get('until')?.value;

  if (fromTime && untilTime && fromTime >= untilTime) {
    return { 'timeRangeInvalid': true };
  }
  return null;
};
