import { ComponentStory, ComponentMeta } from '@storybook/react';

import Chart from './Chart';
import { ChartStyles, Props } from './Chart.d';

const style = {
  name: 'Chart type',
  description: 'Choose a chart type',
  table: {
    type: { summary: 'number' },
    defaultValue: { summary: '1' },
  },
  defaultValue: 'Line',
  control: { type: 'select', options: [0, 1] },
};

const durationLabels = {
  name: 'Periods labels',
  description: 'Periods of time',
  table: {
    type: { summary: 'list' },
    defaultValue: { summary: '[]' },
  },
  defaultValue: [],
  control: { type: 'object' },
};

const data = {
  name: 'Data',
  description: 'Data to load',
  table: {
    type: { summary: 'list' },
    defaultValue: { summary: '[]' },
  },
  defaultValue: [],
  control: { type: 'object' },
};

const argTypes = {
  style,
  durationLabels,
  data,
};

export default {
  argTypes,
  title: 'SpiritSwap/Components/Chart',
} as ComponentMeta<typeof Chart>;

const Template: ComponentStory<typeof Chart> = (props: Props) => (
  <Chart {...props} />
);

const lineProps = {
  type: 'Line' as ChartStyles,
  durationLabels: ['JAN', 'MAR', 'MAY', 'JUL', 'SEP', 'NOV'],
  data: [200, 130, 120, 190, 170, 100],
};

export const LineChartStory = Template.bind({});
LineChartStory.args = lineProps;
LineChartStory.storyName = 'Line chart';

const barProps = {
  type: 'Bar' as ChartStyles,
  durationLabels: ['JAN', 'MAR', 'MAY', 'JUL', 'SEP', 'NOV'],
  data: [200, 130, 120, 190, 170, 100],
};

export const BarChartStory = Template.bind({});
BarChartStory.args = barProps;
BarChartStory.storyName = 'Bar chart';
