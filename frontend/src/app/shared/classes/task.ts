export class Task {
  constructor(
    public user_id: string,
    public name: string,
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
    public description?: string
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
