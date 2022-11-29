import { ComponentStory, ComponentMeta } from '@storybook/react';

import Trading from './Trading';

export default {
  title: 'SpiritSwap/Swap/Trading',
  component: Trading,
} as ComponentMeta<typeof Trading>;

const Template: ComponentStory<typeof Trading> = args => {
  return <Trading {...args} />;
};
export const Default = Template.bind({});
