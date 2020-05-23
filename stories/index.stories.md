```js script
import { html } from '@open-wc/demoing-storybook';
import '../dist/wc-range-datepicker.js';
import { fr } from 'date-fns/locale';

export default {
  title: 'RangeDatepicker',
  component: 'wc-range-datepicker',
  options: { selectedPanel: "storybookjs/docs/panel" },
};
```

# RangeDatepicker

A responsive component for selecting a range of dates.
It is a less rich version cfrom RoXuS range-datepicker with no Polymer dependencies.

## How to use

### Installation

```bash
npm install wc-range-datepicker
```

```js
import 'wc-range-datepicker/dist/wc-range-datepicker.js';
```

```js preview-story
export const Simple = () => html`
 <wc-range-datepicker></wc-range-datepicker>
`;
```

## Variations

###### With preselection of the month

```js preview-story
export const CustomMonth = () => html`
  <wc-range-datepicker month="09"></wc-range-datepicker>
`;
```

###### With min and max

```js preview-story
export const MinAndMax = () => html`
  <wc-range-datepicker month="08" year="2017" min="1504216800" max="1504908000"></wc-range-datepicker>
`;
```

###### With disabled days

```js preview-story
export const disabledDays = () => html`
  <wc-range-datepicker month="08" year="2017" .disabledDays="${['1504994400','1504908000','1502402400']}"></wc-range-datepicker>
`;
```

###### With option to change year

```js preview-story
export const enableYearChange = () => html`
  <wc-range-datepicker enableYearChange></wc-range-datepicker>
`;
```

###### No Range

```js preview-story
export const noRange = () => html`
  <wc-range-datepicker noRange></wc-range-datepicker>
`;
```

###### Force narrow

```js preview-story
export const forceNarrow = () => html`
  <wc-range-datepicker forceNarrow></wc-range-datepicker>
`;
```

###### With french locale

```js preview-story
export const locale = () => html`
  <wc-range-datepicker .locale="${fr}""></wc-range-datepicker>
`;
```

## API

### Properties/Attributes

| Name           | Description
| -------------- | -----------
| `disabledDays` | Array of disabled days. Format is Unix timestamp.
| `enableYearChange` | If true displays a select year dropdown button. Default is false.
| `forceNarrow` | Force display of only one month
| `locale` | Set locale of the calendar.
| `max` | Maximum date allowed. Format is unix timestamp
| `min` | Minimum date allowed. Format is unix timestamp
| `month` | Default month
| `noRange` | If true only one date can be selected. Default is false.
| `year` | Default year

### Methods
*None*

### Events

| Event Name          | Target       | Description
| ------------------- | ------------ | -----------
| `narrow-changed`    | `wc-range-datepicker` | Detects if display mode has change between one and two months
| `date-from-changed`    | `wc-range-datepicker` | Detects if dateFrom properties has changed
| `date-to-changed`    | `wc-range-datepicker` | Detects if dateTo properties has changed

### CSS Custom Properties

| Name | Default | Description
| ------------------------------------- | -------------------------------------------------- | ---
| `--wc-datepicker-cell-text`     | none     | Color of cell text
| `--wc-datepicker-cell-hover`     | rgba(0, 150, 136, 0.5)     | Background color of hovered cell
| `--wc-datepicker-cell-hovered-text`     | white     | Text color of hovered cell
| `--wc-datepicker-cell-selected`     | rgb(0, 150, 136)     | Background color of selected cell
| `--wc-datepicker-cell-selected-text`     | white     | Text color of selected cell
| `--wc-current-day-color`     | none     | Background color of current day
| `--wc-current-day-color-text`     | none     | Text color of current day
| `--wc-current-day-font-weight`     | bold     | Font weight of current day
