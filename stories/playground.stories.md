```js script
import { html, withKnobs, withWebComponentsKnobs } from '@open-wc/demoing-storybook';
import '../dist/wc-range-datepicker.js';

export default {
  title: 'RangeDatepicker',
  component: 'wc-range-datepicker',
  decorators: [withKnobs, withWebComponentsKnobs],
  options: { selectedPanel: "storybookjs/knobs/panel" },
};
```

```js
import 'wc-range-datepicker/wc-range-datepicker.js';
```

```js preview-story
export const Playground = () => html`
 <wc-range-datepicker></wc-range-datepicker>
`;
```
