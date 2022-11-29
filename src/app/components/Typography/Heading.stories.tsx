import { ComponentStory, ComponentMeta } from '@storybook/react';

import Heading from './Heading';
import { Props } from './Heading.d';

// noinspection JSUnusedGlobalSymbols
export default {
  title: 'SpiritSwap/Components/Typography/Heading',
  component: Heading,
  args: {
    level: 1,
  },
  argTypes: {
    children: {},
    level: {
      options: [1, 2, 3, 4, 5],
    },
  },
} as ComponentMeta<typeof Heading>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
// noinspection RequiredAttributes
const Template: ComponentStory<typeof Heading> = (args: Props) => (
  <Heading {...args} />
);

export const H1 = Template.bind({});
H1.args = {
  children: 'Heading 1',
};

export const H2 = Template.bind({});
H2.args = {
  level: 2,
  children: 'Heading 2',
};

export const H3 = Template.bind({});
H3.args = {
  level: 3,
  children: 'Heading 3',
};

export const H4 = Template.bind({});
H4.args = {
  level: 4,
  children: 'Heading 4',
};

export const H5 = Template.bind({});
H5.args = {
  level: 5,
  children: 'Heading 5',
};
