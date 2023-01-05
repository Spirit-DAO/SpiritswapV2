import {
  addressToToken,
  tokensNames,
} from 'app/pages/SpiritWars/spiritWarsHelpers';
import {
  StatisticsProps,
  StatisticsToken,
} from 'app/pages/SpiritWars/components/Statistics';
import { formatAmount, getCircularReplacer, Token } from 'app/utils';
import BigNumber from 'bignumber.js';
import {
  SPIRIT_TOKEN_ADDRESS,
  CHAIN_ID,
  BASE_TOKEN_ADDRESS,
  ONE_HOUR,
} from 'constants/index';
import {
  getGaugeBasicInfo,
  getGaugesPoolInfoWithMulticall,
  getInspiritStatistics,
  getLpTokenPrices,
  getMappedTokens,
  getMarketCap,
  getMasterChefPoolInfoWithMultiCall,
  getTokenUsdPrice,
  getTVL,
  loadFarmsList,
  saturateGauges,
} from 'utils/data';
import {
  getHistoricalPegForWinSpirits,
  handleSpiritWarsCache,
} from 'utils/data/spiritwars';

onmessage = ({ data: { type, provider, isLoggedIn } }) => {
  const loadedProvider = JSON.parse(provider);
  if (!loadedProvider._network) {
    loadedProvider._network = {
      chainId: CHAIN_ID,
    };
  }
  // Save a process, write a promise
  const gaugesPromise = getGaugeBasicInfo(loadedProvider);

  switch (type) {
    case 'getFarms':
      getFarms(loadedProvider, gaugesPromise);
      break;
    case 'getSpiritWarsData':
      getSpiritWarsData(loadedProvider);
      break;
    case 'getSpiritStatistics':
      getSpiritStatistics(loadedProvider);
      break;
    case 'getBoostedGauges':
      if (isLoggedIn) break;
      saturateGauges(gaugesPromise, BASE_TOKEN_ADDRESS).then(data => {
        self.postMessage({
          type: 'setSaturatedGauges',
          payload: data,
        });
      });
      break;
  }
};

// =========================
// ======= General =========
// =========================

export async function getSpiritStatistics(provider) {
  const data = await getInspiritStatistics(provider);
  const { spiritPerBlock } = await getMasterChefPoolInfoWithMultiCall(provider);

  // new BigNumber(spiritPerBlock).toNumber()
  const { totalLocked, spiritInfo, totalLockedValue } = data;
  const { marketCap, spiritTotalSupply: totalSupply } = await getMarketCap(
    +totalLocked,
    spiritInfo.price,
  );
  const TVL = await getTVL(totalLockedValue);

  data['marketCap'] = marketCap;
  data['tvl'] = TVL;
  data['spiritperblock'] = spiritPerBlock;
  data['spiritssupply'] = totalSupply;

  self.postMessage({
    type: 'setSpiritStatistics',
    payload: data,
  });
}

// =========================
// ======== Farms ==========
// =========================

async function getFarms(provider, gaugesPromise) {
  if (provider && provider._network.chainId === CHAIN_ID) {
    const lpTokensPricePromise = getLpTokenPrices(gaugesPromise, provider).then(
      data => {
        self.postMessage({
          type: 'setLpPrices',
          payload: JSON.stringify(data, getCircularReplacer()),
        });
        return data;
      },
    );

    const spiritPricePromise = getTokenUsdPrice(SPIRIT_TOKEN_ADDRESS);

    const fullGaugePromise = getGaugesPoolInfoWithMulticall(
      gaugesPromise,
      provider,
    );

    const [gaugeChainData, spiritPriceRaw, lpTokensPrice, mappedTokens]: [
      any,
      BigNumber,
      any,
      any,
    ] = await Promise.all([
      fullGaugePromise,
      spiritPricePromise,
      lpTokensPricePromise,
      getMappedTokens('address'),
    ]);

    const farmData = await loadFarmsList(
      gaugeChainData,
      spiritPriceRaw,
      lpTokensPrice,
      mappedTokens,
    );

    self.postMessage({
      type: 'setFarmMasterData',
      payload: JSON.stringify(farmData, getCircularReplacer()),
    });
  }
}

async function getEcosystemTokenDetails(
  farm: any,
  getTokensDetails,
  ecosystemFarmObject,
  type,
) {
  const [firstTokenDetails, secondTokenDetails] = await Promise.all([
    getTokensDetails(farm.token0),
    getTokensDetails(farm.token1),
  ]);

  const lpAddress = farm[3];
  const tokenAddress = farm[4];
  const ecoFarms = ecosystemFarmObject(
    farm,
    firstTokenDetails,
    secondTokenDetails,
    lpAddress,
    tokenAddress,
    type,
  );

  return ecoFarms;
}

// =========================
// ===== Spirit Wars =======
// =========================

async function getSpiritWarsData(provider) {
  const data = await handleSpiritWarsCache(
    'https://www.defiwars.xyz/api/spirit/inspirit-balances',
    ONE_HOUR, // 1 hour
  );

  const stats: StatisticsProps = {
    totalInSpiritSupply: format(data.inSpirit.supply),
    circulatingSpirit: format(data.spirit.circulating),
    averagePeg: 0,
    projects: data.holders.length,
  };

  await extractSpiritWarsData(data, stats);
}

async function extractSpiritWarsData({ holders: tokens }, stats) {
  let tokenDistribution: StatisticsToken[] = [];
  let sumPercentajes = 0;
  let sumPercetajePerPeg = 0;

  const listProjectTokens = tokens
    .map(project => project.holder.tokenAddress)
    .filter(item => item);

  const pegChartData = await getHistoricalPegForWinSpirits(listProjectTokens);

  const data: Token[] = await Promise.all(
    tokens.map(async token => {
      let {
        projectLink,
        color,
        tokenAddress = '',
        tokenName = '',
      } = token.holder;

      const inSpiritHoldings = format(token.balance);
      const projectName = addressToToken[tokenAddress] || 'Millennium Club';

      tokenDistribution.push({
        name: tokenName,
        distribution: token.percentOfTotal,
        color,
        project: projectName,
      });

      const inSpiritHoldingPercent = (
        Number(token.percentOfTotal) * 100
      ).toFixed(2);
      const inSpiritHolderAddress = token.holder.addresses[0];

      let pegFor100k = '';

      if (tokenAddress !== '') {
        ({ peg: pegFor100k } = await getPegFor100KOfToken(tokenAddress));

        pegFor100k = (Number(pegFor100k) * 100).toFixed(2);

        sumPercetajePerPeg += +inSpiritHoldingPercent * +pegFor100k;

        sumPercentajes += +inSpiritHoldingPercent;
      }

      return {
        tokenAddress,
        projectName,
        tokenName: tokensNames[token.holder.tokenName],
        inSpiritHoldings,
        inSpiritHoldingPercent,
        pegFor100k,
        inSpiritHolderAddress,
        projectLink,
        color,
      };
    }),
  );

  const averagePeg = (sumPercetajePerPeg / sumPercentajes).toFixed(2);

  self.postMessage({
    type: 'setSpiritWarsStatistics',
    payload: {
      ...stats,
      averagePeg,
      tokenDistribution,
      pegChartData,
    },
  });

  self.postMessage({
    type: 'setSpiritWarsData',
    payload: data,
  });
}

async function getPegFor100KOfToken(token: string) {
  return await handleSpiritWarsCache(
    `https://www.defiwars.xyz/api/quote?network=Fantom&fromAddress=${token}&toAddress=0x5cc61a78f164885776aa610fb0fe1257df78e59b&amount=100000&source=firebird`,
    0.5 * ONE_HOUR, // half hour
  );
}

function format(value: string, decimals: number = 0): string {
  return Number(formatAmount(value, decimals)).toLocaleString('en-US');
}
