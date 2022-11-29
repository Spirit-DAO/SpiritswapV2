import { Token } from './General';

export interface ListToken {
  1: Token[];
  10: Token[];
  56: Token[];
  100: Token[];
  137: Token[];
  250: Token[];
  1284: Token[];
  1285: Token[];
  42161: Token[];
  43114: Token[];
}

export interface NetworkSelectionProps {
  id: number;
  name: string;
}

export interface SelectedNetworksProps {
  From: NetworkSelectionProps;
  To: NetworkSelectionProps;
}

export interface NetworkProp {
  chainId: number;
  network: string;
  hex: string;
  rpc: string;
  name: string;
  symbol: string;
  blockExp: string;
  decimals: number;
  symbolUrl: string;
}

export interface Bridge {
  bridge: string;
  bridgeTokenAddress: string;
  name: string;
  part: number;
}
