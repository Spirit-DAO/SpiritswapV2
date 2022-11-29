import { ComponentStory, ComponentMeta } from '@storybook/react';

import IconButton from './IconButton';
import { Props } from './IconButton.d';

import { ReactComponent as GitHubIcon } from 'app/assets/images/github.svg';

// noinspection JSUnusedGlobalSymbols
export default {
  title: 'SpiritSwap/Components/IconButton',
  component: IconButton,
  args: {
    variant: 'primary',
    size: 'default',
    disabled: false,
    flat: false,
    iconPos: 'left',
    label: '',
  },
  argTypes: {
    children: {},
    icon: { control: { disable: true } },
    iconOnly: { control: { disable: true }, table: { disable: true } },
    label: { control: { type: 'text' } },
  },
} as ComponentMeta<typeof IconButton>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
// noinspection RequiredAttributes
const Template: ComponentStory<typeof IconButton> = (args: Props) => (
  <IconButton {...args} />
);

export const Default = Template.bind({});
Default.args = {
  label: 'Button',
  icon: <GitHubIcon />,
};

export const IconOnly = Template.bind({});
IconOnly.args = {
  icon: <GitHubIcon />,
};

export const LabelOnly = Template.bind({});
LabelOnly.args = {
  label: 'Button',
};
