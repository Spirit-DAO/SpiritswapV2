import React, { ChangeEvent, useCallback, useState } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { SearchInput } from './index';

export default {
  title: 'SpiritSwap/Components/SearchInput',
  component: SearchInput,
  argTypes: {
    onChange: { action: 'onChange' },
  },
} as ComponentMeta<typeof SearchInput>;

const Template: ComponentStory<typeof SearchInput> = args => (
  <SearchInput {...args} />
);

const ControlledTemplate: ComponentStory<typeof SearchInput> = args => {
  const [controlledValue, setControlledValue] = useState(
    'try to type something',
  );
  const onChangeCallback = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setControlledValue(event.target.value.replace(/test/g, 'hurray'));
    },
    [setControlledValue],
  );
  return (
    <SearchInput
      {...args}
      value={controlledValue}
      onChange={onChangeCallback}
    />
  );
};

export const Default = Template.bind({});
Default.args = {};

export const WithPlaceholder = Template.bind({});
WithPlaceholder.args = {
  placeholder: 'You can start typing something here...',
};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
};

export const DisabledWithPlaceholder = Template.bind({});
DisabledWithPlaceholder.args = {
  placeholder: 'This one is disabled!',
  disabled: true,
};

export const Controlled = ControlledTemplate.bind({});
Controlled.args = {};
