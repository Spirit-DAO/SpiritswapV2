import BigNumber from 'bignumber.js';
import { formatUnits } from 'ethers/lib/utils';
import {
  CHAIN_ID,
  SPIRIT,
  SPIRIT_FTM_LP_ADDRESS,
  USDC,
  USDC_FTM_LP_ADDRESS,
  WFTM,
} from 'constants/index';
import { farms, inactiveFarms } from 'constants/farms';
import Contracts from 'constants/contracts';
import { IFarm } from 'app/interfaces/Farm';
import { Multicall, Call, Contract, MultiCallArray } from 'utils/web3';
import { request, getLiquidityPoolsDataV2, getTokenUsdPrice } from './covalent';
import { stableSobPools } from 'constants/sobpools';
import { TokenAmount } from 'app/interfaces/General';
import { checkAddress, GetVerifiedTokenFromAddres } from 'app/utils/methods';
import { tokenData } from 'utils/data/types';
import { weightedpools } from 'constants/weightedpools';
import { getEternalFarmings, getPool, getToken } from 'utils/apollo/queries-v3';

const FARMS = farms;

export const verifiedLpTokenData = () => {
  const addressMapping = {};

  FARMS.forEach(a => {
    if (a?.lpAddresses[CHAIN_ID]) {
      addressMapping[`${a.lpAddresses[CHAIN_ID]}`.toLowerCase()] = a;
    }
  });

  return addressMapping;
};

export const getGaugeBasicInfo = async (_provider = null) => {
  const variableGaugeCalls: Call[] = [];
  const variableTokensCalls: Call[] = [];

  const stableGaugeCalls: Call[] = [];
  const stableTokensCalls: Call[] = [];

  const adminGaugeCalls: Call[] = [];
  const adminTokensCalls: Call[] = [];

  const combineGaugeCalls: Call[] = [];
  const combineTokensCalls: Call[] = [];

  const variableAddress = Contracts.variableProxy[CHAIN_ID];
  const stableAddress = Contracts.stableProxy[CHAIN_ID];
  const adminAddress = Contracts.adminProxy[CHAIN_ID];
  const combineProxyAddress = Contracts.combineProxy[CHAIN_ID];

  const [
    { response: variableLpsResponse },
    { response: stableLpsResponse },
    { response: adminLpsResponse },
    { response: combineGaugesResponse },
  ] = await Multicall(
    [
      { name: 'tokens', params: [], address: variableAddress },
      { name: 'tokens', params: [], address: stableAddress },
      { name: 'tokens', params: [], address: adminAddress },
      { name: 'tokens', params: [], address: combineProxyAddress },
    ],
    'gaugeproxyV3',
    undefined,
    undefined,
    _provider,
  );

  const variableLps = variableLpsResponse[0];
  const stableLps = stableLpsResponse[0];
  const adminLps = adminLpsResponse[0];
  const combineLps = combineGaugesResponse[0];

  variableLps.forEach(variableLp => {
    variableGaugeCalls.push({
      address: variableAddress,
      name: 'gauges',
      params: [variableLp],
    });
    variableTokensCalls.push({
      address: variableLp,
      name: 'token0',
    });
    variableTokensCalls.push({
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
    stableTokensCalls.push({
      address: stableLp,
      name: 'token0',
    });
    stableTokensCalls.push({
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
    adminTokensCalls.push({
      address: adminLp,
      name: 'token0',
    });
    adminTokensCalls.push({
      address: adminLp,
      name: 'token1',
    });
  });

  combineLps.forEach(combineLp => {
    combineGaugeCalls.push({
      address: combineProxyAddress,
      name: 'gauges',
      params: [combineLp],
    });
    combineTokensCalls.push({
      address: combineLp,
      name: 'token0',
    });
    combineTokensCalls.push({
      address: combineLp,
      name: 'token1',
    });
  });

  const [
    variableGauges,
    stableGauges,
    adminGauges,
    combineGauges,
    combineTokens,
    variableTokens,
    stableTokens,
    adminTokens,
  ] = await MultiCallArray(
    [
      variableGaugeCalls,
      stableGaugeCalls,
      adminGaugeCalls,
      combineGaugeCalls,
      combineTokensCalls,
      variableTokensCalls,
      stableTokensCalls,
      adminTokensCalls,
    ],
    [
      'gaugeproxyV3',
      'gaugeproxyV3',
      'gaugeproxyV3',
      'gaugeproxyV3',
      'pairV2',
      'pairV2',
      'pairV2',
      'pairV2',
    ],
    CHAIN_ID,
    'rpc',
    _provider,
  );

  return {
    variableGauges: variableGauges.map(gauge => gauge.response[0]),
    stableGauges: stableGauges.map(gauge => gauge.response[0]),
    adminGauges: adminGauges.map(gauge => gauge.response[0]),
    variableTokens: variableTokens.map(token => token.response[0]),
    stableTokens: stableTokens.map(token => token.response[0]),
    adminTokens: adminTokens.map(token => token.response[0]),
    combineGauges: combineGauges.map(gauge => gauge.response[0]),
    combineTokens: combineTokens.map(token => token.response[0]),
    combineLps,
    variableLps,
    stableLps,
    adminLps,
  };
};

export const getGaugesPoolInfoWithMulticall = async (
  gaugesPromise,
  _provider = null,
) => {
  const variableAddress = Contracts.variableProxy[CHAIN_ID];
  const stableAddress = Contracts.stableProxy[CHAIN_ID];
  const adminAddress = Contracts.adminProxy[CHAIN_ID];
  const masterchefAddress = Contracts.masterchef[CHAIN_ID];

  const combineProxyAddress = Contracts.combineProxy[CHAIN_ID];

  const {
    variableGauges,
    stableGauges,
    adminGauges,
    combineGauges,

    variableLps,
    stableLps,
    adminLps,
    combineLps,

    variableTokens,
    stableTokens,
    adminTokens,
    combineTokens,
  } = await gaugesPromise;

  const variableDataCalls: Call[] = [];
  const variableLockedWeightsCalls: Call[] = [];
  const variableERC20Calls: Call[] = [];

  const stableDataCalls: Call[] = [];
  const stableLockedWeightsCalls: Call[] = [];
  const stableERC20Calls: Call[] = [];

  const adminDataCalls: Call[] = [];
  const adminWeightsCalls: Call[] = [];
  const adminERC20Calls: Call[] = [];

  const combineDataCalls: Call[] = [];
  const combineERC20Calls: Call[] = [];
  const combineLockedWeightsCalls: Call[] = [];

  variableGauges.forEach((variableGauge, i) => {
    const address = variableGauge;
    const lpAddress = variableLps[i];
    variableDataCalls.push({
      address,
      name: 'rewardRate',
    });
    variableDataCalls.push({
      address,
      name: 'derivedSupply',
    });
    variableLockedWeightsCalls.push({
      address: variableAddress,
      name: 'lockedWeights',
      params: [lpAddress],
    });
    variableERC20Calls.push({
      address: lpAddress,
      name: 'balanceOf',
      params: [address],
    });
    variableERC20Calls.push({
      address: lpAddress,
      name: 'stable',
    });
  });

  stableGauges.forEach((stableGauge, i) => {
    const address = stableGauge;
    const lpAddress = stableLps[i];
    stableDataCalls.push({
      address,
      name: 'rewardRate',
    });
    stableDataCalls.push({
      address,
      name: 'derivedSupply',
    });
    stableLockedWeightsCalls.push({
      address: stableAddress,
      name: 'lockedWeights',
      params: [lpAddress],
    });
    stableERC20Calls.push({
      address: lpAddress,
      name: 'balanceOf',
      params: [address],
    });
    stableERC20Calls.push({
      address: lpAddress,
      name: 'stable',
    });
  });

  adminGauges.forEach((adminGauge, i) => {
    const address = adminGauge;
    const lpAddress = adminLps[i];
    adminDataCalls.push({
      address,
      name: 'rewardRate',
    });
    adminDataCalls.push({
      address,
      name: 'derivedSupply',
    });
    adminWeightsCalls.push({
      address: adminAddress,
      name: 'gaugeWeights',
      params: [lpAddress],
    });
    adminERC20Calls.push({
      address: lpAddress,
      name: 'balanceOf',
      params: [address],
    });
    adminERC20Calls.push({
      address: lpAddress,
      name: 'stable',
    });
  });

  combineGauges.forEach((combineGauge, i) => {
    const address = combineGauge;
    const lpAddress = combineLps[i];

    combineDataCalls.push({
      address,
      name: 'rewardRate',
    });
    combineDataCalls.push({
      address,
      name: 'derivedSupply',
    });
    combineLockedWeightsCalls.push({
      address: adminAddress,
      name: 'gaugeWeights',
      params: [lpAddress],
    });
    combineERC20Calls.push({
      address: lpAddress,
      name: 'balanceOf',
      params: [address],
    });
    combineERC20Calls.push({
      address: lpAddress,
      name: 'stable',
    });
  });

  const masterChefCalls: Call[] = [
    {
      address: masterchefAddress,
      name: 'poolInfo',
      params: ['75'],
    },
    {
      address: masterchefAddress,
      name: 'poolInfo',
      params: ['74'],
    },
    {
      address: masterchefAddress,
      name: 'poolInfo',
      params: ['73'],
    },
    {
      address: masterchefAddress,
      name: 'poolInfo',
      params: ['72'],
    },
    {
      address: masterchefAddress,
      name: 'totalAllocPoint',
    },
  ];

  // [variableGaugeData, stableGaugeData, adminGaugeData, variableLockedWeights, stableLockedWeights, adminLockedWeights, variableTotalWeight, stableTotalWeight, adminTotalWeight]
  const chainResponse = await MultiCallArray(
    [
      variableDataCalls,
      stableDataCalls,
      adminDataCalls,
      combineDataCalls,
      variableERC20Calls,
      stableERC20Calls,
      adminERC20Calls,
      combineERC20Calls,
      variableLockedWeightsCalls,
      stableLockedWeightsCalls,
      adminWeightsCalls,
      combineLockedWeightsCalls,
      masterChefCalls,
      [
        {
          name: 'lockedTotalWeight',
          address: variableAddress,
        },
        {
          name: 'lockedTotalWeight',
          address: stableAddress,
        },
        {
          name: 'totalWeight',
          address: adminAddress,
        },
        {
          name: 'lockedTotalWeight',
          address: combineProxyAddress,
        },
      ],
    ],
    [
      'gauge',
      'gauge',
      'gauge',
      'gauge',
      'pairV2',
      'pairV2',
      'pairV2',
      'pairV2',
      'gaugeproxyV3',
      'gaugeproxyV3',
      'gaugeproxyV3',
      'gaugeproxyV3',
      'masterchef',
      'gaugeproxyV3',
    ],
    CHAIN_ID,
    'rpc',
    _provider,
  );

  const variableWeights = chainResponse[13][0].response[0];
  const stableWeights = chainResponse[13][1].response[0];
  const adminWeights = chainResponse[13][2].response[0];
  const combineWeights = chainResponse[13][3].response[0];

  const variableAlloc = new BigNumber(
    chainResponse[12][0]?.response[1]?.toString(),
  );
  const stableAlloc = new BigNumber(
    chainResponse[12][1]?.response[1]?.toString(),
  );
  const adminAlloc = new BigNumber(
    chainResponse[12][2]?.response[1]?.toString(),
  );
  const combineAlloc = new BigNumber(
    chainResponse[12][3]?.response[1]?.toString(),
  );
  const totalAllocPoint = new BigNumber(
    chainResponse[12][4]?.response[0]?.toString(),
  );

  const variableShare = variableAlloc.div(totalAllocPoint);
  const stableShare = stableAlloc.div(totalAllocPoint);
  const adminShare = adminAlloc.div(totalAllocPoint);
  const combineShare = combineAlloc.div(totalAllocPoint);

  const data: any = [[], [], [], []];

  const unionGauges = [
    variableGauges,
    stableGauges,
    adminGauges,
    combineGauges,
  ];
  const unionTokens = [
    variableTokens,
    stableTokens,
    adminTokens,
    combineTokens,
  ];

  [variableLps, stableLps, adminLps, combineLps].forEach((lps, x) => {
    const loc = data[x];
    let doubleCountEven = 0;
    let doubleCountOdd = 1;
    lps.forEach((lp, y) => {
      loc.push({
        address: lp,
        gaugeAddress: unionGauges[x][y],
        rewardRate: chainResponse[x][doubleCountEven]?.response[0]?.toString(),
        derivedSupply:
          chainResponse[x][doubleCountOdd]?.response[0]?.toString(),
        weight: chainResponse[x + 8].length
          ? chainResponse[x + 8][y]?.response[0]?.toString()
          : null,
        liquidityShare: formatUnits(
          chainResponse[x + 4][doubleCountEven]?.response[0]?.toString() || '0',
          18,
        )?.toString(),
        stable: chainResponse[x + 4][doubleCountOdd]?.response[0],
        token0: unionTokens[x][doubleCountEven],
        token1: unionTokens[x][doubleCountOdd],
        type: ['variable', 'stable', 'admin', 'combine'][x],
      });
      doubleCountOdd += 2;
      doubleCountEven += 2;
    });
  });

  const [
    variableGaugesData,
    stableGaugesData,
    adminGaugesData,
    combineGaugesData,
  ] = data;
  const variableTotalLocked = variableWeights?.toString();
  const stableTotalLocked = stableWeights?.toString();
  const adminTotalLocked = adminWeights?.toString();
  const combineTotalLocked = combineWeights?.toString();

  return {
    variableGauges: variableGaugesData,
    stableGauges: stableGaugesData,
    adminGauges: adminGaugesData,
    combineGauges: combineGaugesData,
    variableTotalLocked,
    stableTotalLocked,
    adminTotalLocked,
    combineTotalLocked,
    variableShare,
    stableShare,
    adminShare,
    combineShare,
  };
};

export const getLpTokenPrices = async (
  gaugesPromise,
  _provider: any,
): Promise<any> => {
  const {
    variableLps,
    stableLps,
    adminLps,
    variableTokens,
    stableTokens,
    adminTokens,
  } = await gaugesPromise;

  const lps = [variableLps, stableLps, adminLps];

  const reserveCalls: Call[] = [];
  const totalSupplyCalls: Call[] = [];

  lps.forEach(lps => {
    lps.forEach(lp => {
      reserveCalls.push({
        address: lp,
        name: 'reserve0',
      });
      reserveCalls.push({
        address: lp,
        name: 'reserve1',
      });
      totalSupplyCalls.push({
        address: lp,
        name: 'totalSupply',
      });
    });
  });

  const ftmUSDCCall = [
    {
      address: USDC_FTM_LP_ADDRESS,
      name: 'reserve0',
    },
    {
      address: USDC_FTM_LP_ADDRESS,
      name: 'reserve1',
    },
  ];

  const ftmSpiritCall = [
    {
      address: SPIRIT_FTM_LP_ADDRESS,
      name: 'reserve0',
    },
    {
      address: SPIRIT_FTM_LP_ADDRESS,
      name: 'reserve1',
    },
  ];

  const chainTokens = [...variableTokens, ...stableTokens, ...adminTokens];

  const [reserves, supply, ftmUSDC, ftmSpirit] = await MultiCallArray(
    [reserveCalls, totalSupplyCalls, ftmUSDCCall, ftmSpiritCall],
    ['pairV2', 'pairV2', 'pairV2', 'pairV2'],
    CHAIN_ID,
    'rpc',
    _provider,
  );

  const usdcBaseReserves = formatUnits(ftmUSDC[0].response[0], 6);
  const ftmBaseReserves = formatUnits(ftmUSDC[1].response[0], 18);
  const ftmPoolReserves = formatUnits(ftmSpirit[0].response[0], 18);
  const spiritPoolReserves = formatUnits(ftmSpirit[1].response[0], 18);

  const usdcFTMValue = new BigNumber(usdcBaseReserves).div(
    new BigNumber(ftmBaseReserves),
  );
  const usdcSpiritValue = usdcFTMValue.times(
    new BigNumber(ftmPoolReserves).div(new BigNumber(spiritPoolReserves)),
  );

  const data: any = {};

  const reconcileReserves = (reserve, totalSupply) => {
    const reserveValue = new BigNumber(reserve);
    const totalSupplyValue = new BigNumber(totalSupply);
    return reserveValue.times(2).div(totalSupplyValue);
  };

  const determineUSDCValue = (
    token0,
    token1,
    reserve0,
    reserve1,
    totalSupply,
  ) => {
    const tokenAddresses = [token0.toLowerCase(), token1.toLowerCase()];
    if (tokenAddresses.includes(WFTM.address.toLowerCase())) {
      const ftmReserve = (
        checkAddress(token0, WFTM.address) ? reserve0 : reserve1
      )?.toString();
      return usdcFTMValue.times(reconcileReserves(ftmReserve, totalSupply));
    } else if (tokenAddresses.includes(USDC.address.toLowerCase())) {
      const usdcReserve = (
        checkAddress(token0, USDC.address) ? reserve0 : reserve1
      )?.toString();
      return reconcileReserves(
        formatUnits(usdcReserve, 6),
        formatUnits(totalSupply, 18),
      );
    } else if (tokenAddresses.includes(SPIRIT.address.toLowerCase())) {
      const spiritReserve = (
        checkAddress(token0, SPIRIT.address) ? reserve0 : reserve1
      )?.toString();
      return usdcSpiritValue.times(
        reconcileReserves(spiritReserve, totalSupply),
      );
    }

    return new BigNumber(0);
  };

  let count = 0;
  let doubleCountEven = 0;
  let doubleCountOdd = 1;
  lps.forEach((lps, x) => {
    lps.forEach(lp => {
      const rate = determineUSDCValue(
        chainTokens[doubleCountEven],
        chainTokens[doubleCountOdd],
        reserves[doubleCountEven].response[0]?.toString(),
        reserves[doubleCountOdd].response[0]?.toString(),
        supply[count].response[0]?.toString(),
      );
      data[lp.toLowerCase()] = rate;
      doubleCountOdd += 2;
      doubleCountEven += 2;
      count++;
    });
  });

  return data;
};

export const getMasterChefPoolInfoWithMultiCall = async (_provider = null) => {
  const masterChefAddress = Contracts.masterchef[CHAIN_ID];

  const masterChefContract = await Contract(
    masterChefAddress,
    'masterchef2',
    undefined,
    undefined,
    _provider,
  );

  const [spiritPerBlockResponse] = await Promise.all([
    masterChefContract.spiritPerBlock(),
  ]);

  // APR Calculations
  const spiritPerBlock = new BigNumber(spiritPerBlockResponse._hex)
    .div(new BigNumber(10).pow(18))
    .toNumber();

  return {
    spiritPerBlock,
  };
};

export const getLiquityPoolStatistics = async (chainId = CHAIN_ID) => {
  const poolDataFromCovalent = await getLiquidityPoolsDataV2(chainId);

  const savedFarms = verifiedLpTokenData();

  poolDataFromCovalent.forEach(data => {
    const farm = savedFarms[`${data.exchange}`.toLowerCase()];

    if (farm) {
      // We add additional data here we'll keep in the statistics object
      const total = data.total_liquidity_quote;
      // const volume = pool.volume_24h_quote;
      const fee = parseFloat(data.fee_24h_quote);

      const lpApyNumber =
        fee && total ? ((fee / total) * 365 * 100 * 5) / 6 : 0;

      const lpApy =
        lpApyNumber && lpApyNumber.toLocaleString('en-US').slice(0, -1);

      const fullApy = new BigNumber(lpApyNumber);

      const fullAPYMin = fullApy.isGreaterThan(0)
        ? fullApy.times(0.4)
        : new BigNumber(0);

      const GaugeAPYMin = fullAPYMin.plus(lpApyNumber);
      const GaugeAPYMax = fullApy.plus(lpApyNumber);
      const AprRange = [GaugeAPYMin.toFormat(2), GaugeAPYMax.toFormat(2)];

      data.lpApyNumber = lpApyNumber;
      data.lpApy = `${lpApy}`;
      data.aprRange = AprRange;
      farm.statistics = data;
    }
  });

  return savedFarms;
};

export const loadFarmsList = async (
  gaugeChainData,
  spiritPriceRaw,
  lpTokensPrice,
  mappedTokens,
  chainId = CHAIN_ID,
) => {
  const spiritPrice = new BigNumber(spiritPriceRaw);

  const {
    variableGauges,
    stableGauges,
    adminGauges,
    combineGauges,

    variableTotalLocked,
    stableTotalLocked,
    adminTotalLocked,
    combineTotalLocked,

    variableShare,
    stableShare,
    adminShare,
    combineShare,
  } = gaugeChainData;

  const totalData = [
    ...variableGauges,
    ...stableGauges,
    ...adminGauges,
    ...combineGauges,
  ];

  // Here's where we call stable and weighted data
  const masterFarms: (IFarm | null)[] = await Promise.all(
    totalData.map(async (farm, i) => {
      const share =
        farm.type === 'variable'
          ? variableShare
          : farm.type === 'stable'
          ? stableShare
          : farm.type === 'admin'
          ? adminShare
          : combineShare;

      const lowerLp = farm.lpAddresses
        ? farm.lpAddresses[chainId].toLowerCase()
        : farm.lpAddress
        ? farm.lpAddress.toLowerCase()
        : farm.address?.toLowerCase();

      const rate = lpTokensPrice[lowerLp];
      const tokens = [
        mappedTokens[farm.token0.toLowerCase()],
        mappedTokens[farm.token1.toLowerCase()],
      ];
      const gaugeWeight = new BigNumber(farm.weight);
      const gaugeRewardPerSecond = new BigNumber(farm.rewardRate);
      const totalDerivedBalance = new BigNumber(farm.derivedSupply);
      const gaugeRewardPerYear = gaugeRewardPerSecond.times(
        new BigNumber('31536000'),
      );
      const rewardBase = gaugeRewardPerYear
        .div(totalDerivedBalance)
        ?.toString();

      let totalLocked;
      if (farm.type === 'admin') {
        totalLocked = new BigNumber(adminTotalLocked);
      } else if (farm.type === 'stable') {
        totalLocked = new BigNumber(stableTotalLocked);
      } else if (farm.type === 'combine') {
        totalLocked = new BigNumber(combineTotalLocked);
      } else {
        totalLocked = new BigNumber(variableTotalLocked);
      }

      farm.multiplier = gaugeWeight.div(totalLocked).times(share).times(100);

      if (tokens[0] && tokens[1]) {
        farm.lpSymbol = `${tokens[0].symbol}-${tokens[1].symbol}`;
      } else {
        farm.lpSymbol = '';
      }

      const maxApy = new BigNumber(
        rewardBase && rewardBase !== 'Infinity'
          ? new BigNumber(rewardBase!).times(spiritPrice.div(rate)).times(100)
          : 0,
      );

      const minApy = maxApy.times(0.4);

      const AprRange = [minApy.toFormat(2), maxApy.toFormat(2)];

      const totalLiquidity = new BigNumber(farm.liquidityShare)
        .times(rate)
        .toNumber();

      const isIncative = inactiveFarms.includes(farm.lpSymbol.toUpperCase());

      const lp: IFarm = {
        title: farm?.lpSymbol
          .replace('WFTM', 'FTM')
          .replace(' LP', '')
          .replace('-', ' + '),
        tokens: [...tokens.map(token => token && token.symbol)],
        lpAddress: farm.address,
        gaugeAddress: farm?.gaugeAddress,
        aprLabel: 'APY',
        apr:
          maxApy.toFormat(2) === 'NaN' || isIncative ? '0' : maxApy.toFormat(2),
        boosted: true,
        lpApr: '0',
        label: farm.type || 'NMC',
        rewardToken: farm?.rewardToken,
        totalLiquidity,
        totalSupply: farm.liquidityShare,
        aprRange:
          maxApy.toFormat(2) === 'NaN' || isIncative ? ['0', '0'] : AprRange,
        boostFactor: '1',
        yourApr: minApy.isFinite()
          ? isIncative
            ? '0'
            : minApy?.toString()
          : '0',
        valid: tokens.length > 0,
        multiplier: farm.multiplier
          ? farm.multiplier.isFinite()
            ? farm.multiplier?.toString()
            : '0.00'
          : '0.00',
        holdAmountForMaxBoost: '1',
        progress: 0,
        spiritEarned: '0.0',
        spiritEarnedMoney: '0.0',
        lpTokens: '0.00',
        stable: farm.stable,
        lpTokensMoney: '0.00',
        type: farm.stable ? 'stable' : 'variable',
        pid: farm?.pid || 0,
      };

      return lp;
    }),
  );

  return masterFarms;
};

export const loadConcentratedFarmsList = async () => {
  const eternalFarmings = await getEternalFarmings();

  const _pools = eternalFarmings.map(farming => farming.pool);
  const _rewardTokens = eternalFarmings.map(farming => farming.rewardToken);
  const _bonusRewardTokens = eternalFarmings.map(
    farming => farming.bonusRewardToken,
  );

  const pools = await Promise.all(_pools.map(pool => getPool(pool)));

  const rewardTokens = await Promise.all(
    _rewardTokens.map(reward => getToken(reward)),
  );
  const bonusRewardTokens = await Promise.all(
    _bonusRewardTokens.map(reward => getToken(reward)),
  );

  if (!pools || !rewardTokens || !bonusRewardTokens) return [];

  const tvls = await fetch(
    'https://api.algebra.finance/api/TVL/eternalFarmings/?network=fantom-spirit',
  ).then(v => v.json());
  const aprs = await fetch(
    'https://api.algebra.finance/api/APR/eternalFarmings/?network=fantom-spirit',
  ).then(v => v.json());

  return await Promise.all(
    eternalFarmings.map(async (farming, index) => {
      const rewardRate = formatUnits(
        new BigNumber(farming.rewardRate).toString(),
        rewardTokens[index].decimals,
      );
      const bonusRewardRate = formatUnits(
        new BigNumber(farming.bonusRewardRate).toString(),
        bonusRewardTokens[index].decimals,
      );

      const dailyRewardRate = Math.round(+rewardRate * 86_400);
      const dailyBonusRewardRate = Math.round(+bonusRewardRate * 86_400);

      const yourApr = aprs && aprs[farming.id] ? aprs[farming.id] : 0;

      let rewardAUSDValue = 0,
        rewardBUSDValue = 0;

      if (farming.rewardRate) {
        const rewardPrice = await getTokenUsdPrice(farming.rewardToken);

        rewardAUSDValue =
          +formatUnits(farming.reward, rewardTokens[index].decimals) *
          rewardPrice;
      }

      if (farming.bonusRewardRate) {
        const bonusRewardPrice = await getTokenUsdPrice(
          farming.bonusRewardToken,
        );

        rewardBUSDValue =
          +formatUnits(farming.bonusReward, bonusRewardTokens[index].decimals) *
          bonusRewardPrice;
      }

      return {
        title:
          `${pools[index]?.token0.symbol} + ${pools[index]?.token1.symbol}`.replace(
            'WFTM',
            'FTM',
          ),
        tokens: [pools[index]?.token0.symbol, pools[index]?.token1.symbol],
        label: 'concentrated',
        totalLiquidity: 0,
        aprLabel: 'APR',
        stable: false,
        boosted: false,
        concentrated: true,
        type: 'concentrated',
        ...farming,
        rewardToken: rewardTokens[index],
        bonusRewardToken: bonusRewardTokens[index],
        dailyRewardRate,
        dailyBonusRewardRate,
        pool: pools[index],
        valid: true,
        lpAddress: pools[index]?.id,
        aprRange: ['0', '1'],
        rangeLength: farming.minRangeLength,
        apr: '2',
        yourApr: yourApr < 0 ? 0 : yourApr,
        tvl: tvls && tvls[farming.id] ? Math.round(tvls[farming.id]) : 0,
        rewardsUSDValue: rewardAUSDValue + rewardBUSDValue,
      };
    }),
  );
};

// TODO: [DEV2-619] analyze from where to get soob pooled data
export const getSobOrWeightedData = async (
  userAddress: string,
  target: 'stable' | 'weighted' = 'stable',
) => {
  const source = `https://api.debank.com/portfolio/list?user_addr=${userAddress}&project_id=ftm_beethovenx`;
  const { data } = await request(source);

  if (data && data.portfolio_list) {
    const balancesAndSupply = await getPoolUserBalanceAndSupply(
      userAddress,
      target,
    );

    const formattedData = formatSobPoolData(
      data.portfolio_list,
      balancesAndSupply,
      target,
    );

    return formattedData;
  }

  return [];
};

export const getPoolUserBalanceAndSupply = async (
  userAddres: string,
  target: 'stable' | 'weighted' = 'stable',
) => {
  let sobPoolCalls: Call[] = [];
  let sobPoolResponse: any = {};
  let sobPoolsAddresses: string[] = [];

  const targetPools = target === 'weighted' ? weightedpools : stableSobPools;

  targetPools.forEach(stableSobPool => {
    const call = [
      {
        address: stableSobPool.address,
        name: 'balanceOf',
        params: [userAddres],
      },
      {
        address: stableSobPool.address,
        name: 'totalSupply',
      },
    ];
    sobPoolCalls = [...sobPoolCalls, ...call];
    sobPoolResponse[stableSobPool.address] = [
      { balanceOf: '0', totalSupply: '0' },
    ];
    sobPoolsAddresses = [...sobPoolsAddresses, stableSobPool.address];
  });

  if (sobPoolCalls.length > 1) {
    const multicallResponse = await Multicall(sobPoolCalls, 'sobPool');
    let index = 0;
    for (let x = 0; x < multicallResponse.length; x += 2) {
      const balanceOf = multicallResponse[x].response[0];
      const totalSupply = multicallResponse[x + 1]?.response[0];
      sobPoolResponse[`${sobPoolsAddresses[index]}`.toLowerCase()] = {
        balanceOf: balanceOf,
        totalSupply: totalSupply,
      };
      index++;
    }
  }

  return sobPoolResponse;
};

export const formatSobPoolData = (
  portfolioList,
  balancesAndSupply,
  targetPool: 'stable' | 'weighted' = 'stable',
) => {
  let target: any = stableSobPools;

  if (targetPool === 'weighted') {
    target = weightedpools;
  }

  const sobPoolsAddresses = target.map(sobPool =>
    `${sobPool.address}`.toLowerCase(),
  );

  const sobPoolData = portfolioList
    .filter(item => {
      return sobPoolsAddresses.includes(`${item.pool?.id}`.toLowerCase());
    })
    .map(pool => {
      const { id } = pool.pool || { id: '' };
      const [sobPoolFarm] = target.filter(
        data => `${data.address}`.toLowerCase() === `${id}`.toLowerCase(),
      );
      const tokensSymbol = sobPoolFarm.tokens.map(token => token.symbol);
      const tokenAmounts = getDebankTokenAmounts(pool.detail.supply_token_list);
      const poolFormated = {
        name: sobPoolFarm.symbol,
        title: sobPoolFarm.name, // yeap in this way
        full_name: sobPoolFarm.symbol,
        address: id,
        amount: formatUnits(
          balancesAndSupply[`${id}`.toLowerCase()].balanceOf,
          sobPoolFarm.decimals,
        ),
        symbol: sobPoolFarm.symbol,
        rate_24: 0,
        tokens: tokensSymbol,
        liquidity: true,
        staked: true, // no idea of this by now, to search for
        rate:
          (Object.values(pool.asset_dict).reduce(
            (a, b) => (a as number) + (b as number),
            0,
          ) as number) / pool.stats.asset_usd_value ?? 0, // probably for portfolio related to todo on line 374
        usd: pool.stats.asset_usd_value ?? 0,
        usd_24: 0,
        tokensAmounts: tokenAmounts,
        lpSupply: balancesAndSupply[id].totalSupply,
        lpType: targetPool,
      } as tokenData;
      return poolFormated;
    });
  return sobPoolData;
};

const getDebankTokenAmounts = (tokensDArray): TokenAmount[] => {
  return tokensDArray.map(tokenD => {
    const tokenS = GetVerifiedTokenFromAddres(tokenD.id);
    const tokenAmount = {
      token: tokenS,
      amount: tokenD.amount as string,
    };
    return tokenAmount;
  });
};
