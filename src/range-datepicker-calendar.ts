/* eslint-disable import/no-duplicates */
import { html, css, LitElement, PropertyValues, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import '@material/mwc-icon-button';
import '@material/mwc-menu';
import '@material/mwc-list/mwc-list-item';
import {
  addDays,
  addMonths,
  addYears,
  endOfMonth,
  format,
  getDay,
  parse,
  startOfDay,
  subMonths,
  subYears,
} from 'date-fns';
import { enUS } from 'date-fns/esm/locale';
import { ListItem } from '@material/mwc-list/mwc-list-item';
import { Menu } from '@material/mwc-menu';
import './range-date-picker-cell.js';
import { Day } from './day.js';

export class RangeDatepickerCalendar extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 266px;
    }

    :host > div {
      overflow: hidden;
    }

    div.table {
      display: table;
      border-collapse: collapse;
      table-layout: fixed;
    }

    div.th {
      display: table-cell;
      color: var(--range-datepicker-day-names-text, rgb(117, 117, 117));
      font-size: 11px;
      width: 38px;
      padding: 0;
      margin: 0;
      text-align: center;
    }

    div.tr {
      display: table-row;
      height: 38px;
    }

    div.td {
      display: table-cell;
      padding: 0;
      width: 38px;
      margin: 0;
      height: 38px;
    }

    .header {
      display: flex;
      flex-direction: row;
      align-items: center;
      width: 266px;
      margin: 10px 0;
      text-align: center;
      color: var(--range-datepicker-month-text);
    }

    .headerTitle {
      display: flex;
      flex: 1;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      font-size: 20px;
    }

    .header mwc-icon-button {
      padding: 0;
      --mdc-icon-size: 30px;
    }

    .header::first-letter {
      text-transform: uppercase;
    }

    .header > div > div {
      margin-right: 8px;
    }

    mwc-list {
      max-height: 200px;
    }

    div.tbody {
      transition: all 0ms;
      transform: translateX(0);
      height: 235px;
    }

    .withTransition {
      transition: all 100ms;
    }

    .moveToLeft {
      transform: translateX(-274px);
    }

    .moveToRight {
      transform: translateX(274px);
    }

    .withTransition td,
    .moveToLeft td,
    .moveToRight td {
      border: none;
    }

    .year-container {
      position: relative;
      display: flex;
      align-items: center;
    }

    .year-change {
      max-height: 200px;
    }
  `;

  /**
   * Date from. Format is Unix timestamp.
   */
  @property({ type: String }) dateFrom: string | null = null;

  /**
   * Date to. Format is Unix timestamp.
   */
  @property({ type: String }) dateTo: string | null = null;

  @property({ type: String }) hoveredDate: string | null = null;

  @property({ type: Boolean }) enableYearChange = false;

  @property({ type: String }) month = '01';

  @property({ type: Boolean }) narrow = false;

  @property({ type: Boolean }) noRange = false;

  @property({ type: Boolean }) next = false;

  @property({ type: Boolean }) prev = false;

  @property({ type: String }) year = 2020;

  @property({ type: Array }) disabledDays: Array<string> = [];

  @property({ type: Object })
  public get locale() {
    return this._locale ? this._locale : enUS;
  }

  public set locale(value) {
    const oldValue = this._locale;
    this._locale = value;
    this.requestUpdate('locale', oldValue);
  }

  /**
   * Max date. Format is Unix timestamp
   */
  @property({ type: String }) max: string | null = null;

  /**
   * Minimal date. Format is Unix timestamp
   */
  @property({ type: String }) min: string | null = null;

  @property({ type: Array }) protected yearsList: Array<number> = [];

  @property({ type: Array }) protected monthsList: Array<string> = [];

  @property({ type: Array }) protected dayNamesOfTheWeek: Array<string> = [];

  @property({ type: Array }) protected daysOfMonth: Array<Array<Day | null>> =
    [];

  protected _locale: any | null = null;

  protected currentDate: number;

  constructor() {
    super();
    this.currentDate = parseInt(format(startOfDay(Date.now()), 't'), 10);
    this.localeChanged();
    this.yearAndMonthChanged(this.year, this.month);
  }

  render(): TemplateResult {
    return html`
      <div>
        <div class="header">
          ${this.renderPrevButton()}
          <div class="headerTitle">
            <div>${this.computeCurrentMonthName(this.month, this.year)}</div>
            <div>${this.renderYear()}</div>
          </div>
          ${this.renderNextButton()}
        </div>

        <div class="table">
          <div class="thead">
            <div class="tr">
              ${this.dayNamesOfTheWeek?.map(dayNameOfWeek =>
                this.renderDayOfWeek(dayNameOfWeek)
              )}
            </div>
          </div>
          <div class="tbody">
            ${this.daysOfMonth?.map(week => this.renderWeek(week))}
          </div>
        </div>
      </div>
    `;
  }

  renderPrevButton(): TemplateResult | null {
    if (this.prev || this.narrow || this.enableYearChange) {
      return html`<mwc-icon-button
        icon="chevron_left"
        @click="${this.handlePrevMonth}"
      ></mwc-icon-button>`;
    }
    return null;
  }

  renderNextButton(): TemplateResult | null {
    if (this.next || this.narrow || this.enableYearChange) {
      return html`<mwc-icon-button
        icon="chevron_right"
        @click="${this.handleNextMonth}"
      ></mwc-icon-button>`;
    }
    return null;
  }

  renderYear(): TemplateResult {
    if (this.enableYearChange) {
      return html`
        <div class="year-container">
          ${this.year}
          <mwc-icon-button icon="arrow_drop_down" @click="${
            this.handleOpenYearSelection
          }"></mwc-icon-button>
          <mwc-menu class="year-change" @selected="${this.handleYearSelected}">
          ${this.yearsList.map(i => this.renderYearItem(i))}
          </mwc-men>
        </div>
      `;
    }

    return html`${this.year}`;
  }

  renderYearItem(item: number): TemplateResult {
    return html` <mwc-list-item value="${item}">${item}</mwc-list-item> `;
  }

  renderDayOfWeek(dayOfWeek: string): TemplateResult {
    return html`<div class="th">${dayOfWeek}</div>`;
  }

  renderWeek(week: Array<Day | null>): TemplateResult {
    return html`
      <div class="tr">${week.map(day => this.renderDay(day))}</div>
    `;
  }

  renderDay(day: Day | null): TemplateResult {
    return html`
      <div class="td ${this.tdIsEnabled(day)}">
        ${day
          ? html`
              <wc-range-datepicker-cell
                .disabledDays="${this.disabledDays}"
                .min="${this.min}"
                .max="${this.max}"
                .month="${this.month}"
                .hoveredDate="${this.hoveredDate}"
                .dateTo="${this.dateTo}"
                .dateFrom="${this.dateFrom}"
                .day="${day}"
                ?isCurrentDate="${this.isCurrentDate(day)}"
                @date-is-selected="${this.handleDateSelected}"
                @date-is-hovered="${this.handleDateHovered}"
              >
              </wc-range-datepicker-cell>
            `
          : null}
      </div>
    `;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async firstUpdated(): Promise<any> {
    this.monthsList = [
      '01',
      '02',
      '03',
      '04',
      '05',
      '06',
      '07',
      '08',
      '09',
      '10',
      '11',
      '12',
    ];
    setTimeout(() => {
      this.setYears(1930, 2100);
    });
    await this.updateComplete;
  }

  updated(properties: PropertyValues): void {
    if (properties.has('locale')) {
      this.localeChanged();
    }

    if (properties.has('year')) {
      this.dispatchEvent(
        new CustomEvent('year-changed', { detail: { value: this.year } })
      );
    }

    if (properties.has('year') || properties.has('month')) {
      this.yearAndMonthChanged(this.year, this.month);
    }
  }

  isCurrentDate(day: Day): boolean {
    const dayDate = day.date;
    return dayDate === this.currentDate;
  }

  localeChanged(): void {
    const dayNamesOfTheWeek = [];
    for (let i = 0; i < 7; i += 1) {
      dayNamesOfTheWeek.push(this.locale.localize!.day(i, { width: 'short' }));
    }

    const firstDayOfWeek: number = this.locale.options!.weekStartsOn
      ? this.locale.options!.weekStartsOn
      : 0;
    const tmp = dayNamesOfTheWeek.slice().splice(0, firstDayOfWeek);
    const newDayNamesOfTheWeek = dayNamesOfTheWeek
      .slice()
      .splice(firstDayOfWeek, dayNamesOfTheWeek.length)
      .concat(tmp);
    this.dayNamesOfTheWeek = newDayNamesOfTheWeek;
  }

  yearAndMonthChanged(year: number, month: string): void {
    if (year && month) {
      let monthMinus = `${month}`;
      monthMinus = monthMinus.substring(monthMinus.length - 2);
      let startDateString = `01/${monthMinus}/${year}`;
      let startDateFn = parse(startDateString, 'dd/MM/yyyy', new Date());
      const endDateFn = endOfMonth(startDateFn);
      const endDateString = format(endDateFn, 'dd/MM/yyyy');

      const firstDayOfWeek = this.locale.options!.weekStartsOn
        ? this.locale.options!.weekStartsOn
        : 0;

      const rows: Array<Array<Day | null>> = [];
      let columns: Array<Day | null> = [];

      const lastDayOfWeek = 6;

      while (startDateString !== endDateString) {
        let dayNumberFn = getDay(startDateFn) - firstDayOfWeek;
        if (dayNumberFn < 0) {
          dayNumberFn = 6;
        }

        const columnFn = new Day(startDateFn);
        columns.push(columnFn);

        if (dayNumberFn === lastDayOfWeek) {
          for (let i = columns.length; i < lastDayOfWeek + 1; i += 1) {
            columns.unshift(null);
          }
          rows.push(columns.slice());
          columns = [];
        }

        startDateFn = addDays(startDateFn, 1);
        startDateString = format(startDateFn, 'dd/MM/yyyy');

        if (startDateString === endDateString) {
          const endColumnFn = new Day(startDateFn);
          columns.push(endColumnFn);
          for (let i = columns.length; i <= lastDayOfWeek; i += 1) {
            columns.push(null);
          }
          rows.push(columns.slice());
          columns = [];
        }
      }
      this.daysOfMonth = rows;
    }
  }

  computeCurrentMonthName(month: string, year: number): string {
    return format(new Date(year, parseInt(month, 10) - 1), 'MMMM', {
      locale: this.locale,
    });
  }

  tdIsEnabled(day: Day | null): string {
    return day ? 'enabled' : '';
  }

  handleDateSelected(e: CustomEvent): void {
    const { detail } = e;
    const { date } = detail;
    if (!this.noRange) {
      if (this.dateFrom && this.dateTo) {
        this.dateFrom = date;
        this.dateTo = null;
        this.hoveredDate = null;
      } else if (!this.dateFrom || (this.dateFrom && date < this.dateFrom)) {
        this.dateFrom = date;
      } else if (!this.dateTo || (this.dateTo && date > this.dateTo)) {
        this.dateTo = date;
      }
    } else {
      this.dateFrom = date;
    }
    this.dispatchEvent(
      new CustomEvent('date-from-changed', { detail: { value: this.dateFrom } })
    );
    this.dispatchEvent(
      new CustomEvent('date-to-changed', { detail: { value: this.dateTo } })
    );
  }

  handleOpenYearSelection(): void {
    const menu = this.shadowRoot?.querySelector('.year-change') as Menu;
    const index = menu.items.findIndex(
      (item: ListItem) => item.value === this.year.toString()
    );
    menu.select(index);
    menu.show();
  }

  handleYearSelected(): void {
    const menu = this.shadowRoot?.querySelector('.year-change') as Menu;
    const selected = menu.selected as ListItem;
    this.year = parseInt(selected?.value, 10);
  }

  handleDateHovered(e: CustomEvent): void {
    if (!this.noRange) {
      this.hoveredDate = e.detail.date;
      this.dispatchEvent(
        new CustomEvent('hovered-date-changed', {
          detail: { value: this.hoveredDate },
        })
      );
    }
  }

  handleNextMonth(): void {
    const tbody = this.shadowRoot?.querySelector('.tbody');
    const monthName = this.shadowRoot?.querySelector('.header > div');
    tbody?.classList.add('withTransition');
    tbody?.classList.add('moveToLeft');
    monthName?.classList.add('withTransition');
    monthName?.classList.add('moveToLeft');

    const month = parse(this.month, 'MM', new Date());
    const monthPlusDate = addMonths(month, 1);
    const monthPlusString = format(monthPlusDate, 'MM', {
      locale: this.locale,
    });

    this.month = monthPlusString;
    if (this.month === '01') {
      const year = parse(this.year.toString(), 'yyyy', new Date());
      const yearPlusDate = addYears(year, 1);
      const yearPlusString = format(yearPlusDate, 'yyyy', {
        locale: this.locale,
      });
      this.year = parseInt(yearPlusString, 10);
    }
    this.dispatchEvent(new CustomEvent('next-month'));

    setTimeout(() => {
      tbody?.classList.remove('withTransition');
      tbody?.classList.add('moveToRight');
      tbody?.classList.remove('moveToLeft');
      monthName?.classList.remove('withTransition');
      monthName?.classList.add('moveToRight');
      monthName?.classList.remove('moveToLeft');

      setTimeout(() => {
        tbody?.classList.add('withTransition');
        tbody?.classList.remove('moveToRight');
        monthName?.classList.add('withTransition');
        monthName?.classList.remove('moveToRight');
        setTimeout(() => {
          tbody?.classList.remove('withTransition');
          monthName?.classList.remove('withTransition');
        }, 100);
      }, 100);
    }, 100);
  }

  handlePrevMonth(): void {
    const tbody = this.shadowRoot?.querySelector('.tbody');
    const monthName = this.shadowRoot?.querySelector('.header > div');
    tbody?.classList.add('withTransition');
    tbody?.classList.add('moveToRight');
    monthName?.classList.add('withTransition');
    monthName?.classList.add('moveToRight');

    const month = parse(this.month, 'MM', new Date());
    const monthMinusDate = subMonths(month, 1);
    const monthMinusString = format(monthMinusDate, 'MM', {
      locale: this.locale,
    });

    this.month = monthMinusString;
    if (this.month === '12') {
      const year = parse(this.year.toString(), 'yyyy', new Date());
      const yearMinusDate = subYears(year, 1);
      const yearMinusString = format(yearMinusDate, 'yyyy', {
        locale: this.locale,
      });
      this.year = parseInt(yearMinusString, 10);
    }
    this.dispatchEvent(new CustomEvent('prev-month'));

    setTimeout(() => {
      tbody?.classList.remove('withTransition');
      tbody?.classList.add('moveToLeft');
      tbody?.classList.remove('moveToRight');
      monthName?.classList.remove('withTransition');
      monthName?.classList.add('moveToLeft');
      monthName?.classList.remove('moveToRight');

      setTimeout(() => {
        tbody?.classList.add('withTransition');
        tbody?.classList.remove('moveToLeft');
        monthName?.classList.add('withTransition');
        monthName?.classList.remove('moveToLeft');
        setTimeout(() => {
          monthName?.classList.remove('withTransition');
          monthName?.classList.remove('withTransition');
        }, 100);
      }, 100);
    }, 100);
  }

  setYears(from: number, to: number): void {
    const yearsList = [];
    for (let i = from; i <= to; i += 1) {
      yearsList.push(i);
    }
    this.yearsList = yearsList;
  }
}

window.customElements.define(
  'wc-range-datepicker-calendar',
  RangeDatepickerCalendar
);
