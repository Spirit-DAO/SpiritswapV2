import { ComponentStory, ComponentMeta } from '@storybook/react';
import IconTooltipPanel from './IconTooltipPanel';
import { StyledQuestionIcon } from './styles';

export default {
  title: 'SpiritSwap/Farm/IconTooltipPanel',
  component: IconTooltipPanel,
  args: {
    items: [
      {
        label: 'Total liquidity',
        value: '$29,459.39',
      },
      {
        label: 'APR Range',
        value: '40.66% - 101.56%',
        tooltip: 'Lorem ipsum',
        icon: <StyledQuestionIcon />,
      },
    ],
  },
  argTypes: {},
} as ComponentMeta<typeof IconTooltipPanel>;

const Template: ComponentStory<typeof IconTooltipPanel> = args => (
  <IconTooltipPanel {...args} />
);

export const Default = Template.bind({});
Default.args = {};
