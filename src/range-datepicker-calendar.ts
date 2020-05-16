import { html, css, LitElement, property } from 'lit-element';
import '@material/mwc-icon-button';
import '@material/mwc-select';
import '@material/mwc-menu';
import '@material/mwc-list/mwc-list-item';
import { addDays, addMonths, addYears, endOfMonth, format, getDay, parse, startOfDay, subMonths, subYears } from 'date-fns';
import { enUS } from 'date-fns/locale';
import './range-date-picker-cell';


export class RangeDatepickerCalendar extends LitElement {
  static styles = css`
  :host {
    display: block;
    width: 266px;
  }

  :host>div {
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
    display:flex;
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
  @property({type: String}) dateFrom?: string;

  /**
   * Date to. Format is Unix timestamp.
   */
  @property({type: String}) dateTo?: string;

  @property({type: String}) hoveredDate?: string;

  @property({type: String}) day?: string;

  @property({type: Boolean}) enableMonthChange: boolean = true;
  @property({type: Boolean}) enableYearChange: boolean = false;
  @property({type: String}) month: string = '01';
  @property({type: Boolean}) narrow: boolean = false;
  @property({type: Boolean}) noRange: boolean = false;
  @property({type: Boolean}) next: boolean = false;
  @property({type: Boolean}) prev: boolean = false;
  @property({type: Boolean}) displayGoToday: boolean = false;
  @property({type: String}) year: number = 2020;
  @property({type: Array}) yearsList: Array<number> = [];
  @property({type: Array}) monthsList: Array<string> = [];
  @property({type: Array}) disabledDays: Array<string> = [];
  @property({type: Array}) dayNamesOfTheWeek: Array<string> = [];
  @property({type: Array}) daysOfMonth: Array<any> = [];
  @property({type: String}) defaultAs: string = 'today';

  @property({type: Object})
  public get locale(): Locale {
    return this._locale ? this._locale: enUS;
  }
  public set locale(value: Locale) {
    const oldValue = this._locale;
    this._locale = value;
    this.requestUpdate('locale', oldValue);
  }

  /**
   * Max date. Format is Unix timestamp
   */
  @property({type: String}) max: string = '';

  /**
   * Minimal date. Format is Unix timestamp
   */
  @property({type: String}) min: string = '';

  _locale?: Object;
  currentDate: number;

  constructor() {
    super();
    this.currentDate = parseInt(format(startOfDay(Date.now()), 't'), 10);
    this.localeChanged();
    this.yearAndMonthChanged(this.year, this.month);
  }

  render() {
    return html`
    <div>
      <div class="header">
        ${this.renderPrevButton()}
        <div class="headerTitle">
          <div>
            ${this.computeCurrentMonthName(this.month, this.year)}
          </div>
          <div>
            ${this.renderYear()}
          </div>
        </div>
        ${this.renderNextButton()}
      </div>

      <div class="table">
        <div class="thead">
          <div class="tr">
            ${this.dayNamesOfTheWeek?.map((dayNameOfWeek) => this.renderDayOfWeek(dayNameOfWeek))}
          </div>
        </div>
        <div class="tbody">
          ${this.daysOfMonth?.map((week) => this.renderWeek(week))}
        </div>
      </div>
    </div>
    `;
  }

  renderPrevButton() {
    if (this.prev || this.narrow || this.enableYearChange) {
     return html`<mwc-icon-button icon="chevron_left" @click="${this.handlePrevMonth}"></mwc-icon-button>`;
    }
    return null;
  }

  renderNextButton() {
    if (this.next || this.narrow || this.enableYearChange) {
     return html`<mwc-icon-button icon="chevron_right" @click="${this.handleNextMonth}"></mwc-icon-button>`;
    }
    return null;
  }

  renderYear() {
    if (this.enableYearChange) {
      return html`
        <div class="year-container">
          ${this.year}
          <mwc-icon-button icon="arrow_drop_down" @click="${this.handleOpenYearSelection}"></mwc-icon-button>
          <mwc-menu class="year-change" @selected="${this.handleYearSelected}">
          ${this.yearsList.map(i => this.renderYearItem(i))}
          </mwc-men>
        </div>
      `;
    }

    return html`${this.year}`;
  }

  renderYearItem(item: any) {
    return html`
      <mwc-list-item value="${item}">${item}</mwc-list-item>
    `;
  }

  renderDayOfWeek(dayOfWeek: string) {
    return html`<div class="th">${dayOfWeek}</div>`;
  }

  renderWeek(week: any) {
    return html`
    <div class="tr">
      ${week.map((day: any) => this.renderDay(day))}
    </template>
    </div>
    `;
  }

  renderDay(day: any) {
    return html`
      <div class="td ${this.tdIsEnabled(day)}">
        ${day ? html`
          <range-datepicker-cell
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
            @date-is-hovered="${this.handleDateHovered}">
          </range-datepicker-cell>
        ` : null}
      </div>
    `;
  }

  async firstUpdated() {
    this.monthsList = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    setTimeout(() => { this.setYears(1930, 2100); });
    await this.updateComplete;
  }

  updated(properties: Map<string, any>) {
    if (properties.has('locale')) {
      this.localeChanged();
    }

    if (properties.has('year')) {
      this.dispatchEvent(new CustomEvent('year-changed', { detail: { value: this.year } }));
    }

    if (properties.has('year') || properties.has('month')) {
      this.yearAndMonthChanged(this.year, this.month);
    }
  }

  isCurrentDate(day: any) {
    const dayDate = day.date;
    return dayDate === this.currentDate;
  }

  localeChanged() {
    const dayNamesOfTheWeek = [];
    for (let i = 0; i < 7; i++) {
      dayNamesOfTheWeek.push(this.locale.localize!.day(i, { width: 'short' }));
    }

    const firstDayOfWeek: number = this.locale.options!.weekStartsOn ? this.locale.options!.weekStartsOn : 0;
    const tmp = dayNamesOfTheWeek.slice().splice(0, firstDayOfWeek);
    const newDayNamesOfTheWeek = dayNamesOfTheWeek
      .slice()
      .splice(firstDayOfWeek, dayNamesOfTheWeek.length)
      .concat(tmp);
    this.dayNamesOfTheWeek = newDayNamesOfTheWeek;
  }

  yearAndMonthChanged(year: number, month: string) {
    if (year && month) {
      let monthMinus = month;
      monthMinus = monthMinus.substring(monthMinus.length - 2);
      let startDateString = `01/${monthMinus}/${year}`;
      let startDateFn = parse(startDateString, 'dd/MM/yyyy', new Date() );
      const endDateFn = endOfMonth(startDateFn);
      const endDateString = format(endDateFn, 'dd/MM/yyyy');

      const firstDayOfWeek = this.locale.options!.weekStartsOn ? this.locale.options!.weekStartsOn : 0;

      const rows:any = [];
      let columns:any = [];

      const lastDayOfWeek = 6;

      while (startDateString !== endDateString) {
        let dayNumberFn = getDay(startDateFn) - firstDayOfWeek;
        if (dayNumberFn < 0) {
          dayNumberFn = 6;
        }

        const columnFn = {
          hover: false,
          date: parseInt(format(startDateFn, 't'), 10),
          title: parseInt(format(startDateFn, 'd'), 10),
        };
        columns.push(columnFn);

        if (dayNumberFn === lastDayOfWeek) {
          for (let i = columns.length; i < lastDayOfWeek + 1; i += 1) {
            columns.unshift(0);
          }
          rows.push(columns.slice());
          columns = [];
        }

        startDateFn = addDays(startDateFn, 1);
        startDateString = format(startDateFn, 'dd/MM/yyyy');

        if (startDateString === endDateString) {
          const endColumnFn = {
            hover: false,
            date: parseInt(format(startDateFn, 't'), 10),
            title: parseInt(format(startDateFn, 'd'), 10),
          };
          columns.push(endColumnFn);
          for (let i = columns.length; i <= lastDayOfWeek; i += 1) {
            columns.push(0);
          }
          rows.push(columns.slice());
          columns = [];
        }
      }
      this.daysOfMonth = rows;
    }
  }

  computeCurrentMonthName(month: string, year: number) {
    return format(new Date(year, parseInt(month, 10) - 1), 'MMMM', { locale: this.locale });
  }

  tdIsEnabled(day: any) {
    if (day) {
      return 'enabled';
    }
    return '';
  }

  handleDateSelected(e: CustomEvent) {
    const { detail } = e;
    const { date } = detail;
    if (!this.noRange) {
      if (this.dateFrom && this.dateTo) {
        this.dateFrom = date;
        this.dateTo = undefined;
        this.hoveredDate = undefined;
      } else if (!this.dateFrom || (this.dateFrom && date < this.dateFrom)) {
        this.dateFrom = date;
      } else if (!this.dateTo || (this.dateTo && date > this.dateTo)) {
        this.dateTo = date;
      }
    } else {
      this.dateFrom = date;
    }
    this.dispatchEvent(new CustomEvent('date-from-changed', { detail: { value: this.dateFrom } }));
    this.dispatchEvent(new CustomEvent('date-to-changed', { detail: { value: this.dateTo } }));
  }

  handleOpenYearSelection() {
    const menu = this.shadowRoot?.querySelector('.year-change') as any;
    const item = menu.items.find( (item: any) => item.value === this.year );
    menu.select(item);
    menu?.show();
  }

  handleYearSelected() {
    const menu = this.shadowRoot?.querySelector('.year-change') as any;
    this.year = menu.selected.value;
  }

  handleDateHovered(e: CustomEvent) {
    if (!this.noRange) {
      this.hoveredDate = e.detail.date;
      this.dispatchEvent(new CustomEvent('hovered-date-changed', { detail: { value: this.hoveredDate } }));
    }
  }

  handleNextMonth() {
    const tbody = this.shadowRoot?.querySelector('.tbody');
    const monthName = this.shadowRoot?.querySelector('.header > div');
    tbody?.classList.add('withTransition');
    tbody?.classList.add('moveToLeft');
    monthName?.classList.add('withTransition');
    monthName?.classList.add('moveToLeft');

    const month = parse(this.month, 'MM', new Date());
    const monthPlusDate = addMonths(month, 1);
    const monthPlusString = format(monthPlusDate, 'MM', { locale: this.locale });

    this.month = monthPlusString;
    if (this.month === '01') {
      const year = parse(this.year.toString(), 'yyyy', new Date());
      const yearPlusDate = addYears(year, 1);
      const yearPlusString = format(yearPlusDate, 'yyyy', { locale: this.locale });
      this.year = parseInt(yearPlusString);
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
    }, 100);  }

  handlePrevMonth() {
    const tbody = this.shadowRoot?.querySelector('.tbody');
    const monthName = this.shadowRoot?.querySelector('.header > div');
    tbody?.classList.add('withTransition');
    tbody?.classList.add('moveToRight');
    monthName?.classList.add('withTransition');
    monthName?.classList.add('moveToRight');

    const month = parse(this.month, 'MM', new Date());
    const monthMinusDate = subMonths(month, 1);
    const monthMinusString = format(monthMinusDate, 'MM', { locale: this.locale });

    this.month = monthMinusString;
    if (this.month === '12') {
      const year = parse(this.year.toString(), 'yyyy', new Date());
      const yearMinusDate = subYears(year, 1);
      const yearMinusString = format(yearMinusDate, 'yyyy', { locale: this.locale });
      this.year = parseInt(yearMinusString);
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

  setYears(from: number, to: number) {
    const yearsList = [];
    for (let i = from; i <= to; i += 1) {
      yearsList.push(i);
    }
    this.yearsList = yearsList;
  }
}

window.customElements.define('range-datepicker-calendar', RangeDatepickerCalendar);
