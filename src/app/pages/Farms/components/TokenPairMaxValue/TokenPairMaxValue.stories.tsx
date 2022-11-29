import { ComponentStory, ComponentMeta } from '@storybook/react';
import TokenPairMaxValue from './TokenPairMaxValue';

export default {
  title: 'SpiritSwap/Farm/TokenPairMaxValue',
  component: TokenPairMaxValue,
  args: {
    value: '2,000.0',
    moneyValue: '≈ $3,540.32',
    tokens: ['BTC', 'ETH'],
    amountValue: '262.34',
    amountType: 'balance',
    onMaxClick: () => {},
  },
  argTypes: {
    amountType: {
      options: ['balance', 'staked'],
      control: { type: 'radio' },
    },
  },
} as ComponentMeta<typeof TokenPairMaxValue>;

const Template: ComponentStory<typeof TokenPairMaxValue> = args => (
  <TokenPairMaxValue {...args} />
);

export const Default = Template.bind({});
Default.args = {};
