import { ComponentStory, ComponentMeta } from '@storybook/react';

import TokenIcon from './TokenIcon';
import type { Props } from './TokenIcon.d';
import { Token } from 'app/utils';

const possibleTokenValues = Object.values(Token);

// noinspection JSUnusedGlobalSymbols
export default {
  title: 'SpiritSwap/Components/TokenIcon',
  component: TokenIcon,
  argTypes: {
    size: {
      control: {
        type: 'text',
      },
    },
    svgColor: {
      control: {
        type: 'radio',
        options: ['default', 'white', 'black'],
      },
    },
    token: {
      control: {
        type: 'select',
        options: possibleTokenValues,
      },
    },
  },
  args: {
    size: 'big',
    svgColor: 'default',
    token: Token.BTC,
  },
} as ComponentMeta<typeof TokenIcon>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
// noinspection RequiredAttributes
const Template: ComponentStory<typeof TokenIcon> = (args: Props) => (
  <TokenIcon {...args} />
);

export const Default = Template.bind({});
Default.args = {
  token: Token.BTC,
};

export const WhiteColor = Template.bind({});
WhiteColor.args = {
  token: Token.ETHOS,
  svgColor: 'white',
};

export const BlackColor = Template.bind({});
BlackColor.args = {
  token: Token.ETHOS,
  svgColor: 'black',
};

export const BigSize = Template.bind({});
BigSize.args = {
  token: Token.LUN,
  size: 'big',
};

export const SmallSize = Template.bind({});
SmallSize.args = {
  token: Token.BNB,
  size: 'small',
};

export const NumberSize = Template.bind({});
NumberSize.args = {
  token: Token.COB,
  size: 200,
};
