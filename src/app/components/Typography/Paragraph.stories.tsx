import { ComponentStory, ComponentMeta } from '@storybook/react';

import Paragraph from './Paragraph';
import { Props } from './Paragraph.d';

// noinspection JSUnusedGlobalSymbols
export default {
  title: 'SpiritSwap/Components/Typography/Paragraph',
  component: Paragraph,
  argTypes: {
    children: {},
  },
} as ComponentMeta<typeof Paragraph>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
// noinspection RequiredAttributes
const Template: ComponentStory<typeof Paragraph> = (args: Props) => (
  <Paragraph {...args} />
);

export const P = Template.bind({});
P.args = {
  children: 'Paragraph',
};

export const Subtitle = Template.bind({});
Subtitle.args = {
  children: 'Subtitle',
  sub: true,
};
