import { Token } from '../../../../interfaces/General';

export type FarmData = {
  name: string; // | Token[];
  address?: string;
  amount: string | number; // amount in specific token
  usd: string | number; // amount in usd
  staked: boolean; // staked or unstaked
  pooled0?: number;
  pooled1?: number;
  token0?: Token;
  token1?: Token;
  isRouterV2?: boolean;
  farmAddress?: string;
  isGauge?: boolean;
  pid?: number;
};
