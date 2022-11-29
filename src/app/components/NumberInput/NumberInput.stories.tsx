import React, { ChangeEvent, useCallback } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { NumberInput } from './index';
import { useArgs } from '@storybook/client-api';

export default {
  title: 'SpiritSwap/Components/NumberInput',
  component: NumberInput,
  args: {
    iconPrefix: null,
    iconSuffix: null,
    disabled: false,
    defaultValue: 0,
  },
  argTypes: {
    onChange: { action: 'onChange' },
  },
} as ComponentMeta<typeof NumberInput>;

const Template: ComponentStory<typeof NumberInput> = args => (
  <NumberInput {...args} />
);

const ControlledTemplate: ComponentStory<typeof NumberInput> = args => {
  const [{ value, onChange }, updateArgs] = useArgs();
  const onChangeCallback = useCallback(
    (parsedValue: number, event: ChangeEvent<HTMLInputElement>) => {
      updateArgs({ value: parsedValue });
      onChange?.(parsedValue, event);
    },
    [updateArgs, onChange],
  );
  return <NumberInput {...args} value={value} onChange={onChangeCallback} />;
};

export const Default = Template.bind({});
Default.args = {};

export const Controlled = ControlledTemplate.bind({});
Controlled.args = {
  value: 0,
};
