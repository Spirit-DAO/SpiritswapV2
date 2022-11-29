import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useArgs } from '@storybook/client-api';

import Switch from './Switch';

// noinspection JSUnusedGlobalSymbols
export default {
  title: 'SpiritSwap/Components/Switch',
  component: Switch,
  args: {
    checked: false,
    label: '',
  },
  argTypes: {
    children: {},
  },
} as ComponentMeta<typeof Switch>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
// noinspection RequiredAttributes
const Template: ComponentStory<typeof Switch> = args => {
  const [{ checked }, updateArgs] = useArgs();
  return (
    <Switch
      {...args}
      checked={checked}
      onChange={value => updateArgs({ checked: value })}
    />
  );
};

export const Default = Template.bind({});
Default.args = {};

export const WithLabel = Template.bind({});
WithLabel.args = {
  label: 'Label',
};
