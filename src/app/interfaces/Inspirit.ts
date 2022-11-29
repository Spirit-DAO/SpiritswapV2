import BigNumber from 'bignumber.js';

export interface FarmVote {
  address: string;
  tokens: string[];
  liquidity: string;
  yourVote: string;
  feeEarns: string;
  rewards: string;
  votes: number;
  pid: number;
  fulldata: any;
}

export interface FarmVoteComplete extends FarmVote {
  percent: string;
  votesTotal: string;
}

export interface BoostedFarm {
  bribes: string;
  feeEarns: string;
  liquidityPer10kInspirit: number;
  fulldata: {
    farmAddress: string;
    bribeAddress: string;
    rewardsTokens: string[];
    bribeVotes: string;
    rewards: BigNumber[];
    rewardsUSD: string[];
    userRewardsEarnsUSD: string[];
  };
  logo: string;
  name: string;
  totalVotesOnFarm: string;
  userVotes: string;
  value: string;
  weight: number;
}
