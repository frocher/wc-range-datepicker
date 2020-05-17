import { format } from 'date-fns';

export class Day {
  date: number;
  title: number;

  constructor(date: Date) {
    this.date = parseInt(format(date, 't'), 10);
    this.title = parseInt(format(date, 'd'), 10);
  }
}