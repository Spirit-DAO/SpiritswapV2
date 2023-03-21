import { FarmTransactionType } from 'app/pages/Farms/enums/farmTransaction';
import { tokenData } from 'utils/data';

export interface IFarmFilters {
  staked: boolean;
  inactive: boolean;
}

export interface IFarm {
  [x: string]: any;
  title: string;
  lpAddress: string;
  gaugeAddress?: string;
  /* Tokens */
  tokens: string[];
  aprLabel: string;
  apr: string;
  rewardToken?: string; // reward token for ecosystem farm

  /* Type */
  boosted: boolean;
  classic?: boolean;
  stable?: boolean;
  weighted?: boolean;
  concentrated?: boolean;

  /* Info */
  totalLiquidity: number;
  totalSupply: string;
  aprRange?: number[] | string[];
  multiplier?: string;
  lpApr: string;
  valid: boolean;
  label: string;

  /* Progress */
  boostFactor?: string;
  yourApr?: string;
  holdAmountForMaxBoost?: string;
  progress?: number;

  /* Earnings */
  spiritEarned?: string;
  spiritEarnedMoney?: string;
  lpTokens: string;
  lpTokensMoney: string;

  wallet?: tokenData[];

  type?: string | undefined;
  pid: number;
}

export interface IConcentratedFarm extends IFarm {
  pool: any;
  rangeLength: number;
  eternalFarming: any | null;
  rewardToken: any;
  bonusRewardToken: any;
  rewardRate: any;
  bonusRewardRate: any;
  wallet?: any[];
}

export interface IFarmTransaction {
  farm: IFarm;
  amountStaked: string;
  value: string;
  moneyValue: string;
  type?: FarmTransactionType;
  onConfirmDeposit: (_amount: string) => Promise<any> | void;
  onConfirmWithdraw: (_amount: string, isMax?: boolean) => Promise<any> | void;
  onCancelTransaction?: () => void;
  onApproveTransaction: (_positionId?: string) => any;
  onClaimTransaction: () => any;
  onOpen?: () => void;
}

export interface GaugeFarm {
  gaugeAddress: string;
  address: string;
  weight: string;
  token0?: string;
  token1?: string;
  bribe?: string;
}

export enum FarmType {
  ALL,
  CLASSIC,
  STABLE,
  CONCENTRATED,
  ADMIN,
}

export enum EcosystemFarmType {
  NONE,
  UNVERIFIED, // not verified
  VERIFIED, // verified
}

export interface FarmProps {
  pid: number;
  isPsc: boolean;
  lpSymbol: string;
  name: string;
  lpAddresses: {
    4002: string;
    250: string;
  };
  gaugeAddress: string;
  bribeAddress: string;
  gaugeproxy: string;
  bribeRewards: string[];
}
