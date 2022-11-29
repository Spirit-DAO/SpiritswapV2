import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Sign } from 'app/utils';
import PercentBadge from './PercentBadge';

export default {
  title: 'SpiritSwap/Components/PercentBadge',
  component: PercentBadge,
  args: {
    amount: 0.42,
    sign: Sign.POSITIVE,
    showIcon: true,
  },
  argTypes: {},
} as ComponentMeta<typeof PercentBadge>;

const Template: ComponentStory<typeof PercentBadge> = args => (
  <PercentBadge {...args} />
);

export const Default = Template.bind({});
Default.args = {};
