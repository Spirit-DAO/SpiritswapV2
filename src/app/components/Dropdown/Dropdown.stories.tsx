import { ComponentStory, ComponentMeta } from '@storybook/react';

import { LanguageItems } from 'app/utils';
import Dropdown from './Dropdown';
import { Props } from './Dropdown.d';

export default {
  title: 'SpiritSwap/Components/Dropdown',
  component: Dropdown,
  argTypes: {
    items: { control: 'array' },
    selectedId: { control: { type: 'number' || 'string' } },
    onClickOutside: { action: 'onClickOutside' },
    onSelect: { action: 'onSelect' },
  },
} as ComponentMeta<typeof Dropdown>;

const Template: ComponentStory<typeof Dropdown> = (args: Props) => (
  <Dropdown {...args} />
);

export const Default = Template.bind({});
Default.args = {
  items: LanguageItems,
  selectedId: 1,
};
