import { format } from 'date-fns';

export class Timestamp {
  constructor(private readonly date = new Date()) {}

  public toString(dateFormat: string): string {
    return format(this.#date(), dateFormat);
  }

  #date(): Date {
    return new Date(
      this.date.getUTCFullYear(),
      this.date.getUTCMonth(),
      this.date.getUTCDate(),
      this.date.getUTCHours(),
      this.date.getUTCMinutes(),
      this.date.getUTCSeconds(),
      this.date.getUTCMilliseconds()
    );
  }
}
