import {
  BigNumber,
  ContractInterface,
  Signer,
  Contract,
  BytesLike,
  providers,
} from 'ethers';
import { CHAIN_ID } from 'constants/index';
import { useSuggestionsProps } from 'app/hooks/Suggestions/Suggestion';

export type BalanceResponse = BigNumber | string;

export interface ChainEvent {
  // address: string;
  recipient?: boolean;
  sender?: boolean;
  amount?: number;
  callback?: Function;
  from?: number;
  to?: number;
}

export interface Call {
  address?: string; // Address of the contract
  name: string; // Function name on the contract (exemple: balanceOf)
  params?: any[]; // Function params
  data?: {
    lpSymbol?: string;
    lpAddresses?: {
      [CHAIN_ID]: string;
    };
    balance?: string;
  };
  balance?: string;
}

export interface EthereumChainParameter {
  chainId: string; // A 0x-prefixed hexadecimal string
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string; // 2-6 characters long
    decimals: 18;
  };
  rpcUrls: string[];
  blockExplorerUrls?: string[];
  iconUrls?: string[]; // Currently ignored.
}

export interface ConnectInfo {
  chainId: string;
}

export interface ProviderRpcError extends Error {
  message: string;
  code: number;
  data?: unknown;
}

export interface ProviderMessage {
  type: string;
  data: unknown;
}

export interface MulticallSingleResponse {
  response: any;
  call: Call;
  address?: string;
  symbol?: string;
  balance?: string;
  quote?: number;
  quote_rate?: number;
  quote_24h?: number;
  masterchef?: boolean;
  v2?: boolean;
}

export interface Web3TxData {
  actionType:
    | 'APPROVE'
    | 'LIQUIDITY'
    | 'BRIDGE'
    | 'FARM'
    | 'SWAP'
    | 'BRIBE'
    | undefined;
  hash: string;
  uniqueMessage?: { text: string; secondText?: string };
  successTitle: string;
  errorTitle: string;
  inputSymbol?: string;
  outputSymbol?: string;
  inputValue?: string;
  outputValue?: string;
  link?: string;
  type?: string;
  update?: string;
  updateTarget?: string;
  bridgeIndex?: number | undefined;
  origin?: string;
  chainId?: string | number | undefined;
  tx?: any;
  suggestionData?: useSuggestionsProps | undefined;
}

export interface BalanceUpdate {
  id: string; // Used to avoid duplicate requests
  type: string;
  timestamp: number; // Used to prevent balance requests too close together
  block: number;
  force?: boolean;
  origin?: string;
  chainId?: string | number;
  bridge?: string;
}

export type Web3Provider = providers.Web3Provider;

export type {
  BigNumber,
  ContractInterface,
  Signer,
  BytesLike,
  Contract as ContractInstance,
};
