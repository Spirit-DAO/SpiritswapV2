import { ComponentStory, ComponentMeta } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';

import NavigationDropdown from './NavigationDropdown';

export default {
  title: 'SpiritSwap/Components/NavigationDropdown',
  component: NavigationDropdown,
  argTypes: {
    items: { control: 'array' },
    onClickOutside: { action: 'onClickOutside' },
  },
} as ComponentMeta<typeof NavigationDropdown>;

const Template: ComponentStory<typeof NavigationDropdown> = args => (
  <BrowserRouter>
    <NavigationDropdown {...args} />
  </BrowserRouter>
);

export const items = [
  { title: 'Bridge', path: 'bridge' },
  { title: 'Lend/Borrow', path: 'lend-borrow' },
  { title: 'Staking', path: 'staking' },
  { title: 'ApeMode', path: 'apemode' },
  { title: 'Store', path: 'store' },
  { title: 'Analytics', path: 'analytics' },
  { title: 'IDO', path: 'ido' },
  { title: 'NFTs', path: 'nfts' },
  { title: 'Docs', path: 'docs' },
];

export const Default = Template.bind({});
Default.args = {
  items: items,
};
