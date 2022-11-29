import { CHAIN_ID, COVALENT_API_KEY } from 'constants/index';
import { Address, QuoteToken } from 'constants/types';
import { tokenData } from './types';
import { EcosystemFarmType } from 'app/interfaces/Farm';
import { getApiUrl } from 'app/utils/urlBuilder';
import { LpRewardData, Token } from 'app/interfaces/General';
import { CHART_LABELS_POINTS, formatAmount, isVerifiedToken } from 'app/utils';
import moment from 'moment';

export const request = async (_url: string, _shouldCache: boolean = true) => {
  try {
    const controller = new AbortController();
    const { signal } = controller;

    const response = await fetch(_url, { signal });

    return response.json();
  } catch (e) {
    return { data: null };
  }
};

export interface PoolToken {
  contract_ticker_symbol: string;
  contract_name: string;
  volume_in_24h?: number;
  contract_address: string;
}

export interface PoolData {
  exchange: string;
  token_0: PoolToken;
  token_1: PoolToken;
  volume_in_24h: string;
  total_liquidity_quote: number;
  total_supply: string;
  quote_rate: number;
  fee_24h_quote: string;
  volume_24h_quote: string;
  lpApyNumber: number;
  lpApy: string;
  aprRange: string[];
}

export interface FarmConfig {
  lpAddress?: string;
  pid: number;
  lpSymbol: string;
  lpAddresses: Address;
  tokenSymbol: string;
  tokenAddresses: Address;
  gaugeAddressH?: string;
  quoteTokenSymbol: QuoteToken;
  quoteTokenAdresses: Address;
  multiplier?: string;
  liquidityShare?: string;
  isTokenOnly?: boolean;
  isStakingPool?: boolean;
  isLPToken?: boolean;
  isCommunity?: boolean;
  isApe?: boolean;
  isPsc?: boolean;
  isBoosted?: boolean;
  isOldPsc?: boolean;
  isGauge?: boolean;
  dual?: {
    rewardPerBlock: number;
    earnLabel: string;
    endBlock: number;
  };
  gaugeAddress?: string;
  ecosystem?: EcosystemFarmType;
  rewardToken?: string;
  rewardBase?: string;
  name?: string; // Weighted pools have names
  type?: string | undefined;
  label?: string;
  tokens?: Token[];
  address?: string;
  rewards?: LpRewardData;
}

export interface FarmConfigWithStatistics extends FarmConfig {
  statistics: PoolData;
}

export const getWalletData = async (_address: string, _chainId = CHAIN_ID) => {
  const source = getApiUrl({
    apiName: 'covalent',
    pathName: 'balance',
    innerParams: { _chainId, _address },
    queryParams: { key: COVALENT_API_KEY },
  });
  const response = await request(source, false);

  return response.data;
};

export const getLiquidityPoolsData = async (chainId = CHAIN_ID) => {
  const source = getApiUrl({
    apiName: 'covalent',
    pathName: 'pools',
    innerParams: { chainId },
    queryParams: {
      'page-size': 1000,
      'quote-currency': 'USD',
      key: COVALENT_API_KEY,
    },
  });
  const { data } = await request(source);

  if (data && data.items) {
    const response: PoolData[] = data.items;
    return response;
  }

  return [];
};

export const getLiquidityPoolsDataV2 = async (chainId = CHAIN_ID) => {
  const source = getApiUrl({
    apiName: 'covalent',
    pathName: 'poolsV2',
    innerParams: { chainId },
    queryParams: {
      'page-size': 1000,
      'quote-currency': 'USD',
      key: COVALENT_API_KEY,
    },
  });
  const { data } = await request(source);

  if (data && data.items) {
    const response: PoolData[] = data.items;
    return response;
  }

  return [];
};

export const getLiquityPoolData = async (
  _lpAddress: string,
  chainId = CHAIN_ID,
) => {
  const source = getApiUrl({
    apiName: 'covalent',
    pathName: 'poolsAddress',
    innerParams: { chainId, _lpAddress },
    queryParams: { key: COVALENT_API_KEY },
  });

  const { data } = await request(source);
  if (data && data.items) {
    const [pool] = data.items;

    return pool;
  }

  return undefined;
};

export const getLiquityPoolDataV2 = async (
  _lpAddress: string,
  chainId = CHAIN_ID,
) => {
  const source = getApiUrl({
    apiName: 'covalent',
    pathName: 'poolsAddressV2',
    innerParams: { chainId, _lpAddress },
    queryParams: { key: COVALENT_API_KEY },
  });

  try {
    const { data } = await request(source);
    if (data && data.items) {
      const [pool] = data.items;

      return pool;
    }
  } catch (e) {
    return [];
  }

  return [];
};

// Gets token and price data from address array provided
//
export const getTokensDetails = async (
  _addresses: string[],
  chainId = CHAIN_ID,
) => {
  const to = moment().format('YYYY-MM-DD');
  const from = moment().subtract(1, 'days').format('YYYY-MM-DD');

  const source = getApiUrl({
    apiName: 'covalent',
    pathName: 'historicalByAddress',
    innerParams: { chainId, _addresses },
    queryParams: {
      from,
      to,
      key: COVALENT_API_KEY,
      'quote-currency': 'USD',
      format: 'JSON',
    },
  });

  const { data } = await request(source);

  if (data && data.length > 0) {
    const walletItems: tokenData[] = data.map(tokenData => ({
      address: tokenData.contract_address,
      amount: '0',
      full_name: tokenData.contract_name,
      liquidity: false,
      name: tokenData.contract_ticker_symbol,
      rate: tokenData.items[0]?.price,
      rate_24: tokenData.items[1]?.price,
      staked: false,
      symbol: tokenData.contract_ticker_symbol,
      title: tokenData.contract_name,
      tokens: [tokenData.contract_name],
      usd: '0',
      usd_24: '0',
      percentaje_change_24:
        ((tokenData.items[0]?.price - tokenData.items[1]?.price) /
          tokenData.items[1]?.price) *
        100,
    }));

    return walletItems;
  }

  return [];
};

export const getTokenPoolInfo = async (
  _tokenAddress: string,
  chainId = CHAIN_ID,
) => {
  const source = getApiUrl({
    apiName: 'covalent',
    pathName: 'tokensAddress',
    innerParams: { chainId, _tokenAddress },
    queryParams: { key: COVALENT_API_KEY },
  });
  const { data } = await request(source);
  if (data && data.items) {
    const [pool] = data.items;

    return pool;
  }

  return undefined;
};

export const getTokenUsdPrice = async (
  tokenAddress: string,
  chainId = CHAIN_ID,
) => {
  const source = getApiUrl({
    apiName: 'covalent',
    pathName: 'historicalByAddress',
    innerParams: { chainId, _addresses: tokenAddress },
    queryParams: {
      'quote-currency': 'USD',
      format: 'JSON',
      key: COVALENT_API_KEY,
    },
  });

  const { data } = await request(source);

  if (data && data[0].prices[0]) {
    const response = data[0].prices[0].price;
    if (response === null) return 0;
    return response;
  }

  return null;
};

export const getHistoricalPortfolioValue = async (
  tokenAddress: string,
  getLpsData?: boolean,
  chainId = CHAIN_ID,
) => {
  const _addresses = tokenAddress;
  const source = getApiUrl({
    apiName: 'covalent',
    pathName: 'historicalPortfolioValue',
    innerParams: { chainId, _addresses },
    queryParams: {
      'quote-currency': 'USD',
      // '&days': '365',
      format: 'JSON',
      key: COVALENT_API_KEY,
    },
  });

  const { data } = await request(source);

  if (getLpsData && data && data.items) {
    const lpsTokens = data.items.filter(
      item =>
        item.contract_ticker_symbol === 'SPIRIT-LP' ||
        item.contract_ticker_symbol === 'spLP',
    );

    return lpsTokens;
  }

  let finalArray: number[] = new Array(30).fill(0);
  let datesArray: string[] = new Array(30).fill('');

  if (data && data.items) {
    const whiteListedTokens = data.items.filter(token => {
      if (token.contract_ticker_symbol === 'FTM') return token;
      return isVerifiedToken(token.contract_address);
    });

    for (let i = 0; i < finalArray.length; i++) {
      for (let j = 0; j < whiteListedTokens.length; j++) {
        const item = whiteListedTokens[j].holdings[i];

        if (CHART_LABELS_POINTS.includes(i)) {
          const date = moment(item.timestamp).format('DD-MMM');
          datesArray[datesArray.length - (i + 1)] = date;
        } else {
          datesArray[datesArray.length - (i + 1)] = '-';
        }

        const decimals = whiteListedTokens[j].contract_decimals;
        const balance = formatAmount(item.close.balance, decimals);
        const quoteRate = item.quote_rate;

        const balanceUSD = +balance * quoteRate;
        finalArray[finalArray.length - (i + 1)] += balanceUSD;
      }
    }

    return {
      valuesArray: finalArray,
      datesArray: datesArray,
    };
  }

  return {
    valuesArray: finalArray,
    datesArray: datesArray,
  };
};
