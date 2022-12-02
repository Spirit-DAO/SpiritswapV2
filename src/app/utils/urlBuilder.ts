import { REACT_APP_COVALENT_API, REACT_APP_SWING_API } from 'constants/index';

const createTemplateUrl = (strings, ...keys) => {
  return (...values) => {
    let dict = values[values.length - 1] || {};
    let result = [strings[0]];
    keys.forEach(function (key, i) {
      let value = Number.isInteger(key) ? values[key] : dict[key];
      result.push(value, strings[i + 1]);
    });
    return result.join('');
  };
};

const buildQueryParams = (queryParams: { [key: string]: string }) => {
  const keys = Object.keys(queryParams);
  const params = keys.reduce((acc, val, i) => {
    const params = `${acc}${val}=${queryParams[val]}`;
    return i === keys.length - 1 ? params : `${params}&`;
  }, '?');
  return params;
};

export const UrlHeadTemplate = {
  covalent: `${REACT_APP_COVALENT_API}`,
  swing: `${REACT_APP_SWING_API}`,
};

export const UrlTailTemplates = {
  historicalByAddress: createTemplateUrl`/pricing/historical_by_addresses_v2/${'chainId'}/USD/${'_addresses'}/`,
  historicalPortfolioValue: createTemplateUrl`/${'chainId'}/address/${'_addresses'}/portfolio_v2/`,
  balance: createTemplateUrl`/${'_chainId'}/address/${'_address'}/balances_v2/`,
  pools: createTemplateUrl`/${'chainId'}/xy=k/spiritswap/pools/`,
  poolsV2: createTemplateUrl`/${'chainId'}/spiritswap_v2/pools/`,
  spiritV2Pairs: createTemplateUrl`/${'chainId'}/spiritswap_v2/tokens/address/${'_tokenAddress'}/`,
  poolsAddress: createTemplateUrl`/${'chainId'}/xy=k/spiritswap/pools/address/${'_lpAddress'}/`,
  poolsAddressV2: createTemplateUrl`/${'chainId'}/spiritswap_v2/pools/address/${'_lpAddress'}/`,
  tokensAddress: createTemplateUrl`/${'chainId'}/xy=k/spiritswap/tokens/address/${'_tokenAddress'}/`,
  allowance: createTemplateUrl`/allowance`,
  approve: createTemplateUrl`/approve`,
  quote: createTemplateUrl`/quote`,
  send: createTemplateUrl`/send`,
  history: createTemplateUrl`/history`,
  sign: createTemplateUrl`/sign`,
  claim: createTemplateUrl`/claim`,
};

type ApiTypes = 'covalent' | 'swing';

interface ApiUrlParams {
  apiName: ApiTypes;
  pathName: string;
  innerParams?: { [key: string]: any };
  queryParams?: { [key: string]: any };
}

export const getApiUrl = ({
  apiName,
  pathName,
  innerParams,
  queryParams,
}: ApiUrlParams) => {
  const head = `${UrlHeadTemplate[apiName]}${UrlTailTemplates[pathName](
    innerParams,
  )}`;

  const tail = queryParams ? buildQueryParams(queryParams) : '';
  return `${head}${tail}`;
};
