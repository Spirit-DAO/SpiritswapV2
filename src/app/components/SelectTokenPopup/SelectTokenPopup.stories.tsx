import { ComponentStory, ComponentMeta } from '@storybook/react';

import SelectTokenPopup from './SelectTokenPopup';
import { Props } from './SelectTokenPopup.d';

// noinspection JSUnusedGlobalSymbols
export default {
  title: 'SpiritSwap/Components/SelectTokenPopup',
  component: SelectTokenPopup,
} as ComponentMeta<typeof SelectTokenPopup>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
// noinspection RequiredAttributes
const Template: ComponentStory<typeof SelectTokenPopup> = (args: Props) => (
  <SelectTokenPopup {...args}>
    <div style={{ color: 'white' }}>TokenList component here</div>
  </SelectTokenPopup>
);

export const Default = Template.bind({});
Default.args = {};
