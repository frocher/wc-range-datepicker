import { html, TemplateResult } from 'lit';
import '../src/wc-range-datepicker.js';
import { fr } from 'date-fns/esm/locale';

export default {
  title: 'RangeDatepicker',
  component: 'wc-range-datepicker',
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  month?: string;
  year?: string;
  min?: string;
  max?: string;
  disabledDays: Array<string>;
  enableYearChange: boolean;
  noRange: boolean;
  forceNarrow: boolean;
  locale: any;
}

const Template: Story<ArgTypes> = ({
  month,
  year,
  min = '-8640000000000',
  max = '8640000000000',
  disabledDays = [],
  enableYearChange = false,
  noRange = false,
  forceNarrow = false,
  locale,
}: ArgTypes) => html`
  <wc-range-datepicker
    month=${month}
    year=${year}
    min=${min}
    max=${max}
    .disabledDays=${disabledDays}
    ?enableYearChange=${enableYearChange}
    ?noRange="${noRange}"
    ?forceNarrow=${forceNarrow}
    .locale=${locale}
  >
  </wc-range-datepicker>
`;

export const Regular = Template.bind({});

export const CustomMonth = Template.bind({});
CustomMonth.args = {
  month: '09',
};

export const MinAndMax = Template.bind({});
MinAndMax.args = {
  month: '08',
  year: '2017',
  min: '1504216800',
  max: '1504908000',
};

export const disabledDays = Template.bind({});
disabledDays.args = {
  month: '08',
  year: '2017',
  disabledDays: ['1504994400', '1504908000', '1502402400'],
};

export const enableYearChange = Template.bind({});
enableYearChange.args = {
  enableYearChange: true,
};

export const noRange = Template.bind({});
noRange.args = {
  noRange: true,
};

export const forceNarrow = Template.bind({});
forceNarrow.args = {
  forceNarrow: true,
};

export const locale = Template.bind({});
locale.args = {
  locale: fr,
};
