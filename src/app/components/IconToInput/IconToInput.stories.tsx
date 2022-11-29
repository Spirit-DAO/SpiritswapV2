import { ComponentMeta, ComponentStory } from '@storybook/react';
import IconToInput from './IconToInput';
import { Props } from './IconToInput.d';
import { ChangeEvent, useCallback, useState } from 'react';

export default {
  title: 'SpiritSwap/Components/IconToInput',
  component: IconToInput,
  args: {
    disabled: false,
    open: false,
    placeholder: `Search for token...`,
  },
  argTypes: {
    onChange: { action: 'onChange' },
  },
} as ComponentMeta<typeof IconToInput>;

const Template: ComponentStory<typeof IconToInput> = (args: Props) => (
  <IconToInput {...args} />
);

const ControlledTemplate: ComponentStory<typeof IconToInput> = args => {
  const [controlledValue, setControlledValue] = useState(
    'Try to type something...',
  );
  const onChangeCallback = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setControlledValue(event.target.value.replace(/test/g, 'hurray'));
    },
    [setControlledValue],
  );
  return (
    <IconToInput
      {...args}
      value={controlledValue}
      onChange={onChangeCallback}
    />
  );
};

export const Default = Template.bind({});
Default.args = {};

export const Open = Template.bind({});
Open.args = {
  open: true,
};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
};

export const OpenAndDisabled = Template.bind({});
OpenAndDisabled.args = {
  disabled: true,
  open: true,
};

export const Controlled = ControlledTemplate.bind({});
Controlled.args = {};
