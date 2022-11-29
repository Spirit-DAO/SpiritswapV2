import React, { ChangeEvent, useCallback, useState } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ReactComponent as SearchIcon } from 'app/assets/images/search-loupe.svg';

import { Input } from './index';

export default {
  title: 'SpiritSwap/Components/Input',
  component: Input,
  args: {
    iconPrefix: null,
    iconSuffix: null,
    disabled: false,
  },
  argTypes: {
    onChange: { action: 'onChange' },
    onClickIconSuffix: { action: 'onClickIconSuffix' },
  },
} as ComponentMeta<typeof Input>;

const Template: ComponentStory<typeof Input> = args => <Input {...args} />;

const ControlledTemplate: ComponentStory<typeof Input> = args => {
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
    <Input {...args} value={controlledValue} onChange={onChangeCallback} />
  );
};

export const Default = Template.bind({});
Default.args = {};

export const WithPrefixIcon = Template.bind({});
WithPrefixIcon.args = {
  iconPrefix: <SearchIcon />,
};

export const WithDeleteIcon = Template.bind({});
WithDeleteIcon.args = {
  iconSuffix: 'delete',
};

export const WithSuffixIcon = Template.bind({});
WithSuffixIcon.args = {
  iconSuffix: <SearchIcon />,
};

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
