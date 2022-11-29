import { ComponentStory, ComponentMeta } from '@storybook/react';
import Collapse from './Collapse';

export default {
  title: 'SpiritSwap/Liquidity/Collapse',
  component: Collapse,
  args: {
    selected: false,
    collapseItemName: 'Testing',
    collapseItemFantomLogoSvg: require('app/assets/images/fantom-logo.svg')
      .default,
    collapseItemSpiritLogoSvg: require('app/assets/images/spirit-logo.svg')
      .default,
    collapseItemValue: '$23.8k',
    collapseSlipArray: [
      { slippageName: 'Pooled FTM:', slippageValue: '4923.421' },
      { slippageName: 'Pooled SPIRIT:', slippageValue: '17389.1205' },
      { slippageName: 'Your pool tokens:', slippageValue: '9,850.341' },
      { slippageName: 'Your pool share:', slippageValue: '0,1%' },
    ],
    collapseShowDetailOption: 'Text',
    onClick: () => {},
  },
  argTypes: {
    children: {},
    onclick: { action: 'onClick' },
  },
} as ComponentMeta<typeof Collapse>;

const Template: ComponentStory<typeof Collapse> = args => (
  <Collapse {...args} />
);

export const Default = Template.bind({});
