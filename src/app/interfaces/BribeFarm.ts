import { Token } from './General';

export interface IBribeFarm {
  token: Token;
  tokenValue: string;
  bribeAddress: string;
}

export interface IBribeFarmTx {
  _farmAddress: string;
  _amount: number | string;
  _token: Token;
  _connector?: any;
  _chainId?: number;
}
