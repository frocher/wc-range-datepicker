/* eslint-disable import/no-duplicates */
import { html, css, LitElement, PropertyValues } from 'lit';
import { property } from 'lit/decorators.js';
import { getMonth, getYear } from 'date-fns';
import './range-datepicker-calendar.js';
import { RangeDatepickerCalendar } from './range-datepicker-calendar.js';

export class RangeDatepicker extends LitElement {
  static styles = css`
    :host {
      display: block;
      position: relative;
    }

    #container {
      display: flex;
      flex-direction: row;
    }

    #firstDatePicker {
      margin-right: 16px;
    }
  `;

  /**
   * Array of disabled days. Format is Unix timestamp.
   */
  @property({ type: Array }) disabledDays: Array<string> = [];

  /**
   * Display a select year control.
   */
  @property({ type: Boolean }) enableYearChange = false;

  /**
   * Force display of only one month.
   */
  @property({ type: Boolean }) forceNarrow = false;

  /**
   * Set locale of the calendar.
   */
  @property({ type: Object }) locale: any | null = null;

  /**
   * Max date. Format is Unix timestamp
   */
  @property({ type: String }) max: string | null = '8640000000000';

  /**
   * Minimal date. Format is Unix timestamp
   */
  @property({ type: String }) min: string | null = '-8640000000000';

  /**
   * Set month.
   * Default is current month.
   */
  @property({ type: Number }) month: number;

  /**
   * If true only one date can be selected.
   */
  @property({ type: Boolean }) noRange = false;

  /**
   * Set year.
   * Default is current year.
   */
  @property({ type: Number }) year: number;

  @property({ type: String }) protected dateFrom: string | null = null;

  @property({ type: String }) protected dateTo: string | null = null;

  @property({ type: String }) protected hoveredDate: string | null = null;

  @property({ type: Number }) protected monthPlus: number | null = null;

  @property({ type: Number }) protected yearPlus: number | null = null;

  @property({ type: Boolean }) protected narrow = false;

  constructor() {
    super();
    const now = new Date();
    this.month = getMonth(now) + 1;
    this.year = getYear(now);
    this.monthChanged(this.month, this.year);
  }

  render() {
    return this.isNarrow(this.forceNarrow, this.narrow)
      ? this.renderNarrow()
      : this.renderNormal();
  }

  renderNormal() {
    return html`
      <div id="container">
        <wc-range-datepicker-calendar
          id="firstDatePicker"
          .disabledDays="${this.disabledDays}"
          min="${this.min}"
          max="${this.max}"
          ?enableYearChange="${this.enableYearChange}"
          ?prev="${true}"
          ?noRange="${this.noRange}"
          .hoveredDate="${this.hoveredDate}"
          .dateTo="${this.dateTo}"
          .dateFrom="${this.dateFrom}"
          .locale="${this.locale}"
          month="${this.month}"
          year="${this.year}"
          @prev-month="${this.handlePrevMonth}"
          @hovered-date-changed="${this.hoveredDateChanged}"
          @date-from-changed="${this.dateFromChanged}"
          @date-to-changed="${this.dateToChanged}"
        >
        </wc-range-datepicker-calendar>
        <wc-range-datepicker-calendar
          .disabledDays="${this.disabledDays}"
          min="${this.min}"
          max="${this.max}"
          ?enableYearChange="${this.enableYearChange}"
          ?next="${true}"
          ?noRange="${this.noRange}"
          .hoveredDate="${this.hoveredDate}"
          .dateTo="${this.dateTo}"
          .dateFrom="${this.dateFrom}"
          .locale="${this.locale}"
          month="${this.monthPlus}"
          year="${this.yearPlus}"
          @next-month="${this.handleNextMonth}"
          @hovered-date-changed="${this.hoveredDateChanged}"
          @date-from-changed="${this.dateFromChanged}"
          @date-to-changed="${this.dateToChanged}"
        >
        </wc-range-datepicker-calendar>
      </div>
    `;
  }

  renderNarrow() {
    return html`
      <wc-range-datepicker-calendar
        .disabledDays="${this.disabledDays}"
        min="${this.min}"
        max="${this.max}"
        ?enableYearChange="${this.enableYearChange}"
        ?noRange="${this.noRange}"
        ?narrow="${this.isNarrow(this.forceNarrow, this.narrow)}"
        .hoveredDate="${this.hoveredDate}"
        .dateTo="${this.dateTo}"
        .dateFrom="${this.dateFrom}"
        .locale="${this.locale}"
        ?prev="${true}"
        ?next="${true}"
        month="${this.monthPlus}"
        year="${this.yearPlus}"
        @hovered-date-changed="${this.hoveredDateChanged}"
        @date-from-changed="${this.dateFromChanged}"
        @date-to-changed="${this.dateToChanged}"
      >
      </wc-range-datepicker-calendar>
    `;
  }

  firstUpdated(): void {
    const mql: MediaQueryList = window.matchMedia('(max-width: 650px)');
    mql.addListener(mqlEvent => this.queryMatchesChanged(mqlEvent));
    this.queryMatchesChanged(mql);
  }

  updated(properties: PropertyValues): void {
    if (properties.has('month') || properties.has('year')) {
      this.monthChanged(this.month, this.year);
    }

    if (properties.has('noRange')) {
      this.noRangeChanged(this.noRange, properties.get('noRange') as boolean);
    }

    if (properties.has('narrow')) {
      this.dispatchEvent(
        new CustomEvent('narrow-changed', { detail: { value: this.narrow } })
      );
    }

    if (properties.has('locale')) {
      this.localeChanged();
    }
  }

  isNarrow(forceNarrow: boolean, narrow: boolean): boolean {
    return forceNarrow || narrow;
  }

  queryMatchesChanged(mql: MediaQueryList | MediaQueryListEvent): void {
    this.narrow = mql.matches;
    this.requestUpdate();
  }

  handlePrevMonth(): void {
    if (!this.enableYearChange) {
      const calendar = this.shadowRoot?.querySelector(
        'wc-range-datepicker-calendar[next]'
      ) as RangeDatepickerCalendar;
      calendar?.handlePrevMonth();
    }
  }

  handleNextMonth(): void {
    if (!this.enableYearChange) {
      const calendar = this.shadowRoot?.querySelector(
        'wc-range-datepicker-calendar[prev]'
      ) as RangeDatepickerCalendar;
      calendar?.handleNextMonth();
    }
  }

  hoveredDateChanged(e: CustomEvent): void {
    this.hoveredDate = e.detail.value;
  }

  monthChanged(month: number, year: number): void {
    if (year && month) {
      this.monthPlus = (month % 12) + 1;
      if (this.monthPlus === 1) {
        this.yearPlus = year + 1;
      } else {
        this.yearPlus = year;
      }
    }
  }

  noRangeChanged(isNoRange: boolean, wasNoRange: boolean): void {
    if (!wasNoRange && isNoRange) {
      this.dateTo = null;
      this.hoveredDate = null;
    }
  }

  localeChanged(): void {
    if (!this.month) {
      this.month = getMonth(new Date());
    }
    if (!this.year) {
      this.year = getYear(new Date());
    }
  }

  dateToChanged(e: CustomEvent): void {
    this.dateTo = e.detail.value;
    this.dispatchEvent(
      new CustomEvent('date-to-changed', { detail: { value: e.detail.value } })
    );
  }

  dateFromChanged(e: CustomEvent): void {
    this.dateFrom = e.detail.value;
    this.dispatchEvent(
      new CustomEvent('date-from-changed', {
        detail: { value: e.detail.value },
      })
    );
  }
}
