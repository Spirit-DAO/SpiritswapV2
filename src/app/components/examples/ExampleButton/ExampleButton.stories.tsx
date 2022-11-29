import * as React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import ExampleButton, { Props as ExampleButtonProps } from './index';

// noinspection JSUnusedGlobalSymbols
export default {
  title: 'SpiritSwap/Guides/Creating a new component: Example Button',
  component: ExampleButton,
  argTypes: {
    textColor: { control: 'color' },
    children: {},
  },
} as ComponentMeta<typeof ExampleButton>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
// noinspection RequiredAttributes
const Template: ComponentStory<typeof ExampleButton> = (
  args: ExampleButtonProps,
) => <ExampleButton {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: 'Default button',
};

export const Green = Template.bind({});
Green.args = {
  children: 'Button in green',
  textColor: 'green',
};

export const Blue = Template.bind({});
Blue.args = {
  children: 'And now in blue',
  textColor: 'blue',
};
