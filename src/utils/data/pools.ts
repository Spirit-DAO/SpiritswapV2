import BigNumber from 'bignumber.js';
import { formatUnits, parseUnits } from 'ethers/lib/utils';
import {
  CHAIN_ID,
  SPIRIT,
  SPIRIT_FTM_LP_ADDRESS,
  tokens,
  USDC,
  USDC_FTM_LP_ADDRESS,
  WFTM,
} from 'constants/index';
import { farms } from 'constants/farms';
import Contracts from 'constants/contracts';
import addresses from 'constants/contracts';
import { IFarm } from 'app/interfaces/Farm';
import { getSplitCalls, formatFarmsCalls } from 'utils/data';
import {
  Multicall,
  Call,
  Contract,
  nonfungiblePositionManagerContract,
  MulticallV2,
} from 'utils/web3';
import { FarmChainData } from './types';
import {
  request,
  getHistoricalPortfolioValue,
  getLiquidityPoolsDataV2,
} from './covalent';
import { stableSobPools } from 'constants/sobpools';
import { TokenAmount } from 'app/interfaces/General';
import { checkAddress, GetVerifiedTokenFromAddres } from 'app/utils/methods';
import { tokenData } from 'utils/data/types';
import { weightedpools } from 'constants/weightedpools';
import {
  getEternalFarming,
  getEternalFarmings,
  getPool,
  getToken,
  getTransferredPositions,
} from 'utils/apollo/queries-v3';
import { algebraFarmingCenterContract } from 'utils/web3/actions/farm';
import { getProvider } from 'app/connectors/EthersConnector/login';
import { wallet } from 'utils/web3';

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

  const variableAddress = Contracts.variableProxy[CHAIN_ID];
  const stableAddress = Contracts.stableProxy[CHAIN_ID];
  const adminAddress = Contracts.adminProxy[CHAIN_ID];

  const [variableContract, stableContract, adminContract] = await Promise.all([
    Contract(variableAddress, 'gaugeproxyV3', undefined, undefined, _provider),
    Contract(stableAddress, 'gaugeproxyV3', undefined, undefined, _provider),
    Contract(adminAddress, 'gaugeproxyV3', undefined, undefined, _provider),
  ]);

  const [variableLps, stableLps, adminLps] = await Promise.all([
    variableContract.tokens(),
    stableContract.tokens(),
    adminContract.tokens(),
  ]);

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

  const [
    variableGauges,
    stableGauges,
    adminGauges,
    variableTokens,
    stableTokens,
    adminTokens,
  ] = await Promise.all([
    Multicall(variableGaugeCalls, 'gaugeproxyV3', CHAIN_ID, 'rpc', _provider),
    Multicall(stableGaugeCalls, 'gaugeproxyV3', CHAIN_ID, 'rpc', _provider),
    Multicall(adminGaugeCalls, 'gaugeproxyV3', CHAIN_ID, 'rpc', _provider),
    Multicall(variableTokensCalls, 'pairV2', CHAIN_ID, 'rpc', _provider),
    Multicall(stableTokensCalls, 'pairV2', CHAIN_ID, 'rpc', _provider),
    Multicall(adminTokensCalls, 'pairV2', CHAIN_ID, 'rpc', _provider),
  ]);

  return {
    variableGauges: variableGauges.map(gauge => gauge.response[0]),
    stableGauges: stableGauges.map(gauge => gauge.response[0]),
    adminGauges: adminGauges.map(gauge => gauge.response[0]),
    variableTokens: variableTokens.map(token => token.response[0]),
    stableTokens: stableTokens.map(token => token.response[0]),
    adminTokens: adminTokens.map(token => token.response[0]),
    variableLps,
    stableLps,
    adminLps,
    variableContract,
    stableContract,
    adminContract,
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

  const {
    variableGauges,
    stableGauges,
    adminGauges,
    variableLps,
    stableLps,
    adminLps,
    variableContract,
    stableContract,
    adminContract,
    variableTokens,
    stableTokens,
    adminTokens,
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
      name: 'totalAllocPoint',
    },
  ];

  // [variableGaugeData, stableGaugeData, adminGaugeData, variableLockedWeights, stableLockedWeights, adminLockedWeights, variableTotalWeight, stableTotalWeight, adminTotalWeight]
  const chainResponse = await Promise.all([
    Multicall(variableDataCalls, 'gauge', CHAIN_ID, 'rpc', _provider),
    Multicall(stableDataCalls, 'gauge', CHAIN_ID, 'rpc', _provider),
    Multicall(adminDataCalls, 'gauge', CHAIN_ID, 'rpc', _provider),
    Multicall(variableERC20Calls, 'pairV2', CHAIN_ID, 'rpc', _provider),
    Multicall(stableERC20Calls, 'pairV2', CHAIN_ID, 'rpc', _provider),
    Multicall(adminERC20Calls, 'pairV2', CHAIN_ID, 'rpc', _provider),
    Multicall(
      variableLockedWeightsCalls,
      'gaugeproxyV3',
      CHAIN_ID,
      'rpc',
      _provider,
    ),
    Multicall(
      stableLockedWeightsCalls,
      'gaugeproxyV3',
      CHAIN_ID,
      'rpc',
      _provider,
    ),
    Multicall(adminWeightsCalls, 'gaugeproxyV3', CHAIN_ID, 'rpc', _provider),
    variableContract.lockedTotalWeight(),
    stableContract.lockedTotalWeight(),
    adminContract.totalWeight(),
    Multicall(masterChefCalls, 'masterchef', CHAIN_ID, 'rpc', _provider),
  ]);

  const totalAllocPoint = new BigNumber(
    chainResponse[12][3].response[0].toString(),
  );
  const variableAlloc = new BigNumber(
    chainResponse[12][0].response[1].toString(),
  );
  const stableAlloc = new BigNumber(
    chainResponse[12][1].response[1].toString(),
  );
  const adminAlloc = new BigNumber(chainResponse[12][2].response[1].toString());

  const variableShare = variableAlloc.div(totalAllocPoint);
  const stableShare = stableAlloc.div(totalAllocPoint);
  const adminShare = adminAlloc.div(totalAllocPoint);

  const data: any = [[], [], []];
  const unionGauges = [variableGauges, stableGauges, adminGauges];
  const unionTokens = [variableTokens, stableTokens, adminTokens];

  [variableLps, stableLps, adminLps].forEach((lps, x) => {
    const loc = data[x];
    let doubleCountEven = 0;
    let doubleCountOdd = 1;
    lps.forEach((lp, y) => {
      loc.push({
        address: lp,
        gaugeAddress: unionGauges[x][y],
        rewardRate: chainResponse[x][doubleCountEven].response[0].toString(),
        derivedSupply: chainResponse[x][doubleCountOdd].response[0].toString(),
        weight: chainResponse[x + 6].length
          ? chainResponse[x + 6][y].response[0].toString()
          : null,
        liquidityShare: formatUnits(
          chainResponse[x + 3][doubleCountEven].response[0].toString(),
          18,
        ).toString(),
        stable: chainResponse[x + 3][doubleCountOdd].response[0],
        token0: unionTokens[x][doubleCountEven],
        token1: unionTokens[x][doubleCountOdd],
        type: ['variable', 'stable', 'admin'][x],
      });
      doubleCountOdd += 2;
      doubleCountEven += 2;
    });
  });

  const [variableGaugesData, stableGaugesData, adminGaugesData] = data;
  const variableTotalLocked = chainResponse[9].toString();
  const stableTotalLocked = chainResponse[10].toString();
  const adminTotalLocked = chainResponse[11].toString();

  return {
    variableGauges: variableGaugesData,
    stableGauges: stableGaugesData,
    adminGauges: adminGaugesData,
    variableTotalLocked,
    stableTotalLocked,
    adminTotalLocked,
    variableShare,
    stableShare,
    adminShare,
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

  const [reserves, supply, ftmUSDC, ftmSpirit] = await Promise.all([
    Multicall(reserveCalls, 'pairV2', CHAIN_ID, 'rpc', _provider),
    Multicall(totalSupplyCalls, 'pairV2', CHAIN_ID, 'rpc', _provider),
    Multicall(ftmUSDCCall, 'pairV2', CHAIN_ID, 'rpc', _provider),
    Multicall(ftmSpiritCall, 'pairV2', CHAIN_ID, 'rpc', _provider),
  ]);

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
      ).toString();
      return usdcFTMValue.times(reconcileReserves(ftmReserve, totalSupply));
    } else if (tokenAddresses.includes(USDC.address.toLowerCase())) {
      const usdcReserve = (
        checkAddress(token0, USDC.address) ? reserve0 : reserve1
      ).toString();
      return reconcileReserves(
        formatUnits(usdcReserve, 6),
        formatUnits(totalSupply, 18),
      );
    } else if (tokenAddresses.includes(SPIRIT.address.toLowerCase())) {
      const spiritReserve = (
        checkAddress(token0, SPIRIT.address) ? reserve0 : reserve1
      ).toString();
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
        reserves[doubleCountEven].response[0].toString(),
        reserves[doubleCountOdd].response[0].toString(),
        supply[count].response[0].toString(),
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

export const getLiquityPoolStatistics24hs = async (_address: string) => {
  const pool24hsDataFromCovanlent = await getHistoricalPortfolioValue(
    _address,
    true,
  );
  const finalDataArray: {
    lpAddress: string;
    quoteRate24hs: number;
  }[] = [];

  pool24hsDataFromCovanlent.forEach(item => {
    const quoteRate24hs = item.holdings[1].quote_rate;
    if (quoteRate24hs) {
      finalDataArray.push({
        lpAddress: item.contract_address,
        quoteRate24hs: quoteRate24hs,
      });
    }
  });

  return finalDataArray;
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
    variableTotalLocked,
    stableTotalLocked,
    adminTotalLocked,
    variableShare,
    stableShare,
    adminShare,
  } = gaugeChainData;

  const totalData = [...variableGauges, ...stableGauges, ...adminGauges];

  // Here's where we call stable and weighted data
  const masterFarms: (IFarm | null)[] = await Promise.all(
    totalData.map(async (farm, i) => {
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
      const rewardBase = gaugeRewardPerYear.div(totalDerivedBalance).toString();

      let totalLocked;
      if (farm.type === 'admin') {
        totalLocked = new BigNumber(adminTotalLocked);
      } else if (farm.type === 'stable') {
        totalLocked = new BigNumber(stableTotalLocked);
      } else {
        totalLocked = new BigNumber(variableTotalLocked);
      }

      farm.multiplier = gaugeWeight
        .div(totalLocked)
        .times(
          farm.type === 'variable'
            ? variableShare
            : farm.type === 'stable'
            ? stableShare
            : adminShare,
        )
        .times(100);

      if (tokens[0] && tokens[1]) {
        farm.lpSymbol = `${tokens[0].symbol}-${tokens[1].symbol}`;
      } else {
        farm.lpSymbol = '';
      }

      farm.label = farm.type || 'NMC';

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

      const type = farm?.stable ? 'stable' : 'variable';

      const lp: IFarm = {
        title: farm?.lpSymbol
          .replace('WFTM', 'FTM')
          .replace(' LP', '')
          .replace('-', ' + '),
        tokens: [...tokens.map(token => token && token.symbol)],
        lpAddress: farm.address,
        gaugeAddress: farm?.gaugeAddress,
        aprLabel: 'APY',
        apr: maxApy.toFormat(2) === 'NaN' ? '0' : maxApy.toFormat(2),
        boosted: true,
        lpApr: '0',
        label: farm.label || '',
        rewardToken: farm?.rewardToken,
        totalLiquidity,
        totalSupply: farm.liquidityShare,
        aprRange: maxApy.toFormat(2) === 'NaN' ? ['0', '0'] : AprRange,
        boostFactor: '1',
        yourApr: minApy.isFinite() ? minApy.toString() : '0',
        valid: tokens.length > 0,
        multiplier: farm.multiplier
          ? farm.multiplier.isFinite()
            ? farm.multiplier.toString()
            : '0.00'
          : '0.00',
        holdAmountForMaxBoost: '1',
        progress: 0,
        spiritEarned: '0.0',
        spiritEarnedMoney: '0.0',
        lpTokens: '0.00',
        stable: farm.stable,
        lpTokensMoney: '0.00',
        type,
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

  return eternalFarmings.map((farming, index) => {
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
      apr: '2',
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
      // apr: aprs && aprs[farming.id] ? aprs[farming.id] : 0,
      // tvl: tvls && tvls[farming.id] && ethPrice ? Math.round(tvls[farming.id] * ethPrice) : 0
    };
  });
};

export const getGauges = async provider => {
  if (provider && provider._network.chainId === CHAIN_ID) {
    const gaugeProxy = 'gaugeproxy';
    const gaugeProxyV2 = 'gaugeproxyV3';
    const gaugeProxyStable = 'stableproxy';
    const gaugeAddress = addresses.gauge[CHAIN_ID];
    const gaugeAddressV2 = addresses.gaugeV3[CHAIN_ID];
    const gaugeAddressStable = addresses.stableProxy[CHAIN_ID];

    const promiseV1 = Contract(
      gaugeAddress,
      gaugeProxy,
      undefined,
      undefined,
      provider,
    );
    const promiseV2 = Contract(
      gaugeAddressV2,
      gaugeProxyV2,
      undefined,
      undefined,
      provider,
    );
    const promiseStable = Contract(
      gaugeAddressStable,
      gaugeProxyStable,
      undefined,
      undefined,
      provider,
    );

    const [contractV1, contractV2, contractStable] = await Promise.all([
      promiseV1,
      promiseV2,
      promiseStable,
    ]);

    const [tokens, tokensV2, tokensStable] = await Promise.all([
      contractV1.tokens(),
      contractV2.tokens(),
      contractStable.tokens(),
    ]);
    const arrays = { tokens, tokensV2, tokensStable };
    const gauges = { gaugeAddress, gaugeAddressV2, gaugeAddressStable };
    const [
      gaugesParamsV1,
      gaugesParamsV2,
      gaugesParamsStable,
      weightParamsV1,
      weightParamsV2,
      weightParamsStable,
    ] = formatFarmsCalls({ arrays, gauges });

    const v1GaugesMulticall = Multicall(
      gaugesParamsV1,
      gaugeProxy,
      CHAIN_ID,
      'rpc',
      provider,
    );
    const v1WeightMulticall = Multicall(
      weightParamsV1,
      gaugeProxy,
      CHAIN_ID,
      'rpc',
      provider,
    );
    const v2GaugesMulticall = Multicall(
      gaugesParamsV2,
      gaugeProxyV2,
      CHAIN_ID,
      'rpc',
      provider,
    );
    const v2WeightMulticall = Multicall(
      weightParamsV2,
      gaugeProxyV2,
      CHAIN_ID,
      'rpc',
      provider,
    );
    const stableGaugesMulticall = Multicall(
      gaugesParamsStable,
      gaugeProxyStable,
      CHAIN_ID,
      'rpc',
      provider,
    );
    const stableWeightMulticall = Multicall(
      weightParamsStable,
      gaugeProxyStable,
      CHAIN_ID,
      'rpc',
      provider,
    );

    const [
      v1GaugesResults,
      v1WeightResults,
      v2GaugesResults,
      v2WeightResults,
      stableGaugesResults,
      stableWeightResults,
    ] = await Promise.all([
      v1GaugesMulticall,
      v1WeightMulticall,
      v2GaugesMulticall,
      v2WeightMulticall,
      stableGaugesMulticall,
      stableWeightMulticall,
    ]);

    const { v1Gauges, v2Gauges, stableGauges } = getSplitCalls({
      tokens,
      v1GaugesResults,
      v1WeightResults,
      tokensV2,
      v2GaugesResults,
      v2WeightResults,
      tokensStable,
      stableGaugesResults,
      stableWeightResults,
    });

    return {
      v1Gauges,
      v2Gauges,
      stableGauges,
    };
  }
  return { v1Gauges: [], v2Gauges: [], stableGauges: [] };
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
