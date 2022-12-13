import { getBalanceNumber } from 'app/utils';
import BigNumber from 'bignumber.js';
import { LiFi } from 'config/lifi';
import contracts from 'constants/contracts';
import {
  CHAIN_ID,
  ONE_HOUR,
  SPIRITSWAP_UNITROLLER_OLA_FINANCE,
  tokens as localTokens,
} from 'constants/index';
import { formatEther } from 'ethers/lib/utils';
import { client, clientV2 } from 'utils/apollo/client';
import {
  GET_TOTAL_VALUE,
  GET_TOTAL_VALUEV2,
} from 'utils/apollo/queries/getTotalValue';
import { Call, Contract, Multicall } from 'utils/web3';

export const getMarketCap = async (
  spiritLocked: number,
  spiritPrice: number,
) => {
  try {
    const calls: Call[] = [
      {
        address: contracts.spirit[CHAIN_ID],
        name: 'balanceOf',
        params: ['0x4D5362dd18Ea4Ba880c829B0152B7Ba371741E59'],
      },
      {
        address: contracts.spirit[CHAIN_ID],
        name: 'balanceOf',
        params: ['0x07E820762910672613636D44c6e70954A6C6052a'],
      },
      {
        address: contracts.spirit[CHAIN_ID],
        name: 'balanceOf',
        params: ['0x513a6e7C37B010B9a4d6fb73204759934d7e8c46'],
      },
      {
        address: contracts.spirit[CHAIN_ID],
        name: 'balanceOf',
        params: ['0xE2c37B0741FCb431A32973e5337dc0388a8666b7'],
      },
      {
        address: contracts.spirit[CHAIN_ID],
        name: 'balanceOf',
        params: [contracts.spiritSwapBuner[CHAIN_ID]],
      },
      {
        address: contracts.spirit[CHAIN_ID],
        name: 'totalSupply',
      },
    ];

    const response = await Multicall(calls, 'erc20');

    const mainWalletBalance: BigNumber = response[0].response.balance;
    const vestingFund: BigNumber = response[1].response.balance;
    const teamFund: BigNumber = response[2].response.balance;
    const daoFund: BigNumber = response[3].response.balance;
    const totalBurnedBalance: BigNumber = response[4].response.balance;
    const [totalSupply] = response[5].response;

    const circSupply = totalSupply
      ? totalSupply.sub(totalBurnedBalance)
      : new BigNumber(0);

    const marketCapSupply = getBalanceNumber(
      circSupply
        .sub(mainWalletBalance)
        .sub(teamFund)
        .sub(daoFund)
        .sub(vestingFund),
    );

    const spiritTotalSupply = getBalanceNumber(totalSupply, 18);

    const marketCap = spiritPrice * (marketCapSupply - spiritLocked);

    return { marketCap, spiritTotalSupply };
  } catch (err) {
    throw new Error(`${err}`);
  }
};

export const getTVL = async (spiritLockedValue: number) => {
  try {
    const { data } = await client.query({
      query: GET_TOTAL_VALUE,
      fetchPolicy: 'cache-first',
    });
    const { data: dataV2 } = await clientV2.query({
      query: GET_TOTAL_VALUEV2,
      fetchPolicy: 'cache-first',
    });

    const olaLensContract = await Contract(
      contracts.olaLens[CHAIN_ID],
      'olaLens',
    );
    const olaResponse = await olaLensContract.callStatic.viewLendingNetwork(
      SPIRITSWAP_UNITROLLER_OLA_FINANCE,
    );

    const totalLiquidity = Number(
      data.spiritswapFactories[0].totalLiquidityUSD,
    );
    const totalLiquidityV2 = Number(dataV2.uniswapFactory.totalLiquidityUSD);
    const TVL =
      totalLiquidity +
      totalLiquidityV2 +
      spiritLockedValue +
      +formatEther(olaResponse.totalSupply);

    return TVL;
  } catch (err) {
    throw new Error(`${err}`);
  }
};

export const getMappedTokens = async (by: string) => {
  const cache = await caches.open('spirit-cache');
  const mappedTokens: any = await cache.match(`lifi/tokens/${by}`);
  let shouldFetch = false;

  if (mappedTokens) {
    const parsed = await mappedTokens.json();
    if (
      !parsed.cacheTime ||
      Date.now() - parsed.cacheTime > 2 * ONE_HOUR // 2 hours
    ) {
      // 2 Hours
      shouldFetch = true;
    } else {
      return parsed;
    }
  }

  if (!mappedTokens || shouldFetch) {
    const { tokens } = await LiFi.getPossibilities({
      include: ['tokens'],
      chains: [CHAIN_ID],
    });
    const tokenMap = {};
    [...(tokens ?? []), ...localTokens].forEach(token => {
      const key = token[by].toLowerCase();
      tokenMap[key] = token;

      if (by === 'symbol') {
        if (key === 'weth' || key === 'wbtc') {
          tokenMap[key.replace('w', '')] = token;
        }
      }
    });
    await cache.put(
      `lifi/tokens/${by}`,
      new Response(JSON.stringify({ ...tokenMap, cacheTime: new Date() })),
    );
    return tokenMap;
  }
};
