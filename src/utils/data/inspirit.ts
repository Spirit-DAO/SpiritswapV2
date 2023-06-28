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
  DEFAULT_GAS_LIMIT,
  MultiCallArray,
} from 'utils/web3';
import { getTokensDetails } from './covalent';
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
    percentajeChange24: spirit?.percentaje_change_24 || 0,
  };
  const ftmInfo = {
    price: ftm ? (ftm.rate ? ftm.rate : 0) : 0,
    percentajeChange24: ftm?.percentaje_change_24 || 0,
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

  try {
    const multicall = await Multicall(balanceParams, 'inspirit');
    const userLocked = multicall[0]
      ? formatUnits(multicall[0]?.response[0], 18)
      : '0.0';
    const userLockEndDate = multicall[0] ? multicall[0]?.response[1] : 0;
    const userBalance = multicall[1]
      ? formatUnits(multicall[1]?.response[0], 18)
      : '0.0';

    const feeDistributorAddress = addresses.feedistributor[CHAIN_ID];

    const feeDisributorContract = await Contract(
      feeDistributorAddress,
      'feedistributor',
    );

    const userClaim = await feeDisributorContract.callStatic['claim(address)'](
      userAddress,
      {
        gasLimit: DEFAULT_GAS_LIMIT * 2,
      },
    );

    const userClaimableAmount = formatUnits(userClaim, 18);

    return {
      userLocked,
      userBalance,
      userClaimableAmount,
      userLockEndDate,
    };
  } catch (error) {
    console.error(error);
  }

  return {
    userLocked: '0.0',
    userBalance: '0.0',
    userClaimableAmount: '0.0',
    userLockEndDate: 0,
  };
};

export const getUserVotingData = async (
  userAddress,
  variableGauges,
  stableGauges,
  variableLps,
  stableLps,
  combineGauges,
  combieneLps,
) => {
  const gaugeAddressVariable = addresses.variableProxy[CHAIN_ID];
  const gaugeAddressStable = addresses.stableProxy[CHAIN_ID];
  const gaugeAddressCombine = addresses.combineProxy[CHAIN_ID];

  const variableVotingCalls: Call[] = [];
  const variableBribesCalls: Call[] = [];
  const variableRewards0Calls: Call[] = [];
  const variableRewards1Calls: Call[] = [];
  const variableWeightsCalls: Call[] = [];

  const stableVotingCalls: Call[] = [];
  const stableBribesCalls: Call[] = [];
  const stableRewards0Calls: Call[] = [];
  const stableRewards1Calls: Call[] = [];
  const stableWeightsCalls: Call[] = [];

  const combineVotingCalls: Call[] = [];
  const combineBribesCalls: Call[] = [];
  const combineRewards0Calls: Call[] = [];
  const combineRewards1Calls: Call[] = [];
  const combineWeightsCalls: Call[] = [];

  for (let i = 0; i < variableGauges.length; i++) {
    const gauge = variableGauges[i];
    const lpAddress = variableLps[i];

    variableVotingCalls.push({
      address: gaugeAddressVariable,
      name: 'votes',
      params: [userAddress, lpAddress],
    });
    variableBribesCalls.push({
      address: gaugeAddressVariable,
      name: 'bribes',
      params: [gauge],
    });
    variableRewards0Calls.push({
      address: lpAddress,
      name: 'token0',
      params: [],
    });
    variableRewards1Calls.push({
      address: lpAddress,
      name: 'token1',
      params: [],
    });
    variableWeightsCalls.push({
      address: gaugeAddressVariable,
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
  for (let i = 0; i < combineGauges.length; i++) {
    const gauge = combineGauges[i];
    const lpAddress = combieneLps[i];

    combineVotingCalls.push({
      address: gaugeAddressCombine,
      name: 'votes',
      params: [userAddress, lpAddress],
    });
    combineBribesCalls.push({
      address: gaugeAddressCombine,
      name: 'bribes',
      params: [gauge],
    });
    combineRewards0Calls.push({
      address: lpAddress,
      name: 'token0',
      params: [],
    });
    combineRewards1Calls.push({
      address: lpAddress,
      name: 'token1',
      params: [],
    });
    combineWeightsCalls.push({
      address: gaugeAddressCombine,
      name: 'weights',
      params: [lpAddress],
    });
  }

  const [
    variableVoting,
    stableVoting,
    combineVoting,
    variableBribes,
    stableBribes,
    combineBribes,
    variableRewards0,
    variableRewards1,
    StableRewards0,
    StableRewards1,
    combineRewards0,
    combineRewards1,
    stableWeights,
    variableWeights,
    combineWeights,
  ] = await MultiCallArray(
    [
      variableVotingCalls,
      stableVotingCalls,
      combineVotingCalls,
      variableBribesCalls,
      stableBribesCalls,
      combineBribesCalls,
      variableRewards0Calls,
      variableRewards1Calls,
      stableRewards0Calls,
      stableRewards1Calls,
      combineRewards0Calls,
      combineRewards1Calls,
      stableWeightsCalls,
      variableWeightsCalls,
      combineWeightsCalls,
    ],
    [
      'gaugeproxyV3',
      'stableproxy',
      'gaugeproxyV3',
      'gaugeproxyV3',
      'stableproxy',
      'gaugeproxyV3',
      'pair',
      'pair',
      'pair',
      'pair',
      'pair',
      'pair',
      'gaugeproxyV3',
      'gaugeproxyV3',
      'gaugeproxyV3',
    ],
    CHAIN_ID,
    'rpc',
  );

  return {
    variableVoting,
    stableVoting,
    combineVoting,

    variableBribes,
    stableBribes,
    combineBribes,

    variableRewards0,
    variableRewards1,
    StableRewards0,
    StableRewards1,
    combineRewards0,
    combineRewards1,

    stableWeights,
    variableWeights,
    combineWeights,
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
    combineGauges,
    variableLps,
    stableLps,
    combineLps,
    variableTokens,
    stableTokens,
    combineTokens,
  } = await gaugesPromise;

  const {
    variableVoting,
    stableVoting,
    combineVoting,

    variableBribes,
    stableBribes,
    combineBribes,

    StableRewards0,
    StableRewards1,
    variableRewards0,
    variableRewards1,
    combineRewards0,
    combineRewards1,

    stableWeights,
    variableWeights,
    combineWeights,
  } = await getUserVotingData(
    userAddress,
    variableGauges,
    stableGauges,
    variableLps,
    stableLps,
    combineGauges,
    combineLps,
  );

  const [variableRewards, stableRewards, combineRewards] = await Promise.all([
    checkRewardsTokens(variableBribes),
    checkRewardsTokens(stableBribes),
    checkRewardsTokens(combineBribes),
  ]);

  const {
    newArray: bribesVariable,
    earns: earnsParamsVariable,
    rewardData: rewardDataParamsVariable,
    rewardDur: rewardDurParamsVariable,
    totalSupplys: totalSupplysParamsVariable,
    totalVotes: totalVotesVariable,
    totalWeight: totalWeightVariable,
  } = getFormattedBribes(
    variableGauges,
    variableVoting,
    variableBribes,
    variableRewards0,
    variableRewards1,
    variableWeights,
    userAddress,
    variableLps,
    variableRewards,
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

  const {
    newArray: bribesCombine,
    earns: earnsParamsCombine,
    rewardData: rewardDataParamsCombine,
    rewardDur: rewardDurParamsCombine,
    totalSupplys: totalSupplysParamsCombine,
    totalVotes: totalVotesCombine,
    totalWeight: totalWeightCombine,
  } = getFormattedBribes(
    combineGauges,
    combineVoting,
    combineBribes,
    combineRewards0,
    combineRewards1,
    combineWeights,
    userAddress,
    combineLps,
    combineRewards,
  );

  const bribeVariableCalls = [
    ...earnsParamsVariable,
    ...rewardDataParamsVariable,
    ...rewardDurParamsVariable,
    ...totalSupplysParamsVariable,
  ];

  const bribesVariableSize = {
    earns: earnsParamsVariable.length,
    rewardData: rewardDataParamsVariable.length,
    rewardDur: rewardDurParamsVariable.length,
    ts: totalSupplysParamsVariable.length,
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

  const bribeCombineCalls = [
    ...earnsParamsCombine,
    ...rewardDataParamsCombine,
    ...rewardDurParamsCombine,
    ...totalSupplysParamsCombine,
  ];

  const bribesCombineSize = {
    earns: earnsParamsCombine.length,
    rewardData: rewardDataParamsCombine.length,
    rewardDur: rewardDurParamsCombine.length,
    ts: totalSupplysParamsCombine.length,
  };

  const [bribeVariableResult, bribeStableResult, bribeCombineResult] =
    await MultiCallArray(
      [bribeVariableCalls, bribeStableCalls, bribeCombineCalls],
      ['bribe', 'bribe', 'bribe'],
      CHAIN_ID,
      'rpc',
    );

  const [
    earnsVariable,
    rewardDataVariable,
    rewardDurVariable,
    totalSupplysVariable,
  ] = getSplitBribesCallsV2(bribesVariableSize, bribeVariableResult);

  const [earnsStable, rewardDataStable, rewardDurStable, totalSupplysStable] =
    getSplitBribesCallsV2(bribesStableSize, bribeStableResult);

  const [
    earnsCombine,
    rewardDataCombine,
    rewardDurCombine,
    totalSupplysCombine,
  ] = getSplitBribesCallsV2(bribesCombineSize, bribeCombineResult);

  const bribesRewardsV2Promises = bribesVariable.map((bribe, i) => {
    return formatBribes(
      bribe,
      rewardDurVariable,
      earnsVariable,
      rewardDataVariable,
      totalSupplysVariable[i].response[0],
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

  const bribesRewardsCombinePromises = bribesCombine.map((bribe, i) => {
    return formatBribes(
      bribe,
      rewardDurCombine,
      earnsCombine,
      rewardDataCombine,
      totalSupplysCombine[i].response[0],
    );
  });

  const [
    bribesRewardsVariable,
    bribesRewardsStable,
    bribesRewardsCombine,
    mappedTokens,
  ] = await Promise.all([
    Promise.all(bribesRewardsV2Promises),
    Promise.all(bribesRewardsStablePromises),
    Promise.all(bribesRewardsCombinePromises),
    getMappedTokens('address'),
  ]);

  let boostedVariable, boostedStable, boostedCombine;
  let totalRewards = 0;

  if (totalSupplysVariable.length > 0) {
    let tokenIdx = 0;
    boostedVariable = variableGauges.map((gauge, i) => {
      const lpAddress: string = variableLps[i];
      const farm = formatBoostedFarms(
        gauge,
        variableVoting[i],
        bribesRewardsVariable,
        totalVotesVariable,
        totalSupplysVariable[i].response[0],
        totalWeightVariable,
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

  if (totalSupplysCombine.length > 0) {
    let tokenIdx = 0;
    boostedCombine = combineGauges.map((gauge, i) => {
      const lpAddress: string = combineLps[i];

      const farm = formatBoostedFarms(
        gauge,
        combineVoting[i],
        bribesRewardsCombine,
        totalVotesCombine,
        totalSupplysCombine[i].response[0],
        totalWeightCombine,
        combineTokens,
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

  return { boostedCombine, boostedStable, boostedVariable, totalRewards };
};

export const getBoostedFarms = async (
  { userAddress = '' } = {},
  provider: Web3Provider | undefined,
) => {
  if (provider && provider._network.chainId === CHAIN_ID) {
    let gaugeAddress = addresses.gauge[CHAIN_ID];
    const completeBribesRewards: any = [];

    const gaugeContract = await Contract(
      gaugeAddress,
      'gaugeproxy',
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

    const [gaugesMulticall, weightsMulticall, namesMulticall] =
      await MultiCallArray(
        [gaugesParams, weightParams, erc20Params],
        ['gaugeproxy', 'gaugeproxy', 'gaugeproxy'],
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

  const [gaugesMulticall, votesMulticall] = await MultiCallArray(
    [gaugesParams, votesParams],
    [gaugeProxy, gaugeProxy],
    CHAIN_ID,
    'rpc',
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
