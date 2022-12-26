import BigNum from 'bignumber.js';
import { BigNumber, ethers, utils } from 'ethers';
import addresses from 'constants/contracts';
import moment, { DurationInputArg1, DurationInputArg2 } from 'moment';
import gauges from 'constants/gauges';
import {
  CHAIN_ID,
  EMPY_FARM,
  FOUR_YEARS,
  ONE_DAY,
  ONE_WEEK,
} from 'constants/index';
import {
  Multicall,
  Call,
  Contract,
  Web3Provider,
  getBribeContract,
  MulticallV2,
  MulticallSingleResponse,
} from 'utils/web3';
import { getTokensDetails, getTokenUsdPrice } from './covalent';
import { BoostedFarmData, BoostedFarmVoteData } from './types';
import {
  formatBoostedFarms,
  formatBribes,
  getFormattedBribes,
  getSplitBribesCallsV2,
} from './formatters';
import { SPIRIT, tokens, WFTM } from 'constants/tokens';
import { checkAddress, getDaysUntilFriday } from 'app/utils';
import { getMappedTokens } from './generalStats';

const { formatUnits } = utils;

export const getInspiritStatistics = async (
  provider?: Web3Provider,
  timeframe = 'week',
) => {
  const DAY = 86400;
  // Last two weeks
  const WEEKBIGNUMBER = BigNumber.from(7 * DAY * 2);

  // Timerange for date sensitive statistics
  let period = WEEKBIGNUMBER;

  if (timeframe === 'month') {
    const MONTH = 86400 * 30;

    period = BigNumber.from(MONTH);
  }

  if (timeframe === 'year') {
    const YEAR = 86400 * 365;

    period = BigNumber.from(YEAR);
  }

  const inspiritAddress = addresses.inspirit[CHAIN_ID];

  const [ftm, spirit] = await getTokensDetails([SPIRIT.address, WFTM.address]);

  const spiritInfo = {
    price: spirit ? (spirit.rate ? spirit.rate : 0) : 0,
    percentajeChange24: spirit.percentaje_change_24 || 0,
  };
  const ftmInfo = {
    price: ftm ? (ftm.rate ? ftm.rate : 0) : 0,
    percentajeChange24: ftm.percentaje_change_24 || 0,
  };

  const balanceParams: Array<Call> = [
    {
      address: inspiritAddress,
      name: 'totalSupply',
      params: [],
      data: {},
    },
    {
      address: inspiritAddress,
      name: 'supply',
      params: [],
      data: {},
    },
  ];

  const feeDistributorAddress = addresses.feedistributor[CHAIN_ID];

  const feeDisCalls = [
    {
      address: `${feeDistributorAddress}`,
      name: 'time_cursor',
      params: [],
      data: {},
    },
  ];

  const [multicall, feeDistributorMulticall] = await Promise.all([
    Multicall(balanceParams, 'inspirit', CHAIN_ID, 'rpc', provider),
    Multicall(feeDisCalls, 'feedistributor', CHAIN_ID, 'rpc', provider),
  ]);

  const totalSupply = formatUnits(multicall[0]?.response[0], 18);
  const totalLocked = formatUnits(multicall[1]?.response[0], 18);

  const [timeCursor] = feeDistributorMulticall;
  const beginningPeriod = BigNumber.from(timeCursor.response[0])
    .sub(period)
    .toNumber();

  const tokensPerWeekCall = [
    {
      address: feeDistributorAddress,
      name: 'tokens_per_week',
      params: [`${beginningPeriod}`],
    },
  ];

  const [lastDistributionCall] = await Multicall(
    tokensPerWeekCall,
    'feedistributor',
    CHAIN_ID,
    'rpc',
    provider,
  );

  const lastDistribution = lastDistributionCall.response[0];

  const avgTime = (
    (1460 / parseFloat(totalLocked)) *
    parseFloat(totalSupply)
  ).toFixed(0);

  const totalLockedValue = spiritInfo.price * parseFloat(totalSupply) || 0;
  const totalSpiritValue = spiritInfo.price * parseFloat(totalLocked) || 0;

  const nextDistribution = timeCursor.response[0].toNumber();
  const lastDistributionSpirits = parseFloat(formatUnits(lastDistribution, 18));
  const lastDistributionValue = spiritInfo.price * lastDistributionSpirits;
  const aprLDbased =
    (lastDistributionSpirits * 52 * 100) / parseFloat(totalSupply);
  const inspiritPerSpirit = lastDistributionSpirits / parseFloat(totalSupply);

  return {
    totalSupply,
    totalLocked,
    spiritInfo,
    ftmInfo,
    avgTime,
    totalSpiritValue,
    totalLockedValue,
    nextDistribution,
    lastDistribution: lastDistributionSpirits,
    lastDistributionValue,
    aprLDbased,
    inspiritPerSpirit,
    beginningPeriod: beginningPeriod * 1000,
  };
};

export const getUserInspiritBalances = async (userAddress: string) => {
  const inspiritAddress = addresses.inspirit[CHAIN_ID];

  const balanceParams: Array<Call> = [
    {
      address: inspiritAddress,
      name: 'locked',
      params: [userAddress],
      data: {},
    },
    {
      address: inspiritAddress,
      name: 'balanceOf',
      params: [userAddress],
      data: {},
    },
  ];

  const multicall = await Multicall(balanceParams, 'inspirit');
  const userLocked = multicall[0]
    ? formatUnits(multicall[0]?.response[0], 18)
    : '0';
  const userLockEndDate = multicall[0] ? multicall[0]?.response[1] : 0;
  const userBalance = multicall[1]
    ? formatUnits(multicall[1]?.response[0], 18)
    : '0';

  const feeDistributorAddress = addresses.feedistributor[CHAIN_ID];

  const feeDisributorContract = await Contract(
    feeDistributorAddress,
    'feedistributor',
  );

  const userClaim = await feeDisributorContract.callStatic['claim(address)'](
    userAddress,
    {
      gasLimit: 1000000,
    },
  );

  const userClaimableAmount = formatUnits(userClaim, 18);

  return {
    userLocked,
    userBalance,
    userClaimableAmount,
    userLockEndDate,
  };
};

export const getUserVotingData = async (
  userAddress,
  v2Gauges,
  stableGauges,
  variableLps,
  stableLps,
) => {
  const gaugeAddressV2 = addresses.variableProxy[CHAIN_ID];
  const gaugeAddressStable = addresses.stableProxy[CHAIN_ID];

  const v2VotingCalls: Call[] = [];
  const v2BribesCalls: Call[] = [];
  const v2Rewards0Calls: Call[] = [];
  const v2Rewards1Calls: Call[] = [];
  const v2WeightsCalls: Call[] = [];

  const stableVotingCalls: Call[] = [];
  const stableBribesCalls: Call[] = [];
  const stableRewards0Calls: Call[] = [];
  const stableRewards1Calls: Call[] = [];
  const stableWeightsCalls: Call[] = [];

  for (let i = 0; i < v2Gauges.length; i++) {
    const gauge = v2Gauges[i];
    const lpAddress = variableLps[i];

    v2VotingCalls.push({
      address: gaugeAddressV2,
      name: 'votes',
      params: [userAddress, lpAddress],
    });
    v2BribesCalls.push({
      address: gaugeAddressV2,
      name: 'bribes',
      params: [gauge],
    });
    v2Rewards0Calls.push({
      address: lpAddress,
      name: 'token0',
      params: [],
    });
    v2Rewards1Calls.push({
      address: lpAddress,
      name: 'token1',
      params: [],
    });
    v2WeightsCalls.push({
      address: gaugeAddressV2,
      name: 'weights',
      params: [lpAddress],
    });
  }
  for (let i = 0; i < stableGauges.length; i++) {
    const gauge = stableGauges[i];
    const lpAddress = stableLps[i];
    stableVotingCalls.push({
      address: gaugeAddressStable,
      name: 'votes',
      params: [userAddress, lpAddress],
    });
    stableBribesCalls.push({
      address: gaugeAddressStable,
      name: 'bribes',
      params: [gauge],
    });
    stableRewards0Calls.push({
      address: lpAddress,
      name: 'token0',
      params: [],
    });
    stableRewards1Calls.push({
      address: lpAddress,
      name: 'token1',
      params: [],
    });
    stableWeightsCalls.push({
      address: gaugeAddressStable,
      name: 'weights',
      params: [lpAddress],
    });
  }

  const [
    v2Voting,
    stableVoting,
    v2Bribes,
    stableBribes,
    V2Rewards0,
    V2Rewards1,
    StableRewards0,
    StableRewards1,
    stableWeights,
    v2Weights,
  ] = await Promise.all([
    Multicall(v2VotingCalls, 'gaugeproxyV3', CHAIN_ID, 'rpc'),
    Multicall(stableVotingCalls, 'stableproxy', CHAIN_ID, 'rpc'),
    Multicall(v2BribesCalls, 'gaugeproxyV3', CHAIN_ID, 'rpc'),
    Multicall(stableBribesCalls, 'stableproxy', CHAIN_ID, 'rpc'),
    Multicall(v2Rewards0Calls, 'pair', CHAIN_ID, 'rpc'),
    Multicall(v2Rewards1Calls, 'pair', CHAIN_ID, 'rpc'),
    Multicall(stableRewards0Calls, 'pair', CHAIN_ID, 'rpc'),
    Multicall(stableRewards1Calls, 'pair', CHAIN_ID, 'rpc'),
    Multicall(stableWeightsCalls, 'gaugeproxyV3', CHAIN_ID, 'rpc'),
    Multicall(v2WeightsCalls, 'gaugeproxyV3', CHAIN_ID, 'rpc'),
  ]);

  return {
    v2Voting,
    stableVoting,
    v2Bribes,
    stableBribes,
    V2Rewards0,
    V2Rewards1,
    StableRewards0,
    StableRewards1,
    stableWeights,
    v2Weights,
  };
};

const checkRewardsTokens = async (
  bribes: MulticallSingleResponse[],
  index: number = 2,
  rewardsTokens = {},
) => {
  const rewardsCalls: Call[] = [];

  for (let i = 0; i < bribes.length; i++) {
    const bribeAddress: string = bribes[i].response[0];

    rewardsCalls.push({
      address: bribeAddress,
      name: 'rewardTokens',
      params: [index],
    });
  }

  const rewards = await MulticallV2(rewardsCalls, 'bribe', CHAIN_ID, 'rpc');
  if (!rewards.every(value => value === null)) {
    rewardsTokens[index] = rewards;
    return checkRewardsTokens(bribes, ++index, rewardsTokens);
  }
  return rewardsTokens;
};

export const saturateGauges = async (
  gaugesPromise: Promise<any>,
  userAddress,
) => {
  const {
    variableGauges,
    stableGauges,
    variableLps,
    stableLps,
    variableTokens,
    stableTokens,
  } = await gaugesPromise;

  const {
    v2Voting,
    stableVoting,
    v2Bribes,
    stableBribes,
    StableRewards0,
    StableRewards1,
    V2Rewards0,
    V2Rewards1,
    stableWeights,
    v2Weights,
  } = await getUserVotingData(
    userAddress,
    variableGauges,
    stableGauges,
    variableLps,
    stableLps,
  );

  const v2Rewards = await checkRewardsTokens(v2Bribes);
  const stableRewards = await checkRewardsTokens(stableBribes);

  const {
    newArray: bribesV2,
    earns: earnsParamsV2,
    rewardData: rewardDataParamsV2,
    rewardDur: rewardDurParamsV2,
    totalSupplys: totalSupplysParamsV2,
    totalVotes: totalVotesV2,
    totalWeight: totalWeightV2,
  } = getFormattedBribes(
    variableGauges,
    v2Voting,
    v2Bribes,
    V2Rewards0,
    V2Rewards1,
    v2Weights,
    userAddress,
    variableLps,
    v2Rewards,
  );

  const {
    newArray: bribesStable,
    earns: earnsParamsStable,
    rewardData: rewardDataParamsStable,
    rewardDur: rewardDurParamsStable,
    totalSupplys: totalSupplysParamsStable,
    totalVotes: totalVotesStable,
    totalWeight: totalWeightStable,
  } = getFormattedBribes(
    stableGauges,
    stableVoting,
    stableBribes,
    StableRewards0,
    StableRewards1,
    stableWeights,
    userAddress,
    stableLps,
    stableRewards,
  );

  const bribeV2Calls = [
    ...earnsParamsV2,
    ...rewardDataParamsV2,
    ...rewardDurParamsV2,
    ...totalSupplysParamsV2,
  ];

  const bribesV2Size = {
    earns: earnsParamsV2.length,
    rewardData: rewardDataParamsV2.length,
    rewardDur: rewardDurParamsV2.length,
    ts: totalSupplysParamsV2.length,
  };
  const bribeStableCalls = [
    ...earnsParamsStable,
    ...rewardDataParamsStable,
    ...rewardDurParamsStable,
    ...totalSupplysParamsStable,
  ];
  const bribesStableSize = {
    earns: earnsParamsStable.length,
    rewardData: rewardDataParamsStable.length,
    rewardDur: rewardDurParamsStable.length,
    ts: totalSupplysParamsStable.length,
  };
  const [bribeV2Result, bribeStableResult] = await Promise.all([
    Multicall(bribeV2Calls, 'bribe', CHAIN_ID, 'rpc'),
    Multicall(bribeStableCalls, 'bribe', CHAIN_ID, 'rpc'),
  ]);

  const [earnsV2, rewardDataV2, rewardDurV2, totalSupplysV2] =
    getSplitBribesCallsV2(bribesV2Size, bribeV2Result);

  const [earnsStable, rewardDataStable, rewardDurStable, totalSupplysStable] =
    getSplitBribesCallsV2(bribesStableSize, bribeStableResult);

  const bribesRewardsV2Promises = bribesV2.map((bribe, i) => {
    return formatBribes(
      bribe,
      rewardDurV2,
      earnsV2,
      rewardDataV2,
      totalSupplysV2[i].response[0],
    );
  });

  const bribesRewardsStablePromises = bribesStable.map((bribe, i) => {
    return formatBribes(
      bribe,
      rewardDurStable,
      earnsStable,
      rewardDataStable,
      totalSupplysStable[i].response[0],
    );
  });

  const [bribesRewardsV2, bribesRewardsStable, mappedTokens] =
    await Promise.all([
      Promise.all(bribesRewardsV2Promises),
      Promise.all(bribesRewardsStablePromises),
      getMappedTokens('address'),
    ]);

  let boostedV2, boostedStable;
  let totalRewards = 0;
  if (totalSupplysV2.length > 0) {
    let tokenIdx = 0;
    boostedV2 = variableGauges.map((gauge, i) => {
      const lpAddress: string = variableLps[i];
      const farm = formatBoostedFarms(
        gauge,
        v2Voting[i],
        bribesRewardsV2,
        totalVotesV2,
        totalSupplysV2[i].response[0],
        totalWeightV2,
        variableTokens,
        tokenIdx,
        mappedTokens,
        lpAddress,
      );
      const { userRewardsEarnsUSD } = farm?.fulldata;
      const rewardA = new BigNum(userRewardsEarnsUSD[0]);
      const rewardB = new BigNum(userRewardsEarnsUSD[1]);
      const totalFee = rewardA.plus(rewardB).toNumber();
      totalRewards = totalRewards + totalFee;
      tokenIdx += 2;
      return farm;
    });
  }

  if (totalSupplysStable.length > 0) {
    let tokenIdx = 0;
    boostedStable = stableGauges.map((gauge, i) => {
      const lpAddress: string = stableLps[i];

      const farm = formatBoostedFarms(
        gauge,
        stableVoting[i],
        bribesRewardsStable,
        totalVotesStable,
        totalSupplysStable[i].response[0],
        totalWeightStable,
        stableTokens,
        tokenIdx,
        mappedTokens,
        lpAddress,
      );
      const { userRewardsEarnsUSD } = farm?.fulldata;
      const rewardA = new BigNum(userRewardsEarnsUSD[0]);
      const rewardB = new BigNum(userRewardsEarnsUSD[1]);
      const totalFee = rewardA.plus(rewardB).toNumber();
      totalRewards = totalRewards + totalFee;
      tokenIdx += 2;
      return farm;
    });
  }

  return { boostedV2, boostedStable, totalRewards };
};

export const getBoostedFarms = async (
  { userAddress = '' } = {},
  provider: Web3Provider | undefined,
) => {
  if (provider && provider._network.chainId === CHAIN_ID) {
    let gaugeProxy = 'gaugeproxy';
    let gaugeAddress = addresses.gauge[CHAIN_ID];
    const completeBribesRewards: any = [];

    const gaugeContract = await Contract(
      gaugeAddress,
      gaugeProxy,
      undefined,
      undefined,
      provider,
    );
    // get gauge pools
    const tokens = await gaugeContract.tokens();

    // We'll do multicalls for each category
    const gaugesParams: Array<Call> = [];
    const weightParams: Array<Call> = [];
    const erc20Params: Array<Call> = [];
    const votesParams: Array<Call> = [];

    tokens.forEach(farmAddress => {
      gaugesParams.push({
        address: gaugeAddress,
        name: 'gauges',
        params: [farmAddress],
      });

      weightParams.push({
        address: gaugeAddress,
        name: 'weights',
        params: [farmAddress],
      });

      erc20Params.push({
        address: farmAddress,
        name: 'name',
      });
      votesParams.push({
        address: gaugeAddress,
        name: 'votes',
        params: [userAddress, farmAddress],
      });
    });

    // We retrieve all data in 3 calls rather than 90+ like in previous one
    const gaugesMulticall = await Multicall(
      gaugesParams,
      gaugeProxy,
      CHAIN_ID,
      'rpc',
      provider,
    );
    const weightsMulticall = await Multicall(
      weightParams,
      gaugeProxy,
      CHAIN_ID,
      'rpc',
      provider,
    );
    const namesMulticall = await Multicall(
      erc20Params,
      'erc20',
      CHAIN_ID,
      'rpc',
      provider,
    );

    // All data is returned based in the index. We now loop and mix it
    const farms: Array<BoostedFarmData> = tokens.map((farmAddress, i) => {
      const [gauge] = gaugesMulticall[i]?.response;

      const [weight] = weightsMulticall[i]?.response;

      const [name] = namesMulticall[i]?.response;
      const bribeResult = completeBribesRewards.filter(bribe =>
        checkAddress(bribe.farmAddress, farmAddress),
      );

      const bothRewardsFor10K = new BigNum(bribeResult[0]?.rewardsUSD[0])
        .plus(bribeResult[0]?.rewardsUSD[1])
        .toString();
      const bothFeeRewards = new BigNum(bribeResult[0]?.userRewardsEarnsUSD[0])
        .plus(bribeResult[0]?.userRewardsEarnsUSD[1])
        .toString();

      const base = {
        name,
        address: gauge,
        tokenAddress: farmAddress,
        weight: ethers.utils.formatEther(weight.toString()),
        logo: '',
        userVotes: '',
        value: '',
        bribes: bothRewardsFor10K === 'NaN' ? '0' : `${bothRewardsFor10K}`,
        feeEarns: bothFeeRewards === 'NaN' ? '0' : `${bothFeeRewards}`,
      };
      let gaugeSelection = gauges;

      const [farmData] = gaugeSelection.filter(
        farm => farm.gaugeAddress === base.address,
      );

      if (farmData) {
        return { ...base, ...farmData };
      }

      return { ...base, ...EMPY_FARM };
    });

    return farms;
  }
  return [];
};

export const getBoostedFarmVotes = async ({
  userAddress,
  version = 1,
  provider = null,
}) => {
  if (!userAddress) {
    return [];
  }

  let gaugesSelected = gauges;
  let gaugeProxy = 'gaugeproxy';
  let gaugeAddress = addresses.gauge[CHAIN_ID];

  const gaugeContract = await Contract(
    gaugeAddress,
    gaugeProxy,
    undefined,
    undefined,
    provider,
  );

  // get gauge pools
  const tokens = await gaugeContract.tokens();

  // We'll do multicalls for each category
  const gaugesParams: Array<Call> = [];
  const votesParams: Array<Call> = [];

  tokens.forEach(farmAddress => {
    gaugesParams.push({
      address: gaugeAddress,
      name: 'gauges',
      params: [farmAddress],
    });
    votesParams.push({
      address: gaugeAddress,
      name: 'votes',
      params: [userAddress, farmAddress],
    });
  });

  // We retrieve all data in 2 calls rather than 60+ like in previous one
  const gaugesMulticall = await Multicall(
    gaugesParams,
    gaugeProxy,
    undefined,
    undefined,
    provider,
  );
  const votesMulticall = await Multicall(
    votesParams,
    gaugeProxy,
    undefined,
    undefined,
    provider,
  );

  let totalUserVote = 0;

  let votes: Array<BoostedFarmVoteData> = [];

  for (let i = 0; i < tokens.length; i++) {
    const farmAddress = tokens[i];
    const [gauge] = gaugesMulticall[i]?.response;
    const [userVotes] = votesMulticall[i]?.response;

    totalUserVote += parseFloat(ethers.utils.formatEther(userVotes).toString());

    const base = {
      address: gauge,
      tokenAddress: farmAddress,
      userVotes: ethers.utils.formatEther(userVotes).toString(),
      value: '',
    };

    let farmData;
    for (let i = 0; i < gaugesSelected.length; i++) {
      const farm = gaugesSelected[i];
      if (checkAddress(farm.gaugeAddress, base.address)) farmData = farm;
    }

    if (farmData) {
      votes.push({ ...base, ...farmData });
    } else {
      votes.push({ ...base, ...EMPY_FARM });
    }
  }

  // All data is returned based in the index. We now loop and mix it
  if (totalUserVote > 0) {
    for (let i = 0; i < votes.length; i++) {
      const vote = votes[i];
      vote.value = ((parseFloat(vote.userVotes) * 100) / totalUserVote)
        .toFixed(0)
        .toString();
    }
  }

  return votes;
};

export const getInspiritEstimate = (
  _inspiritAmount: string,
  _lockEnd: { value: DurationInputArg1; scale: DurationInputArg2 },
  _lockedEndDate: number,
  lockMode: number,
) => {
  let nextDate: moment.Moment = moment(0);
  const { value, scale } = _lockEnd || { value: 0, scale: '' };

  if (lockMode === 0 && !_lockEnd) {
    nextDate = moment.unix(_lockedEndDate);
  } else if (_lockedEndDate && value === 4 && scale === 'years') {
    nextDate = moment.unix(moment().unix()).add(value, scale);
  } else if (_lockedEndDate !== 0) {
    nextDate = moment.unix(_lockedEndDate).add(value, scale);
  } else {
    nextDate = moment.unix(moment().unix()).add(value, scale);
  }

  if (!nextDate && !_lockedEndDate) {
    return {
      date: undefined,
      amount: '0',
    };
  }

  const getEpochSecondForDay = (date: moment.Moment) => {
    const newDate = date.unix();
    return (newDate / ONE_DAY) * ONE_DAY;
  };

  let date_to_unlock = getDaysUntilFriday(nextDate.utc());

  if (date_to_unlock.unix() > moment().add(4, 'years').unix()) {
    date_to_unlock.subtract(1, 'weeks');
  }

  const rounded = (getEpochSecondForDay(nextDate) / ONE_WEEK) * ONE_WEEK;

  const estimateAmount =
    ((rounded - moment().unix()) / FOUR_YEARS) * Number(_inspiritAmount);

  return {
    date: date_to_unlock.startOf('day'),
    amount: estimateAmount.toString(),
  };
};

export const isPossibleToVote = (timestamp: number): boolean => {
  const todayIs = moment().unix();
  const voteDay = moment(0);
  const voteDayTime = voteDay.add(timestamp, 'seconds');
  const checkTimeSeconds = voteDayTime.add(1, 'weeks');

  return todayIs > checkTimeSeconds.unix();
};

export const calcTimeUntilNextBlock = (date: number) => {
  const todayUSA = moment().utc();
  const dateNextBlock = moment.unix(date);
  const diffTime = dateNextBlock.diff(todayUSA);
  const duration = moment.duration(diffTime);

  const days = Math.abs(duration.days());
  const hours = Math.abs(duration.hours());
  const minutes = Math.abs(duration.minutes());
  const seconds = Math.abs(duration.seconds());

  return {
    days,
    hours,
    minutes,
    seconds,
    completed: seconds <= 0,
  };
};

export const canUnlockInspirit = (unlockDate: number): boolean => {
  const today = moment().unix();
  return unlockDate < today;
};

export const getRewardTokensByBribe = async ({ bribeContract }) => {
  try {
    const rewardA = bribeContract.rewardTokens(0);
    const rewardB = bribeContract.rewardTokens(1);

    const rewardsResult = await Promise.all([rewardA, rewardB]);

    return rewardsResult;
  } catch (error) {
    return [];
  }
};

export const getMaxTime = (lockedInSpiritEndDate: number) => {
  const newMaxDate = moment().add(4, 'years');
  return newMaxDate.diff(moment.unix(lockedInSpiritEndDate), 'days');
};

export const getBribeLeftOver = async ({
  bribeContract,
  rewardToken,
}): Promise<string> => {
  try {
    const leftBigNumber = await bribeContract.left(rewardToken);
    const value: string = leftBigNumber.toString();
    return value;
  } catch (error) {
    return '0';
  }
};

export const getBribeTokenRewardsPer10k = async (
  rewards,
  totalSupply,
  tokenAddress,
  tokenPrice,
  isFee = false,
) => {
  const tokenDecimals = tokens.find(token =>
    checkAddress(token.address, tokenAddress),
  )?.decimals;

  const amountRewards = new BigNum(rewards.toString());
  const total = formatUnits(totalSupply.toString(), 18);

  if (amountRewards.isZero()) return '0';
  if (totalSupply.isZero()) return '0';
  if (isFee) {
    const feeResult = amountRewards
      .dividedBy(10 ** (tokenDecimals || 18))
      .multipliedBy(tokenPrice)
      .toString();

    return feeResult;
  }
  const result = amountRewards
    .dividedBy(10 ** (tokenDecimals || 18))
    .multipliedBy('10000')
    .dividedBy(total)
    .multipliedBy(tokenPrice)
    .toString();

  return result;
};

export const getBribesTotalSupply = async bribeAddress => {
  const bribeContract = await getBribeContract(bribeAddress);
  const totalSupply = await bribeContract.totalSupply();
  return totalSupply;
};
