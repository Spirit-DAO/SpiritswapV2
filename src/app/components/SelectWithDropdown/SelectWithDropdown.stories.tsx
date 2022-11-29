import { ComponentStory, ComponentMeta } from '@storybook/react';

import { LanguageItems } from 'app/utils';
import SelectWithDropdown from './SelectWithDropdown';
import { Props } from './SelectWithDropdown.d';

import { ReactComponent as LanguageIcon } from 'app/assets/images/language.svg';

// noinspection JSUnusedGlobalSymbols
export default {
  title: 'SpiritSwap/Components/SelectWithDropdown',
  component: SelectWithDropdown,
  argTypes: {
    items: { control: 'array' },
    selectedId: { control: { type: 'number' || 'string' } },
    icon: { control: { disable: true } },
  },
} as ComponentMeta<typeof SelectWithDropdown>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
// noinspection RequiredAttributes
const Template: ComponentStory<typeof SelectWithDropdown> = (args: Props) => (
  <SelectWithDropdown {...args} />
);

export const Default = Template.bind({});
Default.args = {
  items: LanguageItems,
  selectedId: 1,
  icon: <LanguageIcon />,
};
