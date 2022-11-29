import { ComponentStory, ComponentMeta } from '@storybook/react';

import Button from './Button';

// noinspection JSUnusedGlobalSymbols
export default {
  title: 'SpiritSwap/Components/Button',
  component: Button,
  args: {
    variant: 'primary',
    size: 'default',
    disabled: false,
    flat: false,
  },
  argTypes: {
    children: {},
    onClick: { action: 'onClick' },
  },
} as ComponentMeta<typeof Button>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
// noinspection RequiredAttributes
const Template: ComponentStory<typeof Button> = args => <Button {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: 'Default button',
};
