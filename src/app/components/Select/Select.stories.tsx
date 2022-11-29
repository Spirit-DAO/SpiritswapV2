import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useArgs } from '@storybook/client-api';
import { ReactComponent as CoinsIcon } from 'app/assets/images/money-with-hand.svg';
import { ReactComponent as QuestionIcon } from 'app/assets/images/question-3-circle.svg';

import Select from './Select';

// noinspection JSUnusedGlobalSymbols
export default {
  title: 'SpiritSwap/Components/Select',
  component: Select,
  args: {
    selected: 0,
    disabled: false,
  },
  argTypes: {
    children: {},
    onChange: { action: 'onChange' },
  },
} as ComponentMeta<typeof Select>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
// noinspection RequiredAttributes
const Template: ComponentStory<typeof Select> = args => {
  const [{ selected }, updateArgs] = useArgs();
  return (
    <Select
      {...args}
      selected={selected}
      onChange={({ index }) => updateArgs({ selected: index })}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  labels: ['Swap', 'Limit'],
};

export const IconSelect = Template.bind({});
IconSelect.args = {
  labels: [<CoinsIcon />, <QuestionIcon />],
};
