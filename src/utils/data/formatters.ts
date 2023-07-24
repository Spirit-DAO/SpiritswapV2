import { Call, MulticallSingleResponse } from 'utils/web3';
import { formatFrom } from 'utils/web3';
import {
  tokenData,
  CovalentBalanceItem,
  balanceReturnData,
  BribesProps,
} from './types';
import uniqBy from 'lodash/uniqBy';
import {
  BASE_TOKEN_ADDRESS,
  COVALENT_BASE_TOKEN_ADDRESS,
  newTokensAddressesArray,
  tokens,
} from 'constants/index';
import { checkAddress, checkInvalidValue } from 'app/utils';
import { GaugeFarm } from 'app/interfaces/Farm';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { formatVotes } from 'app/pages/Inspirit/components/Voting/utils/format';
import { getBribeTokenRewardsPer10k } from './inspirit';
import { getTokenUsdPrice } from './covalent';

/**
 * Returns formatting for amount that has increased or decreased
 */
export const formatAmountChange = (_amount: number, _symbol = ' $') => {
  const validReturn = checkInvalidValue(`${_amount}`);

  const formatted =
    _amount > 0
      ? `+${_symbol}${parseFloat(`${validReturn}`).toFixed(2)}`
      : `-${_symbol}${parseFloat(`${Math.abs(+validReturn)}`).toFixed(2)}`;

  return formatted;
};

/**
 * Returns fiat representation of a number
 */
export const fiat = (_amount: number, _symbol = '$') => {
  if (!_amount) return '$0';
  const fixedAmount = Number(_amount.toFixed(2));
  return `${_symbol}${parseFloat(`${fixedAmount}`).toLocaleString('en-US')}`;
};

export const formatReturnData = (
  item,
  itemType = 'covalent',
  pricingData?: CovalentBalanceItem[],
  isStaked: boolean = false,
) => {
  if (itemType !== 'covalent') {
    let name = (item?.symbol && item.symbol.replace('-', '/')) || '';
    let full_name = `${item.symbol}`;
    let title =
      (item?.symbol && item.symbol.replace(' LP', '').replace('-', ' + ')) ||
      '';
    let tokenItems =
      (item?.symbol &&
        item.symbol
          .replace(' sLP', '')
          .replace(' vLP', '')
          .replace(' LP', '')
          .toUpperCase()
          .split('-')) ||
      [];
    let symbol = item.symbol;

    const oldDei = '0xDE12c7959E1a72bbe8a5f7A1dc8f8EeF9Ab011B3';
    const newDei = '0xDE1E704dae0B4051e80DAbB26ab6ad6c12262DA0';
    if (checkAddress(item.token1, oldDei)) {
      item.token1 = newDei;
    }
    if (item.token0) {
      const token0 = tokens.find(token =>
        checkAddress(token.address, item.token0),
      );
      const token1 = tokens.find(token =>
        checkAddress(token.address, item.token1),
      );

      const baseName = `${token0?.symbol}-${token1?.symbol} ${
        item.symbol && isStaked && item.symbol.includes('VolatileV1 AMM')
          ? 'vLP'
          : 'sLP'
      }`;
      full_name = baseName;
      name = baseName.replace('-', '/');
      title = baseName.replace('-', ' + ');
      tokenItems = [token0?.symbol, token1?.symbol];
      symbol = name;
    } else if (item.symbol && item.symbol.includes('V1 AMM -')) {
      const isStable = item.symbol.includes('Stable');
      const base_name = item.symbol
        .replace('VolatileV1 AMM - ', '')
        .replace('StableV1 AMM - ', '');
      name = `${base_name} ${isStable ? 'sLP' : 'vLP'}`;
      symbol = name;
      tokenItems = base_name.split('/');
      title = `${name.replace('/', ' + ')}`;
      full_name = name.replace('/', '-');
    }

    const tdata: tokenData = {
      name,
      title,
      tokens: tokenItems,
      full_name,
      amount: `${item.balance}`,
      symbol,
      address: `${item?.address}`,
      liquidity: true,
      staked: true,
      rate: item.quote_rate ?? 0,
      rate_24: 0,
      usd: item.quote_rate ? item.quote_rate * parseFloat(item.balance) : 0,
      usd_24: 0,
      originalItem: item,
      isRouterV2: item.v2,
    };

    if (pricingData && pricingData.length && !item.quote_rate) {
      pricingData.forEach(data => {
        if (
          `${data.contract_address}`.toLowerCase() ===
          `${tdata.address}`.toLowerCase()
        ) {
          tdata.rate = data.quote_rate;
          tdata.rate_24 = data.quote_rate_24h || 0;
          tdata.usd = data.quote || 0;
          tdata.usd_24 = data.quote_24h || 0;
        }
      });
    }
    return tdata;
  }

  const { contract_name, contract_ticker_symbol, contract_address } =
    item || {};
  let contractAddress = contract_address;

  // Covalent returns FTM with the contract address of WFTM, here we change that address to chain asset address
  // TODO: Might need to create special conditions for each chain if we want to use this exception for other chains
  if (
    item?.contract_ticker_symbol === 'FTM' &&
    `${contract_address}`.toLowerCase() ===
      COVALENT_BASE_TOKEN_ADDRESS.toLowerCase()
  ) {
    contractAddress = BASE_TOKEN_ADDRESS;
    item.contract_address = contractAddress;
  }

  const symbol = () => {
    if (newTokensAddressesArray.includes(contractAddress.toLowerCase())) {
      return tokens.find(
        token => token.address.toLowerCase() === contractAddress.toLowerCase(),
      )?.symbol;
    }

    return contract_ticker_symbol
      ? contract_ticker_symbol.replace('vAMM-', '')
      : '';
  };

  const title = contract_ticker_symbol
    ? `${contract_ticker_symbol
        .replace('-', '/')
        .replace('vAMM/', '')
        .replace('sAMM/', '')}`
    : '';

  const tdata: tokenData = {
    name: symbol(),
    full_name: contract_name,
    title,
    tokens:
      (contract_name &&
        title
          .replace(' sLP', '')
          .replace(' vLP', '')
          .replace(' LP', '')
          .split('/')) ||
      [],
    amount: formatFrom(item?.balance || 0, item?.contract_decimals),
    symbol: symbol(),
    usd: item?.quote?.toFixed(2) || 0,
    usd_24: item?.quote_24h?.toFixed(2) || 0,
    rate: item?.quote_rate,
    rate_24: item?.quote_rate_24h,
    address: contractAddress,
    liquidity: contract_name ? contract_name.includes('V1 AMM') : false,
    staked: true,
    originalItem: item,
    isRouterV2: contract_name && contract_name.includes('AMM'),
  };

  return tdata;
};

export const getTokenGroupStatistics = (
  _dataArray: MulticallSingleResponse[] | CovalentBalanceItem[],
  _dataType: 'tokenList' | 'farmList' | 'stakeList',
  _pricingData?: CovalentBalanceItem[],
  _whitelist = {},
) => {
  // Represents our valid tokens list
  const validTokens: tokenData[] = [];

  // This section determines if all of the _dataArray is formated
  const whitelistExists = Object.keys(_whitelist).length > 0;

  let tokenCurrentTotal = 0;
  let token24Total = 0;

  for (let x = 0; x < _dataArray.length; x += 1) {
    const item: MulticallSingleResponse | CovalentBalanceItem = _dataArray[x];
    // Determines if data should be added to valid token array
    // False by default. Ruls below indicate if it turns to true
    let addToData = false;
    // Verifies if record has balance and value of tokens is greater than zero
    // necessary for covalent data
    const hasValidBalance =
      item?.balance &&
      ((item?.quote && item.quote > 0) ||
        (item.quote_rate && item.quote_rate > 0));

    // Our token data
    const returnType = ['tokenList'].includes(_dataType)
      ? 'covalent'
      : 'native';

    // We add additional pricing data here if it exists
    const preFormat = item;

    const tdata = formatReturnData(
      preFormat,
      returnType,
      _pricingData,
      _dataType === 'stakeList',
    );

    if (!tdata) continue;

    // Handle of data coming directly from covalent
    // It defines rates if provided the variable that contains it
    if (
      ['tokenList'].includes(_dataType) &&
      hasValidBalance &&
      !tdata.liquidity
    ) {
      if (
        whitelistExists &&
        _whitelist[`${tdata.address}`.toLocaleLowerCase()]
      ) {
        addToData = true;
      } else if (!whitelistExists) {
        addToData = true;
        // We always want to add FTM
      } else if (tdata.symbol === 'FTM') {
        addToData = true;
      }

      if (addToData) {
        tokenCurrentTotal += item.quote || 0;
        token24Total += item.quote_24h || 0;
        validTokens.push(tdata);
      }
    }

    if (
      tdata.liquidity &&
      item.balance &&
      item.balance !== '0' &&
      item.balance !== '0.0'
    ) {
      tdata.staked = _dataType === 'stakeList';

      addToData = true;

      if (addToData) {
        tokenCurrentTotal += tdata.usd ? parseFloat(`${tdata.usd}`) : 0;
        token24Total += tdata.usd_24 ? parseFloat(`${tdata.usd_24}`) : 0;
        validTokens.push(tdata);
      }
    }
  }

  const tokenDifference = token24Total ? tokenCurrentTotal - token24Total : 0;

  // For some reason, we need to stringgivy and parse the validTokensList to
  // make sure correct data is passed
  const copy = JSON.parse(JSON.stringify(validTokens));
  let results: tokenData[] = [];

  if (_dataType === 'tokenList') {
    results = copy.filter(token => !token.liquidity);
  } else {
    results = copy;
  }

  const uniqFilteredArray = uniqBy(results, 'address');

  const summary: balanceReturnData = {
    [_dataType]: _dataType === 'farmList' ? results : uniqFilteredArray,
    totalValue: fiat(tokenCurrentTotal, '$'),
    total24Value: fiat(token24Total, '$'),
    totalValueNumber: tokenCurrentTotal,
    total24ValueNumber: token24Total,
    diffAmount: formatAmountChange(tokenDifference, ' $'),
    diffPercent: tokenDifference
      ? formatAmountChange((tokenDifference / token24Total) * 100, '')
      : '0',
    diffAmountValue: tokenDifference,
    diffPercentValue: tokenDifference ? tokenDifference / token24Total : 0,
  };

  return summary;
};

export const formatFarmsCalls = ({ arrays, gauges }) => {
  const { tokens, tokensV2, tokensStable } = arrays;
  const { gaugeAddress, gaugeAddressV2, gaugeAddressStable } = gauges;
  const gaugesParamsV1: Array<Call> = [];
  const gaugesParamsV2: Array<Call> = [];
  const gaugesParamsStable: Array<Call> = [];
  const weightParamsV1: Array<Call> = [];
  const weightParamsV2: Array<Call> = [];
  const weightParamsStable: Array<Call> = [];

  for (let i = 0; i < tokens.length; i++) {
    const lpAddressV1 = tokens[i];
    const lpAddressV2 = tokensV2[i];
    const lpAddressStable = tokensStable[i];
    if (lpAddressV1) {
      gaugesParamsV1.push({
        address: gaugeAddress,
        name: 'gauges',
        params: [lpAddressV1],
      });
      weightParamsV1.push({
        address: gaugeAddress,
        name: 'weights',
        params: [lpAddressV1],
      });
    }
    if (lpAddressV2) {
      gaugesParamsV2.push({
        address: gaugeAddressV2,
        name: 'gauges',
        params: [lpAddressV2],
      });
      weightParamsV2.push({
        address: gaugeAddressV2,
        name: 'weights',
        params: [lpAddressV2],
      });
    }
    if (lpAddressStable) {
      gaugesParamsStable.push({
        address: gaugeAddressStable,
        name: 'gauges',
        params: [lpAddressStable],
      });
      weightParamsStable.push({
        address: gaugeAddressStable,
        name: 'weights',
        params: [lpAddressStable],
      });
    }
  }

  return [
    gaugesParamsV1,
    gaugesParamsV2,
    gaugesParamsStable,
    weightParamsV1,
    weightParamsV2,
    weightParamsStable,
  ];
};

export const getSplitCalls = ({
  tokens,
  v1GaugesResults,
  v1WeightResults,
  tokensV2,
  v2GaugesResults,
  v2WeightResults,
  tokensStable,
  stableGaugesResults,
  stableWeightResults,
}) => {
  const v1Gauges = tokens.map((token, i) => {
    const gaugeFarm: GaugeFarm = {
      address: token,
      weight: v1WeightResults[i].response[0].toString(),
      gaugeAddress: v1GaugesResults[i].response[0],
    };
    return gaugeFarm;
  });

  const v2Gauges = tokensV2.map((token, i) => {
    const gaugeFarm: GaugeFarm = {
      address: token,
      weight: v2WeightResults[i].response[0].toString(),
      gaugeAddress: v2GaugesResults[i].response[0],
    };
    return gaugeFarm;
  });

  const stableGauges = tokensStable.map((token, i) => {
    const gaugeFarm: GaugeFarm = {
      address: token,
      weight: stableWeightResults[i].response[0].toString(),
      gaugeAddress: stableGaugesResults[i].response[0],
    };
    return gaugeFarm;
  });

  return {
    v1Gauges,
    v2Gauges,
    stableGauges,
  };
};

export const formatBribes = async (
  bribe: BribesProps,
  rewardDur: MulticallSingleResponse[],
  earns: MulticallSingleResponse[],
  rewardData: MulticallSingleResponse[],
  totalSupply,
) => {
  const rewards: any[] = [];
  const rewardsUSD: string[] = [];
  const userRewardsEarnsUSD: string[] = [];
  await Promise.all(
    bribe.rewardsTokens.map(async rewardToken => {
      const bribeRewardDur = rewardDur.shift();
      const bribeEarns = earns.shift();
      const bribeRewardData = rewardData.shift();

      const periodFinish = new BigNumber(
        bribeRewardData?.response.periodFinish.toString(),
      );

      const lastUpdate = new BigNumber(
        bribeRewardData?.response.lastUpdateTime.toString(),
      );

      let rewardPer10k = '0';
      let rewardFees = '0';

      const tokenPrice = await getTokenUsdPrice(rewardToken);

      if (periodFinish.isGreaterThan(lastUpdate)) {
        rewardPer10k = await getBribeTokenRewardsPer10k(
          bribeRewardDur?.response[0],
          totalSupply,
          rewardToken,
          tokenPrice,
        );
      }
      rewardFees = await getBribeTokenRewardsPer10k(
        bribeEarns?.response[0],
        totalSupply,
        rewardToken,
        tokenPrice,
        true,
      );

      rewards.push(bribeRewardDur?.response[0]);
      rewardsUSD.push(rewardPer10k);
      userRewardsEarnsUSD.push(rewardFees);
    }),
  );

  return {
    ...bribe,
    rewards,
    rewardsUSD,
    userRewardsEarnsUSD,
  };
};

export const formatBoostedFarms = (
  gauge,
  votes,
  bribeRewards,
  totalVotes,
  totalSupply,
  totalWeight,
  tokens,
  tokenIdx,
  mappedTokens,
  lpAddress,
) => {
  const findeBribe = bribeRewards.find(bribe =>
    checkAddress(bribe.farmAddress, lpAddress),
  );
  const getValue = () => {
    if (totalVotes > 0) {
      const vote = Number(
        ethers.utils.formatEther(votes.response[0]).toString(),
      );
      const value = ((vote / totalVotes) * 100).toFixed(0);

      return value;
    }
    return '0';
  };

  const parsedTS = Number(ethers.utils.formatEther(totalSupply).toString());

  const percent = ((parsedTS / totalWeight) * 100).toFixed(2);

  const votesTotal = `${formatVotes(parsedTS)}`;

  const getName = () => {
    const token1Address = tokens[tokenIdx].toLowerCase();
    const token2Address = tokens[tokenIdx + 1].toLowerCase();
    const token1 = mappedTokens[token1Address];
    const token2 = mappedTokens[token2Address];

    if (token1 && token2) {
      return `${token1.symbol} ${token2.symbol}`;
    }

    return '';
  };

  const base = {
    weight: parsedTS,
    logo: '',
    userVotes: percent === 'NaN' ? '0.0' : percent,
    totalVotesOnFarm: votesTotal,
    value: getValue(),
    name: getName(),
  };
  if (findeBribe) {
    let allFeeRewards: string = '0';
    let allRewardsFor10K: string = '0';
    findeBribe.rewardsUSD.forEach((usdValue, i) => {
      // usdValue === "NaN"
      const earnsUSD: string = findeBribe.userRewardsEarnsUSD[i];
      allRewardsFor10K = new BigNumber(usdValue)
        .plus(allRewardsFor10K)
        .toString();
      allFeeRewards = new BigNumber(earnsUSD).plus(allFeeRewards).toString();
    });

    const bribe_base = {
      bribes: allRewardsFor10K === 'isNaN' ? '0' : `${allRewardsFor10K}`,
      feeEarns: allFeeRewards === 'isNaN' ? '0' : `${allFeeRewards}`,
      fulldata: findeBribe,
    };

    return { ...base, ...bribe_base };
  }
};

export const getSplitBribesCallsV2 = (
  sizes: {
    earns: number;
    rewardData: number;
    rewardDur: number;
    ts: number;
  },
  callResults: MulticallSingleResponse[],
) => {
  const earns: MulticallSingleResponse[] = callResults.splice(0, sizes.earns);
  const rewardData: MulticallSingleResponse[] = callResults.splice(
    0,
    sizes.rewardData,
  );
  const rewardDur: MulticallSingleResponse[] = callResults.splice(
    0,
    sizes.rewardDur,
  );
  const totalSupplys: MulticallSingleResponse[] = callResults.splice(
    0,
    sizes.ts,
  );

  return [earns, rewardData, rewardDur, totalSupplys];
};

export const getFormattedBribes = (
  gauges,
  voting,
  bribes,
  reward0,
  reward1,
  weights,
  userAddress,
  lpAddress,
  othersRewards,
) => {
  const newArray: BribesProps[] = [];
  const rewardDur: Call[] = [];
  const rewardData: Call[] = [];
  const earns: Call[] = [];
  const totalSupplys: Call[] = [];
  let totalVotes = 0;
  let totalWeight = 0;

  gauges.forEach((gauge, i) => {
    const bribeAddress: string = bribes[i].response[0];

    const bribeRewards: string[] = [
      reward0[i].response[0],
      reward1[i].response[0],
    ];

    if (Object.entries(othersRewards).length) {
      if (othersRewards[2] && othersRewards[2][i] !== null) {
        bribeRewards.push(othersRewards[2][i]);
      }
      if (othersRewards[3] && othersRewards[3][i] !== null) {
        bribeRewards.push(othersRewards[3][i]);
      }
      if (othersRewards[4] && othersRewards[4][i] !== null) {
        bribeRewards.push(othersRewards[4][i]);
      }
    }

    const bribeVotesFormatted = new BigNumber(
      voting[i].response.toString(),
    ).toString();
    const vote = voting[i].response[0];

    totalVotes += parseFloat(ethers.utils.formatEther(vote).toString());

    totalWeight += Number(
      ethers.utils.formatEther(weights[i].response[0]).toString(),
    );
    totalSupplys.push({
      address: bribeAddress,
      name: 'totalSupply',
      params: [],
    });

    bribeRewards.forEach(reward => {
      rewardDur.push({
        address: bribeAddress,
        name: 'getRewardForDuration',
        params: [reward],
      });
      rewardData.push({
        address: bribeAddress,
        name: 'rewardData',
        params: [reward],
      });
      earns.push({
        address: bribeAddress,
        name: 'earned',
        params: [userAddress, reward],
      });
    });
    newArray.push({
      farmAddress: lpAddress[i],
      gaugeAddress: gauge,
      bribeAddress,
      rewardsTokens: bribeRewards,
      bribeVotes: bribeVotesFormatted,
    });
  });

  return {
    newArray,
    rewardDur,
    rewardData,
    earns,
    totalSupplys,
    totalVotes,
    totalWeight,
  };
};

export const getTokenCalls = (tokens: any[]) => {
  const tokenCalls: Call[] = [];

  tokens.forEach(token => {
    tokenCalls.push({
      address: token.response[0],
      name: 'symbol',
      params: [],
    });
  });

  return tokenCalls;
};
