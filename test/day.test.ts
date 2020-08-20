import { expect } from '@open-wc/testing';
import { Day } from '../src/day.js';

describe('Day', () => {
  it('has date = 819167040 and title = 17', async () => {
    const date = new Date('December 17, 1995 03:24:00');
    const day = new Day(date);

    expect(day.date).to.equal(819167040);
    expect(day.title).to.equal(17);
  });
});
