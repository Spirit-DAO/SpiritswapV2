import { ComponentStory, ComponentMeta } from '@storybook/react';
import TokenEarningsBox from './TokenEarningsBox';

export default {
  title: 'SpiritSwap/Farm/TokenEarningsBox',
  component: TokenEarningsBox,
  args: {
    label: 'SPIRIT earned',
    value: 3.454,
    subLabel: 0.95,
    highlight: true,
  },
  argTypes: {},
} as ComponentMeta<typeof TokenEarningsBox>;

const Template: ComponentStory<typeof TokenEarningsBox> = args => (
  <TokenEarningsBox {...args} />
);

export const Default = Template.bind({});
Default.args = {};
