import { ComponentStory, ComponentMeta } from '@storybook/react';

import Stats from './Stats';
import { Props } from './Stats.d';

const dataLabels = {
  name: 'List of labels',
  description: 'Object with labels with translation support',
  table: {
    type: { summary: 'object' },
    defaultValue: { summary: '{}' },
  },
  defaultValue: {
    titleLabel: 'inSpirit.stats.title',
    totalSpiritLockedLabel: 'inSpirit.stats.totalSpiritLocked',
    totalDistributionLabel: 'inSpirit.stats.totalDistribution',
    averageUnlockTimeLabel: 'inSpirit.stats.averageUnlockTime',
    aprLabel: 'inSpirit.stats.apr',
    spiritPerInspiritLabel: 'inSpirit.stats.spiritPerInspirit',
    nextDistributionLabel: 'inSpirit.stats.nextDistribution',
    selectLabels: [
      'inSpirit.stats.selectLabels.week',
      'inSpirit.stats.selectLabels.month',
      'inSpirit.stats.selectLabels.year',
      'inSpirit.stats.selectLabels.all',
    ],
  },
  control: { type: 'object' },
};

const dataValues = {
  name: 'List of values',
  description: 'Object with values',
  table: {
    type: { summary: 'object' },
    defaultValue: { summary: '{}' },
  },
  defaultValue: {
    selectedDate: '2021-12-01T11:11:00+00:00',
    totalSpiritLockedValue: '116089938',
    totalDistributionValue: '1115336',
    averageUnlockTimeValue: '928',
    aprValue: '81.45',
    spiritPerInspiritValue: '0.0016',
    nextDistributionValue: '2022-01-09T11:11:00+00:00',
  },
  control: { type: 'object' },
};

const argTypes = {
  dataLabels,
  dataValues,
};

export default {
  title: 'SpiritSwap/InSpirit/Stats',
  argTypes,
} as ComponentMeta<typeof Stats>;

const Template: ComponentStory<typeof Stats> = (args: Props) => (
  <Stats {...args} />
);

export const StatsStories = Template.bind({});
StatsStories.storyName = 'Yearly view';
