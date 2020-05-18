```js script
import { html } from '@open-wc/demoing-storybook';
import '../dist/wc-range-datepicker.js';

export default {
  title: 'RangeDatepicker',
  component: 'wc-range-datepicker',
  options: { selectedPanel: "storybookjs/knobs/panel" },
};
```

# RangeDatepicker

A component for selecting a range of dates

## Features:

- a
- b
- ...

## How to use

### Installation

```bash
npm install wc-range-datepicker
```

```js
import 'wc-range-datepicker/wc-range-datepicker.js';
```

```js preview-story
export const Simple = () => html`
  <link href="https://fonts.googleapis.com/css?family=Material+Icons&display=block" rel="stylesheet">
  <link rel="preload" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" as="style" onload="this.onload=null;this.rel='stylesheet'">
  <wc-range-datepicker></wc-range-datepicker>
`;
```

## Variations

###### With preselection of the month

```js preview-story
export const CustomMonth = () => html`
  <link href="https://fonts.googleapis.com/css?family=Material+Icons&display=block" rel="stylesheet">
  <link rel="preload" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" as="style" onload="this.onload=null;this.rel='stylesheet'">
  <wc-range-datepicker month="09"></wc-range-datepicker>
`;
```
