import { html, css, LitElement, property, PropertyValues } from 'lit-element';
import './range-datepicker-calendar';
import { getMonth, getYear, parse } from 'date-fns';
import { RangeDatepickerCalendar } from './range-datepicker-calendar';

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
    };
  `;

  /**
   * Date from. Format is Unix timestamp.
   */
  @property({ type: String }) dateFrom: string|null = null;

  /**
   * Date to. Format is Unix timestamp.
   */
  @property({ type: String }) dateTo: string|null = null;

  /**
   * Array of disabled days. Format is Unix timestamp.
   */
  @property({ type: Array }) disabledDays: Array<string> = [];

  /**
   * Force display of only one month.
   */
  @property({ type: Boolean }) enableYearChange = false;

  /**
   * Force display of only one month.
   */
  @property({ type: Boolean }) forceNarrow = false;

  /**
   * Current hovered date. Format is Unix timestamp.
   */
  @property({ type: String }) hoveredDate: string|null = null;

  /**
   * Set locale of the calendar.
   */
  @property({ type: Object }) locale: Locale|null = null;

  /**
   * Max date. Format is Unix timestamp
   */
  @property({ type: String }) max: string|null = null;;

  /**
   * Minimal date. Format is Unix timestamp
   */
  @property({ type: String }) min: string|null = null;;

  /**
   * Set month.
   */
  @property({ type: Number }) month: number;

  /**
   * If true, only one month is displayed.
   */
  @property({ type: Boolean }) narrow = false;

  /**
   * If true only one date can be selected.
   */
  @property({ type: Boolean }) noRange = false;

  /**
   * Set year.
   * Default is current year.
   */
  @property({ type: Number }) year: number;

  /**
   * Set default date.
   * Default is current year.
   */
  @property({ type: String }) defaultAs: String = 'today';

  @property({ type: Number }) protected monthPlus: number|null = null;
  @property({ type: Number }) protected yearPlus: number|null = null;

  constructor() {
    super();
    let now = new Date();
    this.month = getMonth(now);
    this.year = getYear(now);
    this.monthChanged(this.month, this.year);
  }

  render() {
    return this.isNarrow(this.forceNarrow, this.narrow) ? this.renderNarrow() : this.renderNormal();
  }

  renderNormal() {
    return html`
    <div id="container">
      <range-datepicker-calendar
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
        @date-to-changed="${this.dateToChanged}">
      </range-datepicker-calendar>
      <range-datepicker-calendar
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
        @date-to-changed="${this.dateToChanged}">
      </range-datepicker-calendar>
    </div>
  `;
  }

  renderNarrow() {
    return html`
      <range-datepicker-calendar
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
        @date-to-changed="${this.dateToChanged}">
      </range-datepicker-calendar>
    `;
  }

  firstUpdated() {
    const mql: MediaQueryList = window.matchMedia('(max-width: 650px)');
    mql.addListener((mqlEvent) => this.queryMatchesChanged(mqlEvent));
    this.queryMatchesChanged(mql);
  }

  updated(properties: PropertyValues) {
    if (properties.has('month') || properties.has('year')) {
      this.monthChanged(this.month, this.year);
    }

    if (properties.has('noRange')) {
      this.noRangeChanged(this.noRange, properties.get('noRange') as boolean);
    }

    if (properties.has('narrow')) {
      this.dispatchEvent(new CustomEvent('narrow-changed', { detail: { value: this.narrow } }));
    }

    if (properties.has('locale')) {
      this.localeChanged();
    }
  }

  isNarrow(forceNarrow: boolean, narrow: boolean): boolean {
    return forceNarrow || narrow;
  }

  queryMatchesChanged(mql: MediaQueryList|MediaQueryListEvent) {
    this.narrow = mql.matches;
    this.requestUpdate();
  }

  handlePrevMonth() {
    if (!this.enableYearChange) {
      const calendar = this.shadowRoot?.querySelector('range-datepicker-calendar[next]') as RangeDatepickerCalendar;
      calendar?.handlePrevMonth();
    }
  }

  handleNextMonth() {
    if (!this.enableYearChange) {
      const calendar = this.shadowRoot?.querySelector('range-datepicker-calendar[prev]') as RangeDatepickerCalendar;
      calendar?.handleNextMonth();
    }
  }

  hoveredDateChanged(e: CustomEvent) {
    this.hoveredDate = e.detail.value;
  }

  monthChanged(month: number, year: number) {
    if (year && month) {
      this.monthPlus = month % 12 + 1;
      if (this.monthPlus === 1) {
        this.yearPlus = year + 1;
      } else {
        this.yearPlus = year;
      }
    }
  }

  noRangeChanged(isNoRange: boolean, wasNoRange: boolean) {
    if (!wasNoRange && isNoRange) {
      this.dateTo = null;
      this.hoveredDate = null;
    }
  }

  localeChanged() {
    if (!this.month) {
      switch (this.defaultAs) {
        case 'dateFrom':
          this.month = this.dateFrom ? getMonth(parse(this.dateFrom, 't', new Date())) + 1 : getMonth(new Date());;
          break;
        case 'dateTo':
          this.month = this.dateTo ? getMonth(parse(this.dateTo, 't', new Date())) + 1 : getMonth(new Date());;
          break;
        default:
          this.month = getMonth(new Date());
      }
    }
    if (!this.year) {
      switch (this.defaultAs) {
        case 'dateFrom':
          this.year = this.dateFrom ? getYear(parse(this.dateFrom, 't', new Date())) : getYear(new Date());
          break;
        case 'dateTo':
          this.year = this.dateTo ? getYear(parse(this.dateTo, 't', new Date())) : getYear(new Date());
          break;
        default:
          this.year = getYear(new Date());
      }
    }
  }

  dateToChanged(e: CustomEvent) {
    this.dateTo = e.detail.value;
    this.dispatchEvent(new CustomEvent('date-to-changed', { detail: { value: e.detail.value } }));
  }

  dateFromChanged(e: CustomEvent) {
    this.dateFrom = e.detail.value;
    this.dispatchEvent(new CustomEvent('date-from-changed', { detail: { value: e.detail.value } }));
  }
}
