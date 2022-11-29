import { ComponentStory, ComponentMeta } from '@storybook/react';
import BoostInfoPanel from './BoostInfoPanel';

export default {
  title: 'SpiritSwap/Farm/BoostInfoPanel',
  component: BoostInfoPanel,
  args: {
    boostFactor: '1.70',
    yourApr: 73.33,
    holdAmountForBoost: 43454.34,
    holdAmountForBoostFactor: 2.5,
    progress: 45,
  },
  argTypes: {},
} as ComponentMeta<typeof BoostInfoPanel>;

const Template: ComponentStory<typeof BoostInfoPanel> = args => (
  <BoostInfoPanel {...args} />
);

export const Default = Template.bind({});
Default.args = {};
