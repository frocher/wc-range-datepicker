/* eslint-disable import/no-duplicates */
import { html, fixture, expect } from '@open-wc/testing';
import { enUS, fr } from 'date-fns/esm/locale';

import { RangeDatepickerCalendar } from '../src/range-datepicker-calendar.js';
import '../src/range-datepicker-calendar.js';

describe('RangeDatepickerCalendar', () => {
  it('has default language as enUS', async () => {
    const el: RangeDatepickerCalendar = await fixture(
      html` <wc-range-datepicker-calendar></wc-range-datepicker-calendar> `
    );
    expect(el.locale).to.equal(enUS);
  });

  it('has language as fr', async () => {
    const el: RangeDatepickerCalendar = await fixture(
      html`
        <wc-range-datepicker-calendar
          .locale=${fr}
        ></wc-range-datepicker-calendar>
      `
    );
    expect(el.locale).to.equal(fr);
  });

  it('has prev and next month buttons', async () => {
    const el: RangeDatepickerCalendar = await fixture(
      html`
        <wc-range-datepicker-calendar prev next></wc-range-datepicker-calendar>
      `
    );

    const prev = el.shadowRoot!.querySelector(
      'mwc-icon-button[icon="chevron_left"]'
    );
    const next = el.shadowRoot!.querySelector(
      'mwc-icon-button[icon="chevron_right"]'
    );

    expect(prev).not.to.be.equal(null);
    expect(next).not.to.be.equal(null);
  });
});
