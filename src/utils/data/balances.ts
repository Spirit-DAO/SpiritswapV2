import { CHAIN_ID, BASE_TOKEN_ADDRESS } from 'constants/index';
// import BigNumber from 'bignumber.js';
import allFarms, { farmsV2, unsupportedFarms } from 'constants/farms';
import addresses from 'constants/contracts';
import Contracts from 'constants/contracts';
import { tokens, WFTM } from 'constants/tokens';
import { tokens as bridgeTokens } from 'constants/bridgeTokens';
import {
  Contract,
  formatFrom,
  getNativeTokenBalance,
  getPooledData,
  Multicall,
  MultiCallArray,
  MulticallSingleResponse,
} from 'utils/web3';
import { Call, balanceReturnData, tokenData } from './types';
import safeExecute from 'utils/safeExecute';
import {
  fiat,
  formatAmountChange,
  getTokenGroupStatistics,
} from './formatters';
import { getTokensDetails, getWalletData } from './covalent';
import { formatUnits } from 'ethers/lib/utils';
import { UNIDEX_ETH_ADDRESS } from 'utils/swap';
import { checkInvalidValue } from 'app/utils';

const FARMS = [...allFarms, ...unsupportedFarms];

// Removes first element of the array.
// We do this because the first two farms are technically the same.
FARMS.shift();

// Used to quickly verify if an address matches verified token
export const verifiedTokenData = () => {
  const addressMapping = {};

  tokens.forEach(a => {
    addressMapping[`${a.address}`.toLowerCase()] = a;
  });

  return addressMapping;
};

export const getUserStakedBalance = async (
  _user,
  _v2Pools,
  _provider,
  _network = CHAIN_ID,
) => {
  const balanceCalls: Call[] = _v2Pools?.map(item => ({
    name: 'balanceOf',
    address: item.contract_address,
    params: [_user],
  }));

  const balances = await Multicall(
    balanceCalls,
    'gauge',
    undefined,
    undefined,
    _provider,
  );

  let response: MulticallSingleResponse[] = [];

  const promises = balances?.map(async (balance, index) => {
    const pair = _v2Pools[index];
    const pooldata = await getPooledData(
      pair.contract_address,
      formatFrom(balance.response[0]),
    );

    const token0 = pooldata?.token0;
    const token1 = pooldata?.token1;

    return {
      response: pooldata,
      call: {} as Call,
      balance: formatFrom(balance.response[0]),
      address: pair.contract_address || '',
      token0,
      token1,
      symbol: pair.contract_name || '',
    };
  });

  await Promise.all(promises).then(results => {
    response = results;
  });

  return response;
};

export const getIndividualLpBalance = async (
  _user: string,
  token0: string,
  token1: string,
  stable: boolean,
  getMappedTokens: (by: string) => Promise<any>,
  _provider: any,
  _network = CHAIN_ID,
) => {
  token0 = token0 === BASE_TOKEN_ADDRESS ? WFTM.address : token0;
  token1 = token1 === BASE_TOKEN_ADDRESS ? WFTM.address : token1;

  const routerAddress = addresses.routerV2[_network];

  const routerV2 = await Contract(
    routerAddress,
    'routerV2',
    undefined,
    undefined,
    _provider,
  );

  const lpAddress = await routerV2.pairFor(token0, token1, stable);

  const lp = await Contract(
    lpAddress,
    'pairV2',
    undefined,
    undefined,
    _provider,
  );

  const [balance, mappedTokens] = await Promise.all([
    lp.balanceOf(_user),
    getMappedTokens('address'),
  ]);

  const token0Data = mappedTokens[token0.toLowerCase()];
  const token1Data = mappedTokens[token1.toLowerCase()];

  const name = `${token0Data ? token0Data.symbol : ''}/${
    token1Data ? token1Data.symbol : ''
  } ${stable ? 's' : 'v'}LP`;

  return {
    name,
    fullName: name,
    title: name,
    symbol: name,
    tokens:
      token0Data && token1Data ? [token0Data.symbol, token1Data.symbol] : [],
    address: lpAddress,
    amount: formatFrom(balance),
    usd: '0.00',
    usd_24h: '0.00',
    rate: null,
    rate_24: null,
    liquidity: true,
    staked: true,
    isRouterV2: true,
  };
};

export const getGaugeBalances = async (
  _user,
  _provider,
  _network = CHAIN_ID,
) => {
  const variableGaugeCalls: Call[] = [];
  const stableGaugeCalls: Call[] = [];
  const adminGaugeCalls: Call[] = [];
  const tokenCalls: Call[] = [];

  const variableAddress = Contracts.variableProxy[CHAIN_ID];
  const stableAddress = Contracts.stableProxy[CHAIN_ID];
  const adminAddress = Contracts.adminProxy[CHAIN_ID];

  const callsArray = [variableAddress, stableAddress, adminAddress].map(
    address => ({
      name: 'tokens',
      params: [],
      address,
    }),
  );

  const response = await Multicall(callsArray, 'gaugeproxyV3', _network);

  const variableLps = response[0].response[0];
  const stableLps = response[1].response[0];
  const adminLps = response[2].response[0];

  variableLps.forEach(variableLp => {
    variableGaugeCalls.push({
      address: variableAddress,
      name: 'gauges',
      params: [variableLp],
    });
    tokenCalls.push({
      address: variableLp,
      name: 'token0',
    });
    tokenCalls.push({
      address: variableLp,
      name: 'token1',
    });
  });

  stableLps.forEach(stableLp => {
    stableGaugeCalls.push({
      address: stableAddress,
      name: 'gauges',
      params: [stableLp],
    });
    tokenCalls.push({
      address: stableLp,
      name: 'token0',
    });
    tokenCalls.push({
      address: stableLp,
      name: 'token1',
    });
  });

  adminLps.forEach(adminLp => {
    adminGaugeCalls.push({
      address: adminAddress,
      name: 'gauges',
      params: [adminLp],
    });
    tokenCalls.push({
      address: adminLp,
      name: 'token0',
    });
    tokenCalls.push({
      address: adminLp,
      name: 'token1',
    });
  });

  const [variableGauges, stableGauges, adminGauges, tokens] =
    await MultiCallArray(
      [variableGaugeCalls, stableGaugeCalls, adminGaugeCalls, tokenCalls],
      ['gaugeproxyV3', 'gaugeproxyV3', 'gaugeproxyV3', 'pairV2'],
      undefined,
      undefined,
      _provider,
    );

  const balanceCalls: Call[] = [];

  const unionGauges = [...variableGauges, ...stableGauges, ...adminGauges];
  const unionLps = [...variableLps, ...stableLps, ...adminLps];

  unionGauges.forEach(gauge => {
    balanceCalls.push({
      address: gauge.response[0],
      name: 'balanceOf',
      params: [_user],
    });
  });

  const balances = await Multicall(
    balanceCalls,
    'gauge',
    undefined,
    undefined,
    _provider,
  );

  const parsedBalances: any = [];
  let tokenCount = 0;
  // We include the lpAddress
  balances?.forEach((balance, index) => {
    parsedBalances.push({
      gaugeAddress: unionGauges[index].response[0],
      balance: formatFrom(balance.response[0]),
      address: unionLps[index],
      token0: tokens[tokenCount].response[0],
      token1: tokens[tokenCount + 1].response[0],
    });
    tokenCount += 2;
  });

  return parsedBalances;
};

export const getFarmStakes = async (_user: string, _provider) => {
  const gaugeBalances = await getGaugeBalances(_user, _provider);
  const farmLiquidity = getTokenGroupStatistics(gaugeBalances, 'farmList');

  // Get the pricing information into liquidity data
  let token24hsTotal = 0;
  let token24hsTotalUsd = 0;

  const farmLiquidityArray = {};

  farmLiquidity.farmList?.forEach((poolToken, i) => {
    const lpTokenBalance = parseFloat(`${poolToken.amount || 0}`);

    if (lpTokenBalance) {
      token24hsTotalUsd += poolToken.usd;
    }
    poolToken.name =
      poolToken.name && poolToken.name.replace('sLP', '').replace('vLP', '');
    poolToken.title =
      poolToken.title && poolToken.title.replace('sLP', '').replace('vLP', '');
    poolToken.full_name =
      poolToken.full_name &&
      poolToken.full_name.replace('sLP', '').replace('vLP', '');

    farmLiquidityArray[`${poolToken.address.toLowerCase()}`] = poolToken;
  });

  const diff24hs = token24hsTotalUsd - token24hsTotal || 0;

  farmLiquidity.diffPercent = checkInvalidValue(
    `${(diff24hs / token24hsTotal) * 100}`,
  );
  farmLiquidity.diffAmount = formatAmountChange(diff24hs);
  farmLiquidity.totalValueNumber = token24hsTotalUsd;
  farmLiquidity.totalValue = fiat(token24hsTotalUsd, '$');

  return {
    liquidity:
      farmLiquidity.farmList && farmLiquidity.farmList.length > 0
        ? farmLiquidity
        : { ...farmLiquidity, farmList: null },
    farmLiquidityArray,
  };
};

export const getStakedBalances = async (
  _address: string,
  covalentRawDataPromise: Promise<any>,
  provider?: any,
) => {
  const covalentRawData = await covalentRawDataPromise;
  const V2Pools =
    covalentRawData &&
    covalentRawData.items.filter(
      item => item.contract_name && item.contract_name.includes('V1 AMM'),
    );

  const lpBalances = await getUserStakedBalance(_address, V2Pools, provider);

  const liquidity = getTokenGroupStatistics(lpBalances, 'stakeList');

  const walletLiquidityArray = liquidity.stakeList;

  return {
    walletLiquidityArray:
      walletLiquidityArray && walletLiquidityArray.length > 0
        ? walletLiquidityArray
        : null,
  };
};

export const getUserBalances = async (
  _address: string,
  _network = CHAIN_ID,
) => {
  const data = await safeExecute(() => getWalletData(_address, _network));

  if (!data) {
    return null;
  }

  return data;
};

export const getBalancesFromChain = async (
  _userWalletAddress,
  _tokens: tokenData[],
  chainId = CHAIN_ID,
) => {
  const tokensData = JSON.parse(JSON.stringify(_tokens)) || [];
  const calls: Call[] = [];
  const decimalCalls: Call[] = [];
  const [defaultToken] = bridgeTokens[chainId].filter(
    token => token.address !== '0x0000000000000000000000000000000000000000',
  );

  const isNativeToken = (token: tokenData) =>
    ['FTM'].includes(token.symbol) ||
    [
      `${UNIDEX_ETH_ADDRESS}`.toLowerCase(),
      `${BASE_TOKEN_ADDRESS}`.toLowerCase(),
    ].includes(`${token.address}`.toLowerCase());

  tokensData.forEach(token => {
    calls.push({
      name: 'balanceOf',
      // Native token will fail erc-20 call, we give it an address that won't fail the erc-20 balance check
      address: isNativeToken(token) ? defaultToken.address : token.address,
      params: [_userWalletAddress],
    });

    decimalCalls.push({
      name: 'decimals',
      address: isNativeToken(token) ? defaultToken.address : token.address,
    });
  });

  const [[balances, decimals], nativeBalance] = await Promise.all([
    MultiCallArray([calls, decimalCalls], ['erc20', 'erc20'], chainId),
    getNativeTokenBalance(_userWalletAddress, chainId),
  ]);

  // Now that we have the balances, we tie them to the wallet data so they have latest balances
  let totalValue = 0;
  let totalValue24 = 0;

  tokensData.forEach((token, index) => {
    const tokenDecimals = parseInt(decimals[index]?.response[0].toString(), 10);
    const multiCallBalance = balances[index]?.response
      ? formatUnits(balances[index]?.response[0], tokenDecimals)
      : '0';
    const balance = isNativeToken(token) ? nativeBalance : multiCallBalance;

    token.amount = `${balance}`;
    token.usd = token.rate * parseFloat(balance);
    totalValue += token.usd ? parseFloat(token.usd) : 0;
    totalValue24 += parseFloat(token.usd_24);
  });

  const tokenDifference = totalValue - totalValue24;

  const summary: balanceReturnData = {
    tokenList: tokensData,
    totalValue: fiat(totalValue, '$'),
    total24Value: fiat(totalValue24, '$'),
    totalValueNumber: totalValue,
    total24ValueNumber: totalValue24,
    diffAmount: formatAmountChange(tokenDifference ? tokenDifference : 0),
    diffPercent: formatAmountChange(
      tokenDifference ? tokenDifference / totalValue24 : 0,
    ),

    diffAmountValue: tokenDifference,
    diffPercentValue: tokenDifference ? tokenDifference / totalValue24 : 0,
  };

  return summary;
};

export const reconciliateBalances = async (
  _userWalletAddress,
  _wallet,
  _trackedTokens,
  chainId = CHAIN_ID,
) => {
  let safeTokenList;
  if (_wallet?.tokens) {
    const { tokenList } = _wallet.tokens;
    safeTokenList = tokenList;
  }

  const tokensToAdd: string[] = [];

  _trackedTokens?.forEach(tToken => {
    const [exists] = safeTokenList?.filter(
      token => `${tToken.address}` === `${token.address}`,
    );

    if (!exists && `${tToken.chainId}` === `${chainId}`) {
      tokensToAdd.push(tToken.address);
    }
  });

  if (tokensToAdd.length && safeTokenList) {
    const tokensDetails = await getTokensDetails(tokensToAdd);
    safeTokenList = safeTokenList.concat(tokensDetails);
  }

  const updateBalances = await getBalancesFromChain(
    _userWalletAddress,
    safeTokenList,
    chainId,
  );

  const reconciliatedData = {
    tokens: updateBalances,
    liquidity: _wallet.liquidity, // Liquidity data is already derived from blockchain calls
  };

  return reconciliatedData;
};

export const getV2Earnings = async (_address: string, _network = CHAIN_ID) => {
  const calls: Call[] = farmsV2.map(farm => {
    const call: Call = {
      address: farm.gaugeAddress,
      name: 'earned',
      params: [_address],
      data: farm,
    };

    return call;
  });

  const rawEarnings = await Multicall(calls, 'gauge');

  return rawEarnings;
};

export const getPendingRewards = async (
  _userAddress: string,
  gaugeData: any,
  _provider,
) => {
  const {
    variableGauges,
    stableGauges,
    adminGauges,
    stableLps,
    variableLps,
    adminLps,
  } = gaugeData;

  const unionGauges = [...variableGauges, ...stableGauges, ...adminGauges];
  const unionLps = [...variableLps, ...stableLps, ...adminLps];

  const callsArray = unionGauges.map(gauge => ({
    name: 'earned',
    params: [_userAddress],
    address: gauge,
  }));

  let rewardData;

  // Try fast method
  try {
    const responses = await Multicall(
      callsArray,
      'gauge',
      CHAIN_ID,
      'rpc',
      _provider,
    );
    rewardData = responses.map(response => response.response[0]);
    // Fallback to standard
  } catch (e) {
    console.warn('User balance call failed, trying standard method');
    const Promises = unionGauges.map(async gauge => {
      const gaugeContract = await Contract(
        gauge,
        'gauge',
        'rpc',
        CHAIN_ID,
        _provider,
      );
      try {
        return await gaugeContract.earned(_userAddress);
      } catch (e) {
        return Promise.resolve();
      }
    });

    rewardData = await Promise.all(Promises);
  }

  const rewards: any[] = [];

  rewardData.forEach((response, index) => {
    const gaugeAddress = unionGauges[index];
    const lpAddress = unionLps[index];

    if (!response || (response && response.isZero())) {
      return;
    }

    rewards.push({
      lpAddress,
      gaugeAddress,
      earned: response ? response.toString() : '0',
    });
  });

  return rewards;
};
