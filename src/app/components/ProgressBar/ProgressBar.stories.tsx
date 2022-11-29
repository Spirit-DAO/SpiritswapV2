import { ComponentStory, ComponentMeta } from '@storybook/react';

import ProgressBar from './ProgressBar';

// noinspection JSUnusedGlobalSymbols
export default {
  title: 'SpiritSwap/Components/ProgressBar',
  component: ProgressBar,
  args: {
    value: 40,
  },
  argTypes: {},
} as ComponentMeta<typeof ProgressBar>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
// noinspection RequiredAttributes
const Template: ComponentStory<typeof ProgressBar> = args => (
  <ProgressBar {...args} />
);

export const Default = Template.bind({});
Default.args = { value: 40 };

export const Empty = Template.bind({});
Empty.args = { value: 0 };

export const Full = Template.bind({});
Full.args = { value: 100 };
