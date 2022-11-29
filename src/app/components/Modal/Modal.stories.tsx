import { ComponentStory, ComponentMeta } from '@storybook/react';

import Modal from './Modal';
import { Props } from './Modal.d';

// noinspection JSUnusedGlobalSymbols
export default {
  title: 'SpiritSwap/Components/Modal',
  component: Modal,
  argTypes: {
    title: { control: { type: 'string' } },
    showClose: { control: { type: 'boolean' } },
    children: {},
  },
} as ComponentMeta<typeof Modal>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
// noinspection RequiredAttributes
const Template: ComponentStory<typeof Modal> = (args: Props) => (
  <Modal {...args}>
    <div style={{ color: 'white' }}>Children here</div>
  </Modal>
);

export const Default = Template.bind({});
Default.args = {
  title: 'Settings',
};
