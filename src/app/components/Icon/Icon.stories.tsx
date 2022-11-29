import { ComponentStory, ComponentMeta } from '@storybook/react';

import Icon from './Icon';
import { Props } from './Icon.d';

import { ReactComponent as GhostIcon } from 'app/assets/images/ghost.svg';

// noinspection JSUnusedGlobalSymbols
export default {
  title: 'SpiritSwap/Components/Icon',
  component: Icon,
  args: {
    size: 'big',
    icon: <GhostIcon />,
  },
  argTypes: {
    size: {
      type: 'string',
    },
    icon: { control: { disable: true } },
  },
} as ComponentMeta<typeof Icon>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
// noinspection RequiredAttributes
const Template: ComponentStory<typeof Icon> = (args: Props) => (
  <Icon {...args} />
);

export const Custom = Template.bind({});
Custom.args = {
  size: '24px',
  icon: <GhostIcon />,
};

export const Big = Template.bind({});
Big.args = {
  size: 'big',
  icon: <GhostIcon />,
};

export const Small = Template.bind({});
Small.args = {
  size: 'small',
  icon: <GhostIcon />,
};
