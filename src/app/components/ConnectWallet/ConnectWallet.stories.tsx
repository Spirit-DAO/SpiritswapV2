import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ConnectWalletProps } from 'app/components/ConnectWallet';
import { ConnectWallet } from 'app/components/ConnectWallet';

const isOpen = {
  name: 'Open flag',
  description: 'This flag is responsible to open modal',
  table: {
    category: 'Actions',
    type: { summary: 'boolean' },
    defaultValue: { summary: 'false' },
  },
  defaultValue: true,
  control: { type: 'boolean' },
};

const argTypes = {
  isOpen,
  dismiss: { action: 'clicked' },
};

export default {
  argTypes,
  title: 'SpiritSwap/Components/ConnectWallet',
} as ComponentMeta<typeof ConnectWallet>;

const Template: ComponentStory<typeof ConnectWallet> = (
  props: ConnectWalletProps,
) => <ConnectWallet {...props} />;

export const ConnectWalletStory = Template.bind({});
ConnectWalletStory.storyName = 'Wallets List';
