import { FarmTransactionType } from 'app/pages/Farms/enums/farmTransaction';
import { BigNumber } from 'ethers';
import JSBI from 'jsbi';
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

  wallet?: tokenData[] | IWalletV3[];

  type?: string | undefined;
  pid: number;
}

export interface IFarmingRewardToken {
  id: string;
  name: string;
  symbol: string;
  decimals: string;
}

export interface IFarmingPool {
  id: string;
  fee: string;
  token0: IFarmingRewardToken;
  token1: IFarmingRewardToken;
  sqrtPrice: string;
  liquidity: string;
  tick: string;
  feesUSD: string;
  untrackedFeesUSD: string;
}

export interface IEternalFarmingSubgraph {
  id: string;
  rewardToken: string;
  bonusRewardToken: string;
  pool: string;
  startTime: string;
  endTime: string;
  reward: string;
  bonusReward: string;
  rewardRate: string;
  bonusRewardRate: string;
  isDetached: boolean;
  minRangeLength: string;
}

export interface ITokenSubgraph {
  id: string;
  name: string;
  symbol: string;
  decimals: string;
}

export interface IPoolSubgraph {
  id: string;
  fee: string;
  token0: ITokenSubgraph;
  token1: ITokenSubgraph;
  sqrtPrice: string;
  liquidity: string;
  tick: string;
  feesUSD: string;
  untrackedFeesUSD: string;
}

export interface IDepositSubgraph {
  id: string;
  owner: string;
  pool: string;
  L2tokenId: string;
  limitFarming: string;
  eternalFarming: string;
  onFarmingCenter: boolean;
  rangeLength: string;
}

export interface ITickSubgraph {
  tickIdx: string;
  liquidityGross: string;
  liquidityNet: string;
  price0: string;
  price1: string;
}

export interface IV3Position {
  fee: undefined | string;
  feeGrowthInside0LastX128: BigNumber;
  feeGrowthInside1LastX128: BigNumber;
  liquidity: JSBI;
  nonce: BigNumber;
  operator: string;
  tickLower: number;
  tickUpper: number;
  token0: string;
  token1: string;
  tokensOwed0: BigNumber;
  tokensOwed1: BigNumber;
  tokenId: BigNumber;
  isConcentrated: boolean;
  rangeLength: number;
  onFarmingCenter: boolean;
  eternalFarming: Partial<IEternalFarming> | null;
  eternalAvailable: string | undefined;
  pool: string;
  name: string;
  id: string;
  isRemoved: boolean;
}

export type IV3TempPosition = Omit<IV3Position, 'pool'> & {
  pool?: IPoolSubgraph | null;
};

export interface IEternalFarming {
  id: string;
  rewardToken: IFarmingRewardToken;
  bonusRewardToken: IFarmingRewardToken;
  startTime: string;
  endTime: string;
  earned: string;
  bonusEarned: string;
  owner: string;
  pool: IPoolSubgraph;
}

export type IWalletV3 = Partial<IV3Position>[];
export interface IConcentratedFarm extends Omit<IFarm, 'rewardToken'> {
  pool: IPoolSubgraph;
  rangeLength: number;
  eternalFarming: IEternalFarming;
  rewardToken: ITokenSubgraph;
  bonusRewardToken: ITokenSubgraph;
  rewardRate: string;
  bonusRewardRate: string;
  wallet?: IWalletV3;
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
  onSelectPosition?: (positionId: string) => void;
  selectedPosition?: string | undefined;
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
