// Types and interfaces for data
import { Token, TokenAmount, TokenPool } from 'app/interfaces/General';
import BigNumber from 'bignumber.js';
import { PoolData } from 'utils/data/covalent';
import { MulticallSingleResponse } from 'utils/web3';

export enum QuoteToken {
  'FTM' = 'FTM',
  'SYRUP' = 'SYRUP',
  'fUSD' = 'fUSD',
  'FUSDT' = 'FUSDT',
  'USDC' = 'USDC',
  'fBTC' = 'fBTC',
  'fETH' = 'fETH',
  'TWT' = 'TWT',
  'UST' = 'UST',
  'ETH' = 'ETH',
  'COMP' = 'COMP',
  'SUSHI' = 'SUSHI',
  'SPIRIT' = 'SPIRIT',
  'FRAX' = 'FRAX',
  'YFI' = 'YFI',
  'BUSD' = 'BUSD',
  'MIM' = 'MIM',
  'SPELL' = 'SPELL',
  'GOHM' = 'GOHM',
}

export interface GaugeFarmChainData {
  gaugeWeights: string[];
  gaugeResponse: MulticallSingleResponse[];
  gaugeRewardResponse: MulticallSingleResponse[];
  totalWeight: BigNumber;
  gaugeERC20Response: MulticallSingleResponse[];
  gaugeAllocPoint: BigNumber;
  unionGaugeData: any[];
}

export interface FarmChainData {
  masterChefResponse: MulticallSingleResponse[];
  masterchefERC20Response: MulticallSingleResponse[];
  spiritPerSecond: any;
  totalAllocPoint: BigNumber;
}

export interface CovalentBalanceItem {
  balance: string;
  balance_24h: string;
  contract_address: string;
  contract_decimals: number;
  contract_name: string;
  contract_ticker_symbol: string;
  quote: number;
  quote_24h?: number;
  quote_rate: number;
  quote_rate_24h?: number;
  supports_erc: string[];
  type: string;
}

export interface CovalentBalanceSummary {
  address: string;
  chain_id: number;
  items: CovalentBalanceItem[];
  quote_currency: string;
}

export interface PoolDataSummary {
  tokenBalanceLP: number;
  quoteTokenBalanceLP: number;
  lpTokenBalanceMC: number;
  lpTotalSupply: number;
  tokenDecimals: number;
  quoteTokenDecimals: number;
  poolInfo: any;
}

export interface tokenData {
  name: string;
  title: string;
  full_name: string;
  amount: string;
  tokens: string[];
  symbol: string;
  decimals?: number;
  percentaje_change_24?: number;
  usd: number;
  usd_24: number;
  address: string;
  rate: number;
  rate_24: number;
  liquidity?: boolean;
  farm?: boolean;
  staked?: boolean;
  lpSymbol?: string;
  lpAddresses?: Array<string>;
  farmList?: Array<any>;
  token0?: Token;
  token1?: Token;
  pooled0?: number;
  pooled1?: number;
  lpSupply?: number;
  chainId?: number;
  tokensAmounts?: TokenAmount[];
  originalItem?: MulticallSingleResponse | CovalentBalanceItem;
  lpType?: string;
  type?: string;
  isRouterV2?: boolean;
}

export interface balanceReturnData {
  tokenList?: Array<tokenData>;
  farmList?: Array<tokenData> | null;
  stakeList?: Array<tokenData>;
  diffAmount: string;
  diffAmountValue?: number;
  diffPercent: string;
  diffPercentValue: number;
  totalValue: string;
  total24Value: string;
  totalValueNumber: number;
  total24ValueNumber: number;
}

export interface Call {
  address?: string; // Address of the contract
  name: string; // Function name on the contract (exemple: balanceOf)
  params?: any[]; // Function params
  data?: {
    lpSymbol: string;
    lpAddresses: {
      250: string;
    };
    balance?: string;
  };
  balance?: string;
}

export interface BoostedFarmData {
  address: string;
  tokenAddress: string;
  name: string;
  logo: string;
  weight: string;
  userVotes: string;
  value: string;
  getRewardForDuration: BigNumber;
  lpSymbol: string;
  statistics?: PoolData;
  rewards?: string;
  bribes?: string;
}

export interface BoostedFarmVoteData {
  address?: string;
  tokenAddress: string;
  userVotes: string;
  value: string;
  gaugeproxy: string;
}

export interface FarmRewardInfo {
  lpAddress: string;
  gaugeAddress: string;
  earned: string;
}

export const instanceOfPool = (data: any): data is TokenPool => {
  return 'lpAddress' in data;
};

export interface BribesProps {
  farmAddress: string;
  gaugeAddress: string;
  bribeAddress: string;
  rewardsTokens: string[];
  bribeVotes: string;
}
