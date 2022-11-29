import { ComponentStory, ComponentMeta } from '@storybook/react';

import DateTime from './DateTime';
import { Props } from './DateTime.d';

const ISODateTime = {
  name: 'ISO Date Time',
  description: 'String that represents ISO Date Time',
  table: {
    type: { summary: 'string' },
    defaultValue: { summary: '' },
  },
  defaultValue: '',
  control: { type: 'text' },
};

const locale = {
  name: 'Locale',
  description: 'Select different locale',
  control: {
    type: 'select',
    options: ['en-GB', 'en-US', 'sv-SE', 'sv-FL', 'fi-FL', 'da-DK', 'it-IT'],
  },
};

const options = {
  name: 'Options',
  description: 'Available options for time display',
  table: {
    type: { summary: 'object' },
    defaultValue: { summary: '{}' },
  },
  defaultValue: {},
  control: { type: 'object' },
};

const argTypes = {
  locale,
  ISODateTime,
  options,
};

export default {
  argTypes,
  title: 'SpiritSwap/components/DateTime',
} as ComponentMeta<typeof DateTime>;

const props = {
  ISODateTime: '2021-04-14T11:11:42+00:00',
  locale: 'en-GB',
  options: {},
};

const DateTimeEl: ComponentStory<typeof DateTime> = ({
  ISODateTime,
  locale,
  options,
}: Props) => (
  <DateTime ISODateTime={ISODateTime} locale={locale} options={options} />
);

export const DateTimeElGBAndControls = DateTimeEl.bind({});
DateTimeElGBAndControls.args = props;
DateTimeElGBAndControls.storyName = 'UK format';

const props2 = {
  ISODateTime: '2021-04-14T11:11:42+00:00',
  locale: 'en-US',
  options: {},
};
export const DateTimeElUSAndControls = DateTimeEl.bind({});
DateTimeElUSAndControls.args = props2;
DateTimeElUSAndControls.storyName = 'US format';

const props3 = {
  ISODateTime: '2021-04-14T11:11:42+00:00',
  locale: 'en-US',
  options: {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'GMT',
    timeZoneName: 'long',
  },
};
export const DateTimeElLongAndControls = DateTimeEl.bind({});
DateTimeElLongAndControls.args = props3;
DateTimeElLongAndControls.storyName = 'Long format';

const props4 = {
  ISODateTime: '2021-04-14T11:11:42+00:00',
  locale: 'fi-FL',
  options: {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'GMT',
    timeZoneName: 'long',
  },
};
export const DateTimeElLongFiAndControls = DateTimeEl.bind({});
DateTimeElLongFiAndControls.args = props4;
DateTimeElLongFiAndControls.storyName = 'Long format in Finnish';
