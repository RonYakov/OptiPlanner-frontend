import { EventAlarm } from './eventAlarm';

export class Task {
  constructor(
    public id: string,
    public user_id: string,
    public name: string,
    public priority: number,
    public flexible: boolean,
    public start_date: Date,
    public end_date: Date,
    public whole_day: boolean,
    public start_time: Date,
    public end_time: Date,
    public repeat?: boolean,
    public repeat_type?: number,
    public repeat_interval?: number,
    public location?: string,
    public category?: number,
    public description?: string,
    public alarms?: EventAlarm[],
    public from_flexible_date?: Date,
    public until_flexible_date?: Date,
    public from_flexible_time?: Date,
    public until_flexible_time?: Date
  ) {}

  getStartTime(): string {
    return this.formatTime(this.start_time);
  }

  getEndTime(): string {
    return this.formatTime(this.end_time);
  }

  private formatTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }
}
