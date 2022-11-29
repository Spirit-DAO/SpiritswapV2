import { SobToken, SobTokenPool } from 'app/interfaces/General';
// import { FUSDT, USDC, MIM, FRAX, FUSD, DAI } from './tokens';
import { USDC, DAI } from './tokens';

/* Spirit
const SOB_USD = {
  name: 'Sob USD',
  symbol: 'SOB-USD',
  address: '0x82F30bd29cC317820064b581Ae785649F04C27B1',
  chainId: 250,
  decimals: 18,
  tokenIn: FUSD,
}; 

const SOB_USDC: SobToken = {
  name: 'Sob USDC',
  symbol: 'SOB-USDC',
  address: '0xF9C737D5e9aA858039a254b593c1CbF91358B4fB',
  chainId: 250,
  decimals: 18,
  tokenIn: USDC,
};

const SOB_MIM: SobToken = {
  name: 'Sob MIM',
  symbol: 'SOB-MIM',
  address: '0x022B1eaf7493Bd54aD07942cACC3C74fF0E9a527',
  chainId: 250,
  decimals: 18,
  tokenIn: MIM,
};

const SOB_FRAX: SobToken = {
  name: 'Sob FRAX',
  symbol: 'SOB-FRAX',
  address: '0x26346BAA0619a5ed6b420B36b82b7Df6c37914fb',
  chainId: 250,
  decimals: 18,
  tokenIn: FRAX,
};

const SOB_FUSDT: SobToken = {
  name: 'Sob fUSDT',
  symbol: 'SOB-fUSDT',
  address: '0x3562af0A0BfeE4e7AbB9EB19d1E92cA9f60b8D9F',
  chainId: 250,
  decimals: 18,
  tokenIn: FUSDT,
}; */

/* beeth */
const SOB_USDC: SobToken = {
  name: 'Sob USDC',
  symbol: 'SOB-USDC',
  address: '0x3b998ba87b11a1c5bc1770de9793b17a0da61561',
  chainId: 250,
  decimals: 18,
  tokenIn: USDC,
  poolId: '0x3b998ba87b11a1c5bc1770de9793b17a0da61561000000000000000000000185',
};

const SOB_DAI: SobToken = {
  name: 'Sob DAI',
  symbol: 'SOB-DAI',
  address: '0x2ff1552dd09f87d6774229ee5eca60cf570ae291',
  chainId: 250,
  decimals: 18,
  tokenIn: DAI,
  poolId: '0x2ff1552dd09f87d6774229ee5eca60cf570ae291000000000000000000000186',
};

export const stableSobPools: SobTokenPool[] = [
  /* spirit
  {
    name: 'USDT+USDC',
    symbol: 'fUSDT USDC LP',
    address: '0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e', //LP pool address  -- think not will be used anymore
    chainId: 250,
    decimals: 18,
    tokens: [SOB_FUSDT, SOB_USDC],
  },
  {
    name: 'MIM+FRAX-USDC',
    symbol: 'MIM FRAX USDC LP',
    address: '0x049d68029688eabf473097a2fc38ef61633a3c7a', //LP pool address
    chainId: 250,
    decimals: 18,
    tokens: [SOB_MIM, SOB_FRAX, SOB_USDC],
  }, */
  /* beet */
  {
    name: 'DAI + USDC',
    symbol: 'DAI-USDC SOB',
    address: '0x5ddb92a5340fd0ead3987d3661afcd6104c3b757',
    rewards: {
      address: '0x8166994d9ebbe5829ec86bd81258149b87facfd3',
      method: 'pendingBeets',
      pid: 41,
      abi: 'beetmasterchef',
    },
    type: 'stable',
    chainId: 250,
    decimals: 18,
    tokens: [DAI, USDC],
    sobTokens: [SOB_DAI, SOB_USDC],
    poolId:
      '0x5ddb92a5340fd0ead3987d3661afcd6104c3b757000000000000000000000187',
  },
];
