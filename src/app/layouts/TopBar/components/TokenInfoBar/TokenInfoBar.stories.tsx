import { ComponentStory, ComponentMeta } from '@storybook/react';

import TokenInfoBar from './TokenInfoBar';
import { Props } from './TokenInfoBar.d';

// noinspection JSUnusedGlobalSymbols
export default {
  title: 'SpiritSwap/Layouts/TokenInfoBar',
  component: TokenInfoBar,
} as ComponentMeta<typeof TokenInfoBar>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
// noinspection RequiredAttributes
const Template: ComponentStory<typeof TokenInfoBar> = (args: Props) => (
  <TokenInfoBar {...args} />
);

export const Default = Template.bind({});
Default.args = {
  tokenName: 'SPIRIT',
  tokenPriceCurrency: '$',
  tokenPrice: 0.226,
  tokenRate: 15.4,
};
