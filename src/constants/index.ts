import contracts from './contracts';
import { wBOMB } from './tokens';

export { NETWORK } from './networks';
export * from './tokens';

export enum ConnectorNames {
  Injected = 'injected',
  WalletConnect = 'walletconnect',
  Coin98 = 'coin98',
  WalletLink = 'walletlink',
  TrustWallet = 'trustwallet',
  CloverWallet = 'cloverwallet',
}

export const CHAIN_ID = 250; // I think this should be refactored
export const DEFAULT_HANDLER = 'spiritswap';

export const COVALENT_API_KEY = 'ckey_ce0907ce545344edb6d203df10e';

export const GELATO_ADDRESS = '0x59e61b95f20e940ac777e88fa2dfa0a6a4c40fa0';
export const GELATO_APPROVE_ADDRESS =
  '0x97C1af451407e266fD57168e61D4B5af31894244';
// 20 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 20;
export const CONNECTOR_LOCAL_STORAGE_KEY = 'SPIRIT_CONNECTOR_KEY';
export const SWAP_SLIPPAGE_TOLERANCE_INDEX_KEY = 'SPIRIT_SWAP_SLIPPAGE_INDEX';
export const SWAP_SLIPPAGE_TOLERANCE_VALUE_KEY = 'SPIRIT_SWAP_SLIPPAGE_VALUE';
export const SWAP_SLIPPAGE_TOLERANCE_CUSTOM_KEY = 'SPIRIT_SWAP_SLIPPAGE_CUSTOM';
export const SWAP_TRANSACTION_DEADLINE_IN_MINUTES_KEY =
  'SPIRIT_SWAP_TX_DEADLINE';
export const SWAP_CHART_MODE_KEY = 'SPIRIT_SWAP_CHART_MODE';
export const SWAP_TRADE_MODE_KEY = 'SPIRIT_SWAP_TRADE_MODE';
export const SAFE_EXECUTE_NUMBER_OF_ATTEMPTS = 5;
export const POLLING_INTERVAL = 1000 * 20; // web3 apis
export const DEFAULT_PROVIDER_NAME = 'ethers.js' || 'web3.js';
export const SPIRITSWAP_UNITROLLER_OLA_FINANCE =
  '0x892701d128d63c9856A9Eb5d967982F78FD3F2AE';
export const THROTTLE_TIME = 1000 * 20; // throttle waiting time
export const THROTTLE_CLEAR_TIME = 1000 * 60; // throttle clean time
export const LOADING_TIME = 1000 * 10; // loading time to unthrottle API calls
export const FAST_REFRESH_INTERVAL = 1000 * 10;
export const SLOW_REFRESH_INTERVAL = 1000 * 60;
export const SLOWEST_REFRESH_INTERVAL = 1000 * 60 * 60; // one hour
export const BLOCK_UPDATE_INTERVAL = 100; // How many blocks do we wait for updates to take place
export const ALLOW_V1_V2_MIGRATION = false;
export const WARNSLIP = 10;
export const LIMIT_PAY = 0;
export const LIMIT_PRICE = 1;
export const LIMIT_RECIEVE = 2;

// URLS
export const REACT_APP_NODE_1 = 'https://rpc.ankr.com/fantom';

export const REACT_APP_FACTORY_ADDRESS =
  '0xEF45d134b73241eDa7703fa787148D9C9F4950b0';
export const REACT_APP_PROXY_COVALENT_API = 'https://api.covalenthq.com/v1';
export const REACT_APP_PROXY_SWING_API =
  'https://swap.dev.swing.xyz/v0/transfer';
export const REACT_APP_COVALENT_API = 'https://api.covalenthq.com/v1';
export const REACT_APP_SWING_API = 'https://swap.dev.swing.xyz/v0/transfer';

export const BASE_TOKEN_ADDRESS = '0x0000000000000000000000000000000000000000';
export const USDC_FTM_LP_ADDRESS = '0x772bC1196C357F6E9c80e1cc342e29B3a5F05ef3';
export const SPIRIT_FTM_LP_ADDRESS =
  '0x912B333dDaFC925f63C9746E5115A2CD5290b59e';
export const SPIRIT_TOKEN_ADDRESS =
  '0x5Cc61A78F164885776AA610fb0FE1257df78E59B';
export const COVALENT_BASE_TOKEN_ADDRESS =
  '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
export const NOTIFICATIONS_STATE = {
  SUCCESS: 'SUCCESS',
  PENDING: 'PENDING',
  ERROR: 'ERROR',
};

export const TOKENS_TO_SHOW = {
  ALL: 'ALL',
  VERIFIED: 'VERIFIED',
  UNVERIFIED: 'UNVERIFIED',
};

export const PECK_SHIELD_AUDIT_URL =
  'https://github.com/Layer3Org/spiritswap-core/blob/main/PeckShield-Audit-Report-SpiritV2-v1.0.pdf';
export const ZOKYO_AUDIT_URL =
  'https://github.com/Layer3Org/spiritswap-core/blob/main/Zokyo%20SpiritSwap%20V2%20Audit.pdf';

export const SPIRIT_DOCS_URL = 'https://docs.spiritswap.finance/';

export const SPIRIT_WHITELISTING_FORMS = 'https://forms.gle/LqrWp7cGi7eXc6UR7';

export const BRIDGE_NAMES = {
  nxtp: 'Connext',
  hop: 'Hop',
  debridge: 'Debridge',
  anyswap: 'Anyswap',
  hyphen: 'Hyphen',
  across: 'across',
  wormhole: 'Wormhole',
};

export const BRIDGES_ALLOWED = [
  'hop',
  'cbridge',
  'multichain',
  'hyphen',
  'optimism',
  'polygon',
  'avalanche',
  'arbitrum',
];
export const EXCHANGE_ALLOWED = [
  'spiritswap',
  '1inch',
  'paraswap',
  'dodo',
  'uniswap',
  'quickswap',
  'honeyswap',
  'pancakeswap',
  'viperswap',
  'solarbeam',
  'steallaswap',
  'beamswap',
  'ubeswap',
];

export const BRIDGE_MODE = { cheap: 'Cheapest', fast: 'Fastest' };
export const BRIDGE_MODE_ID = {
  Cheapest: 0,
  Fastest: 1,
};
export const ONE_HOUR = 1000 * 60 * 60;
export const ONE_DAY = 86400;
export const ONE_WEEK = 7 * 86400;
export const ONE_MONTH = 30 * 86400 * 1000;
export const ONE_YEAR = 365 * 86400 * 1000;
export const FOUR_YEARS = 4 * 365 * 86400;
export const FOUR_YEARS_FIXED = FOUR_YEARS * 1000;

export const EMPY_FARM = {
  pid: 1,
  isPsc: true,
  feeEarns: '0',
  totalVotesOnFarm: '0',
  bribes: '0',
  value: '0',
  userVotes: '0',
  lpSymbol: 'Spirit-FTM LP',
  name: 'SPIRIT FTM',
  lpAddresses: {
    4002: '',
    250: '',
  },
  gaugeAddress: '',
  bribeAddress: '',
  gaugeproxy: contracts.gaugeV3[250],
  bribeRewards: ['', ''],
};

export const FTM_TOKEN_NULL_ADDRESS = {
  address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
  decimals: 18,
  symbol: 'FTM',
  chainId: CHAIN_ID,
  name: 'Fantom',
};
export const VARIABLE = 'Variable';
export const STABLE = 'Stable';

export const TOKENS_WITH_HIGH_SLIPPAGE = [wBOMB.address.toLowerCase()];
