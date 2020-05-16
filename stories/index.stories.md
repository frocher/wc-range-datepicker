```js script
import { html } from '@open-wc/demoing-storybook';
import '../dist/wc-range-datepicker.js';

export default {
  title: 'WcRangeDatepicker',
  component: 'wc-range-datepicker',
  options: { selectedPanel: "storybookjs/knobs/panel" },
};
```

# WcRangeDatepicker

A component for...

## Features:

- a
- b
- ...

## How to use

### Installation

```bash
yarn add wc-range-datepicker
```

```js
import 'wc-range-datepicker/wc-range-datepicker.js';
```

```js preview-story
export const Simple = () => html`
  <wc-range-datepicker></wc-range-datepicker>
`;
```

## Variations

###### Custom Title

```js preview-story
export const CustomTitle = () => html`
  <wc-range-datepicker title="Hello World"></wc-range-datepicker>
`;
```
