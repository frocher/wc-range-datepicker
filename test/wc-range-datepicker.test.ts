import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { getMonth, getYear } from 'date-fns';
import { fr } from 'date-fns/esm/locale';
import { RangeDatepicker } from '../src/range-datepicker.js';
import '../src/wc-range-datepicker.js';

describe('RangeDatepicker', () => {
  it('has month and year current month and year', async () => {
    const el = await fixture<RangeDatepicker>(
      html`<wc-range-datepicker></wc-range-datepicker>`
    );

    const now = new Date();
    const month = getMonth(now) + 1;
    const year = getYear(now);

    expect(el.month).to.equal(month);
    expect(el.year).to.equal(year);
  });

  it('has month equal 4', async () => {
    const el: RangeDatepicker = await fixture(
      html`<wc-range-datepicker month="04"></wc-range-datepicker>`
    );

    expect(el.month).to.equal(4);
  });

  it('has two calendars', async () => {
    const el: RangeDatepicker = await fixture(
      html` <wc-range-datepicker></wc-range-datepicker> `
    );

    const calendars = el.shadowRoot!.querySelectorAll(
      'wc-range-datepicker-calendar'
    );
    expect(calendars.length).to.equal(2);
  });

  it('has only one calendar', async () => {
    const el: RangeDatepicker = await fixture(
      html` <wc-range-datepicker forceNarrow="true"></wc-range-datepicker> `
    );

    const calendars = el.shadowRoot!.querySelectorAll(
      'wc-range-datepicker-calendar'
    );
    expect(calendars.length).to.equal(1);
  });

  it('has default language as null', async () => {
    const el: RangeDatepicker = await fixture(
      html` <wc-range-datepicker></wc-range-datepicker>`
    );
    expect(el.locale).to.equal(null);
  });

  it('has language as fr', async () => {
    const el: RangeDatepicker = await fixture(
      html` <wc-range-datepicker .locale=${fr}></wc-range-datepicker>`
    );
    expect(el.locale).to.equal(fr);
  });

  it('passes the a11y audit', async () => {
    const el: RangeDatepicker = await fixture(
      html` <wc-range-datepicker month="04"></wc-range-datepicker> `
    );

    await expect(el).shadowDom.to.be.accessible();
  });
});
