import { ComponentStory, ComponentMeta } from '@storybook/react';

import Panel from './Panel';
import { Props } from './Panel.d';
import { Button } from '../Button';

// noinspection JSUnusedGlobalSymbols
export default {
  title: 'SpiritSwap/Components/Panel',
  component: Panel,
} as ComponentMeta<typeof Panel>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
// noinspection RequiredAttributes
const Template: ComponentStory<typeof Panel> = (args: Props) => (
  <Panel {...args}>Children here</Panel>
);

export const PanelWithFooter = Template.bind({});
PanelWithFooter.args = {
  footer: <Button variant="secondary">Default Button</Button>,
};

export const PanelWithoutFooter = Template.bind({});
PanelWithoutFooter.args = {};
