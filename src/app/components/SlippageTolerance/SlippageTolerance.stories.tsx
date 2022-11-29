import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useArgs } from '@storybook/client-api';

import SlippageTolerance from './SlippageTolerance';

// noinspection JSUnusedGlobalSymbols
export default {
  title: 'SpiritSwap/Components/SlippageTolerance',
  component: SlippageTolerance,
  args: {
    selected: 0,
    disabled: false,
    labels: [],
    customPlaceholder: 'Custom',
    customValue: '',
  },
  argTypes: {
    children: {},
  },
} as ComponentMeta<typeof SlippageTolerance>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
// noinspection RequiredAttributes
const Template: ComponentStory<typeof SlippageTolerance> = args => {
  const [{ selected, customValue }, updateArgs] = useArgs();
  return (
    <SlippageTolerance
      {...args}
      selected={selected}
      onChange={({ index, value }) => {
        updateArgs({ selected: index });
        if (index === args.labels.length) {
          updateArgs({ customValue: value });
        }
      }}
      customValue={customValue}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  labels: ['0.1%', '0.5%', '1%', 'Auto'],
};
