import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';

import TopBar from './TopBar';

export default {
  title: 'SpiritSwap/Layouts/TopBar',
  component: TopBar,
  argTypes: {},
} as ComponentMeta<typeof TopBar>;

const Template: ComponentStory<typeof TopBar> = () => (
  <BrowserRouter>
    <TopBar />
  </BrowserRouter>
);

export const Default = Template.bind({});
Default.args = {};
