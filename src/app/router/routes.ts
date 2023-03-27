import { SPIRIT_DOCS_URL } from 'constants/index';

export const HOME = {
  key: 'home',
  path: 'home',
};

export const SWAP = {
  key: 'swap',
  path: 'swap',
};

export const BRIDGE = {
  key: 'bridge',
  path: 'bridge',
};

export const LIQUIDITY = {
  key: 'liquidity',
  path: 'liquidity',
};

export const FARMS = {
  key: 'farms',
  path: 'farms',
};

export const INSPIRIT = {
  key: 'inSpirit',
  path: 'inspirit',
};

export const LENDANDBORROW = {
  key: 'lendBorrow',
  path: '',
  url: 'https://app.ola.finance/networks/0x892701d128d63c9856A9Eb5d967982F78FD3F2AE/markets',
};

export const STORE = {
  key: 'store',
  path: '',
  url: 'https://spiritswap.store/',
};

export const ANALYTICS = {
  key: 'analytics',
  path: '',
  url: 'https://analytics.spiritswap.finance/home',
};

export const IDO = {
  key: 'ido',
  path: '',
  url: 'https://starter.investments/#/ftm',
};

export const NFTS = {
  key: 'nfts',
  path: '',
  url: 'https://www.nftgarage.app/fnfts/fantom/inspirit',
};

export const DOCS = {
  key: 'docs',
  path: '',
  url: SPIRIT_DOCS_URL,
};

export const APEMODE = {
  key: 'apemode',
  path: 'apemode',
  url: '',
};

export const GOVERNANCE = {
  key: 'governance',
  path: '',
  url: 'https://commonwealth.im/spiritswap/',
};

export const SPIRITWARS = {
  key: 'spiritwars',
  path: 'spiritwars',
  url: '',
};

export const BUYFTM = {
  key: 'buyftm',
  path: '',
  url: 'https://spiritswap.banxa.com/',
};

export const APEMODE_V1 = {
  key: 'apemode',
  path: '',
  url: 'https://swap.spiritswap.finance/#/exchange/apemode',
};

export const ROUTE_LOOKUP = {
  [HOME.key]: HOME,
  [SWAP.key]: SWAP,
  // [BRIDGE.key]: BRIDGE,
  [LIQUIDITY.key]: LIQUIDITY,
  [FARMS.key]: FARMS,
  [INSPIRIT.key]: INSPIRIT,
  // [LENDANDBORROW.key]: LENDANDBORROW,
  [STORE.key]: STORE,
  [ANALYTICS.key]: ANALYTICS,
  [IDO.key]: IDO,
  // [NFTS.key]: NFTS,
  [DOCS.key]: DOCS,
  [APEMODE.key]: APEMODE,
  // [GOVERNANCE.key]: GOVERNANCE,
  [SPIRITWARS.key]: SPIRITWARS,
  // [BUYFTM.key]: BUYFTM,
};

export const resolveRoutePath = (path?: string) => {
  const rootPath = document.documentElement.dataset['rootPath'] || '/';
  return path ? `${rootPath}${path}` : rootPath;
};
