import { FunctionComponent } from 'react';
import { Token } from '@lifi/sdk';

export type { Token } from '@lifi/sdk';

export interface UserCustomToken extends Token {
  addedByUser?: boolean;
  balance?: string;
  balanceUSD?: string;
  amount?: string;
  rate?: number;
}

export interface TokenAmount {
  token: Token | WeightedTokenPool | SobTokenPool;
  amount: string;
}

export interface TokenPool {
  address: string;
  lpAddress?: string;
  symbol: string;
  name: string;
  decimals: number;
  chainId: number;
  tokens: Token[];
  lpType?: string;
}

export interface SobToken extends Token {
  poolId: string;
  tokenIn: Token;
}

export interface LpRewardData {
  address: string;
  method: string;
  abi: string;
  pid?: number;
}

export interface SobTokenPool extends TokenPool {
  poolId: string;
  sobTokens: SobToken[];
  type: string | undefined;
  rewards: LpRewardData;
}

export interface WeightedTokenPool extends TokenPool {
  poolId: string;
  weights: number[];
  type: string | undefined;
  rewards: LpRewardData;
}

export interface SobSwap {
  poolId: string;
  assetInIndex: number;
  assetOutIndex: number;
  amount: string;
  userData: string;
}

export interface ListTokenItemProps {
  item: UserCustomToken;
  bridge?: 'from' | 'to' | undefined;
  style?: any;
  onSelect?: (item: Token, onClose: () => void) => Token;
  onClose?: () => void;
}

export interface ListPoolItemProps {
  item: TokenPool;
  selectCallback: (item: TokenPool) => void;
}

export interface ListProps {
  options: TokenPool[] | Token[];
  ListItem:
    | FunctionComponent<ListTokenItemProps>
    | FunctionComponent<ListPoolItemProps>;
  selectCallback: ((item: TokenPool) => void) | ((item: Token) => void);
  isDropdown: boolean;
  dropdownTitle: string;
  closeDropdown?: () => void;
  isAbsolute?: boolean;
  top?: { base: string; md: string };
}
