import { ComponentStory, ComponentMeta } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';

import Footer from './Footer';

export default {
  title: 'SpiritSwap/Layouts/Footer',
  component: Footer,
  argTypes: {},
} as ComponentMeta<typeof Footer>;

const Template: ComponentStory<typeof Footer> = () => (
  <BrowserRouter>
    <Footer />
  </BrowserRouter>
);

export const Default = Template.bind({});
Default.args = {};
