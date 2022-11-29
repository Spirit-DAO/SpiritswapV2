import { ComponentStory, ComponentMeta } from '@storybook/react';

import SettingsPanel from './SettingsPanel';
import { SettingsPanelProps } from './index';

export default {
  title: 'SpiritSwap/Swap/SettingsPanel',
  component: SettingsPanel,
} as ComponentMeta<typeof SettingsPanel>;

const labels = {
  name: 'List of values',
  description: 'Values to select',
  table: {
    type: { summary: 'object' },
    defaultValue: '[]',
  },
  defaultValue: ['0.1', '0.5', '1', 'Auto'],
  control: { type: 'object' },
};

const selected = {
  name: 'Position',
  description: 'Default selected value',
  table: {
    type: { summary: 'object' },
    defaultValue: { summary: '0' },
  },
  defaultValue: 0,
  control: {
    type: 'select',
    options: [...labels.defaultValue.map((v, i) => i)],
  },
};

const custom = {
  name: 'Custom Slippage Tolerance',
  description: 'Custom value',
  table: {
    type: { summary: 'number' },
    defaultValue: { summary: null },
  },
  defaultValue: '',
  control: { type: 'text' },
};

const timer = {
  name: 'Timer',
  description: 'Transaction deadline in minutes',
  table: {
    type: { summary: 'number' },
    defaultValue: { summary: '20' },
  },
  defaultValue: 20,
  control: { type: 'number' },
};

const translationsPath = {
  name: 'Translation Path',
  description: 'Path',
  table: {
    type: { summary: 'string' },
    defaultValue: { summary: '' },
  },
  defaultValue: 'swap.settings',
  control: { type: 'text' },
};

const argTypes = {
  labels,
  selected,
  timer,
  custom,
  translationsPath,
};

const Template: ComponentStory<typeof SettingsPanel> = (
  args: SettingsPanelProps,
) => <SettingsPanel {...args} />;

export const SettingsPanelStories = Template.bind({});
SettingsPanelStories.argTypes = argTypes;
SettingsPanelStories.storyName = 'SettingsPanel';
