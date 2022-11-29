import { ComponentStory, ComponentMeta } from '@storybook/react';
import TokenPairAPR from './TokenPairAPR';

export default {
  title: 'SpiritSwap/Farm/TokenPairAPR',
  component: TokenPairAPR,
  args: {
    tokens: ['BTC', 'ETH'],
    label: 'APR',
    apr: 45.45,
  },
  argTypes: {},
} as ComponentMeta<typeof TokenPairAPR>;

const Template: ComponentStory<typeof TokenPairAPR> = args => (
  <TokenPairAPR {...args} />
);

export const Default = Template.bind({});
Default.args = {};
