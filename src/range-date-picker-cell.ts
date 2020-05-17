import { LitElement, html, css, property } from 'lit-element';
import startOfDay from 'date-fns/startOfDay';
import getTime from 'date-fns/getTime';

class RangeDatepickerCell extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .day {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      text-align: center;
      height: 38px;
      width: 38px;
      margin: 0;
      padding: 0;
      color: var(--wc-datepicker-cell-text);
    }

    .day:not(.disabled):hover {
      background: var(--wc-datepicker-cell-hover, #e4e7e7);
      cursor: pointer;
    }

    .day.hovered {
      background: var(--wc-datepicker-cell-hovered, rgba(0, 150, 136, 0.5)) !important;
      color: var(--wc-datepicker-cell-hovered-text, white);
    }

    .day.selected {
      background: var(--wc-datepicker-cell-selected, rgb(0, 150, 136)) !important;
      color: var(--wc-datepicker-cell-selected-text, white);
    }

    .day.currentDate .currentDayMarker {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      text-align: center;

      width: 80%;
      height: 80%;
      font-weight: var(--current-day-font-weight, bold);;
      border-radius: 50%;
      background-color: var(--current-day-background-color);
      color: var(--current-day-color);
    }

    .day.disabled {
      opacity: 0.4;
    }`;

  @property({type: Object}) day?: any;
  @property({type: Boolean}) selected: boolean = false;
  @property({type: Boolean}) hovered: boolean = false;
  @property({type: String}) dateTo?: string;
  @property({type: String}) dateFrom?: string;
  @property({type: String}) month?: string;
  @property({type: String}) hoveredDate?: string;
  @property({type: Number}) min?: number;
  @property({type: Number}) max?: number;
  @property({type: Boolean}) disabled: boolean = false;
  @property({type: Boolean}) isCurrentDate: boolean = false;
  @property({type: Array}) disabledDays: Array<string> = [];

  render() {
    return html`
      <div
        @click="${this.handleTap}"
        @mouseover="${this.handleHover}"
        class="day ${this.isCurrentDate ? 'currentDate' : ''} ${this.isSelected(this.selected)} ${this.isHovered(this.hovered)} ${this.isEnabled(this.day, this.min!, this.max!, this.disabledDays)}">
        <div class="currentDayMarker">
          ${this.day?.title}
        </div>
    </div>
    `;
  }

  updated(properties: Map<string, any>) {
    if (properties.has('dateFrom') || properties.has('dateTo') || properties.has('hoveredDate') || properties.has('day')) {
      this.dateChanged(this.dateFrom!, this.dateTo!, this.hoveredDate!, this.day);
    }
  }

  dateChanged(dateFrom: string, dateTo: string, hoveredDate: string, day: any) {
    this.selected = false;
    this.hovered = false;
    const parsedDateFrom = parseInt(dateFrom, 10);
    const parsedDateTo = parseInt(dateTo, 10);
    if (day) {
      if (getTime(startOfDay(parsedDateTo * 1000)) / 1000 === day.date
        || getTime(startOfDay(parsedDateFrom * 1000)) / 1000 === day.date) {
        this.selected = true;
      }

      if (
        ((hoveredDate === day.date || day.date < hoveredDate)
          && day.date > parsedDateFrom
          && !parsedDateTo
          && !Number.isNaN(parsedDateFrom)
          && parsedDateFrom !== undefined
          && !this.selected)
        || (day.date > parsedDateFrom && day.date < parsedDateTo)
      ) {
          this.hovered = true;
      }
    }
  }

  handleTap() {
    if (!this.disabled) {
      this.dispatchEvent(new CustomEvent('date-is-selected', {
        detail: { date: this.day.date },
      }));
    }
  }

  handleHover() {
    this.dispatchEvent(new CustomEvent('date-is-hovered', {
      detail: { date: this.day.date },
    }));
  }

  isSelected(selected: boolean) {
    return selected ? 'selected' : '';
  }

  isHovered(hovered: boolean) {
    return hovered ? 'hovered' : '';
  }

  isEnabled(day: any, min: number, max: number, disabledDays: Array<string>) {
    this.disabled = false;

    if (disabledDays && day && day.date) {
      if (
        day.date < min
        || day.date > max
        || disabledDays.findIndex((disabledDay) => parseInt(disabledDay, 10) === day.date) !== -1
      ) {
        this.disabled = true;
        return 'disabled';
      }
    }
    return '';
  }
}

window.customElements.define('range-datepicker-cell', RangeDatepickerCell);