// Types related to constants

import { Token } from '@lifi/sdk';
import { LpRewardData } from 'app/interfaces/General';

export interface Address {
  421611?: string;
  250?: string;
  42161: string;
}

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
  'SCARAB' = 'SCARAB',
  'WFTM' = 'WFTM',
}

export interface FarmConfig {
  pid: number;
  lpSymbol: string;
  lpAddresses: Address;
  tokenSymbol: string;
  tokenAddresses: Address;
  gaugeAddressH?: string;
  quoteTokenSymbol: QuoteToken;
  quoteTokenAdresses: Address;
  multiplier?: string;
  isTokenOnly?: boolean;
  isStakingPool?: boolean;
  isLPToken?: boolean;
  isCommunity?: boolean;
  isApe?: boolean;
  isPsc?: boolean;
  isOldPsc?: boolean;
  isBoosted?: boolean;
  isGauge?: boolean;
  dual?: {
    rewardPerBlock: number;
    earnLabel: string;
    endBlock: number;
  };
  gaugeAddress?: string;
  isRouterV2?: boolean;
  v1Pid?: number;
  tokens?: Token[];
  address?: string;
  rewards?: LpRewardData;
}

export interface WhiteList {
  [key: string]: Token;
}
