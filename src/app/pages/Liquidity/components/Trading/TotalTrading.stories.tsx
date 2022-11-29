import { ComponentStory, ComponentMeta } from '@storybook/react';

import TotalTrading from './TotalTrading';
import { Props } from './TotalTrading.d';
export default {
  title: 'SpiritSwap/Swap/TotalTrading',
  component: TotalTrading,
  argTypes: {
    totalTradingActualPriceValue: {
      type: 'string',
    },
    totalTradingApproxPriceValue: {
      type: 'string',
    },
  },
} as ComponentMeta<typeof TotalTrading>;

const Template: ComponentStory<typeof TotalTrading> = (args: Props) => {
  return <TotalTrading {...args} />;
};
export const Default = Template.bind({});
Default.args = {
  liquidityTradeEstimate: '9,850.341 FTM/SPIRIT LP',
  liquidityTradeEstimateUSD: '≈ $7,072.43',
};
