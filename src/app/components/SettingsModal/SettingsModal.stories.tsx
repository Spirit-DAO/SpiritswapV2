import { ComponentStory, ComponentMeta } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import SettingsModal from './SettingsModal';
import { Props } from './SettingsModal.d';

export default {
  title: 'SpiritSwap/Components/SettingsModal',
} as ComponentMeta<typeof SettingsModal>;

const Template: ComponentStory<typeof SettingsModal> = (props: Props) => (
  <SettingsModal
    {...props}
    onSelectLanguage={action('lang')}
    onClose={action('close')}
  />
);

export const SettingsModalStory = Template.bind({});
SettingsModalStory.argTypes = {};
SettingsModalStory.storyName = 'Default Settings Modal';
