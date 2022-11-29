import { ComponentStory, ComponentMeta } from '@storybook/react';
import TokensAPR from './TokensAPR';

export default {
  title: 'SpiritSwap/Components/TokensAPR',
  component: TokensAPR,
  args: {
    tokens: ['BTC', 'ETH'],
    label: 'APR',
    apr: 45.45,
  },
  argTypes: {},
} as ComponentMeta<typeof TokensAPR>;

const Template: ComponentStory<typeof TokensAPR> = args => (
  <TokensAPR {...args} />
);

export const Default = Template.bind({});
Default.args = {};
