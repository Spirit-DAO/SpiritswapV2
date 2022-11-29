import { ComponentStory, ComponentMeta } from '@storybook/react';

import Slippage from './Slippage';

export default {
  title: 'SpiritSwap/Swap/Slippage',
  component: Slippage,
  args: {
    SlippageName: '',
    SlippageValue: '',
    SlippageNameIcon: '',
    SlippageValueIcon: '',
  },
} as ComponentMeta<typeof Slippage>;

const Template: ComponentStory<typeof Slippage> = args => {
  return <Slippage {...args} />;
};

export const Default = Template.bind({});
