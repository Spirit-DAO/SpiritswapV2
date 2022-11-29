import { ListToken } from 'app/interfaces/Bridge';

export const tokens: ListToken = {
  // Tokens from Fantom
  250: [
    {
      name: 'USD Coin',
      symbol: 'USDC',
      address: '0x04068da6c83afcfa0e13ba15a6696662335d5b75',
      chainId: 250,
      decimals: 6,
    },
    {
      name: 'Dai Stablecoin',
      symbol: 'DAI',
      address: '0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e',
      chainId: 250,
      decimals: 18,
    },
    {
      name: 'Frapped USDT',
      symbol: 'fUSDT',
      address: '0x049d68029688eabf473097a2fc38ef61633a3c7a',
      chainId: 250,
      decimals: 6,
    },
    {
      name: 'Ethereum',
      symbol: 'ETH',
      address: '0x74b23882a30290451A17c44f4F05243b6b58C76d',
      chainId: 250,
      decimals: 18,
    },
  ],
  1: [
    {
      name: 'USD Coin',
      symbol: 'USDC',
      address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      chainId: 1,
      decimals: 6,
    },
    {
      name: 'Dai Stablecoin',
      symbol: 'DAI',
      address: '0x6b175474e89094c44da98b954eedeac495271d0f',
      chainId: 1,
      decimals: 18,
    },
    {
      name: 'Tether USD',
      symbol: 'USDT',
      address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      chainId: 1,
      decimals: 6,
    },
    {
      name: 'Ethereum',
      symbol: 'ETH',
      address: '0x0000000000000000000000000000000000000000',
      chainId: 250,
      decimals: 18,
    },
  ],
  56: [
    {
      name: 'USD Coin',
      symbol: 'USDC',
      address: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
      chainId: 56,
      decimals: 18,
    },
    {
      name: 'Dai Stablecoin',
      symbol: 'DAI',
      address: '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3',
      chainId: 56,
      decimals: 18,
    },
    {
      name: 'Binance-Peg BSC-USD',
      symbol: 'USDT',
      address: '0x55d398326f99059fF775485246999027B3197955',
      chainId: 56,
      decimals: 18,
    },
  ],
  137: [
    {
      name: 'USD Coin',
      symbol: 'USDC',
      address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
      chainId: 137,
      decimals: 6,
    },
    {
      name: 'Dai Stablecoin',
      symbol: 'DAI',
      address: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063',
      chainId: 137,
      decimals: 18,
    },
    {
      name: '(PoS) Tether USD',
      symbol: 'USDT',
      address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
      chainId: 137,
      decimals: 6,
    },
  ],
  // Arbitrum
  42161: [
    {
      name: 'Ethereum',
      symbol: 'ETH',
      address: '0x0000000000000000000000000000000000000000',
      chainId: 42161,
      decimals: 18,
    },
    {
      name: 'USD Coin',
      symbol: 'USDC',
      address: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
      chainId: 42161,
      decimals: 6,
    },
    {
      name: 'Dai Stablecoin',
      symbol: 'DAI',
      address: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
      chainId: 42161,
      decimals: 18,
    },
    {
      name: 'Tether USD',
      symbol: 'USDT',
      address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
      chainId: 42161,
      decimals: 6,
    },
    {
      name: 'Wrapped ETH',
      symbol: 'WETH',
      address: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
      chainId: 42161,
      decimals: 18,
    },
  ],
  // Avalanche
  43114: [
    {
      name: 'USD Coin',
      symbol: 'USDC.e',
      address: '0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664',
      chainId: 43114,
      decimals: 6,
    },
    {
      name: 'Dai Stablecoin',
      symbol: 'DAI',
      address: '0xd586e7f844cea2f87f50152665bcbc2c279d8d70',
      chainId: 43114,
      decimals: 18,
    },
    {
      name: 'TetherToken',
      symbol: 'USDt',
      address: '0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7',
      chainId: 43114,
      decimals: 6,
    },
    {
      name: 'Wrapped ETH',
      symbol: 'WETH',
      address: '0x49d5c2bdffac6ce2bfdb6640f4f80f226bc10bab',
      chainId: 43114,
      decimals: 18,
    },
  ],
  // Optimistic
  10: [
    {
      name: 'USD Coin',
      symbol: 'USDC',
      address: '0x7f5c764cbc14f9669b88837ca1490cca17c31607',
      chainId: 10,
      decimals: 6,
    },
    {
      name: 'Dai Stablecoin',
      symbol: 'DAI',
      address: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
      chainId: 10,
      decimals: 18,
    },
    {
      name: 'Tether USD',
      symbol: 'USDT',
      address: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
      chainId: 10,
      decimals: 6,
    },
    {
      name: 'ETH',
      symbol: 'ETH',
      address: '0x0000000000000000000000000000000000000000',
      chainId: 10,
      decimals: 18,
    },
  ],
  100: [
    {
      name: 'USD Coin',
      symbol: 'USDC',
      address: '0xddafbb505ad214d7b80b1f830fccc89b60fb7a83',
      chainId: 100,
      decimals: 6,
    },
    {
      name: 'Dai',
      symbol: 'xDAI',
      address: '0x0000000000000000000000000000000000000000',
      chainId: 100,
      decimals: 18,
    },
    {
      name: 'Frapped USDT',
      symbol: 'fUSDT',
      address: '0x4ecaba5870353805a9f068101a40e0f32ed605c6',
      chainId: 100,
      decimals: 6,
    },
    {
      name: 'ETH',
      symbol: 'ETH',
      address: '0x6a023ccd1ff6f2045c3309768ead9e68f978f6e1',
      chainId: 100,
      decimals: 18,
    },
  ],
  //Moonriver
  1285: [
    {
      name: 'USD Coin',
      symbol: 'USDC',
      address: '0xe3f5a90f9cb311505cd691a46596599aa1a0ad7d',
      chainId: 1285,
      decimals: 6,
    },
    {
      name: 'Tether USD',
      symbol: 'USDT',
      address: '0xB44a9B6905aF7c801311e8F4E76932ee959c663C',
      chainId: 1285,
      decimals: 6,
    },
  ],
  // Moonbeam
  1284: [
    {
      name: 'USD Coin',
      symbol: 'USDC',
      address: '0x8f552a71EFE5eeFc207Bf75485b356A0b3f01eC9',
      chainId: 1284,
      decimals: 6,
    },
    {
      name: 'Tether USD',
      symbol: 'USDT',
      address: '0xeFAeeE334F0Fd1712f9a8cc375f427D9Cdd40d73',
      chainId: 1284,
      decimals: 6,
    },
  ],
};
const USDC = {
  250: '0x04068da6c83afcfa0e13ba15a6696662335d5b75',
  56: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
  1: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  137: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
  100: '0xddafbb505ad214d7b80b1f830fccc89b60fb7a83',
  43114: '0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e',
  42161: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
  1666600000: '0x985458e523db3d53125813ed68c274899e9dfab4',
  1284: '0x818ec0A7Fe18Ff94269904fCED6AE3DaE6d6dC0b',
  1285: '0xe3f5a90f9cb311505cd691a46596599aa1a0ad7d',
  10: '0x80a16016cc4a2e6a2caca8a4a498b1699ff0f844',
};
const USDT = {
  250: '0x049d68029688eabf473097a2fc38ef61633a3c7a',
  56: '0x55d398326f99059ff775485246999027b3197955',
  1: '0xdac17f958d2ee523a2206206994597c13d831ec7',
  137: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
  100: '0x4ecaba5870353805a9f068101a40e0f32ed605c6',
  43114: '0xf0ff231e3f1a50f83136717f287adab862f89431',
  42161: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
  1666600000: '0x3c2b8be99c50593081eaa2a724f0b8285f5aba8f',
  1284: '0xefaeee334f0fd1712f9a8cc375f427d9cdd40d73',
  1285: '0xb44a9b6905af7c801311e8f4e76932ee959c663c',
  10: '0x80a16016cc4a2e6a2caca8a4a498b1699ff0f844',
};
const DAI = {
  250: '0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e',
  56: '0x1282911d3600b202698997f61f46379db3b9f01e',
  1: '0x6b175474e89094c44da98b954eedeac495271d0f',
  137: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063',
  100: '0x44fa8e6f47987339850636f88629646662444217',
  43114: '0xd586e7f844cea2f87f50152665bcbc2c279d8d70',
  42161: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
  1666600000: '0xef977d2f931c1978db5f6747666fa1eacb0d0339',
  1284: '0x765277eebeca2e31912c9946eae1021199b39c61',
  1285: '0x80a16016cc4a2e6a2caca8a4a498b1699ff0f844',
  10: '0x80a16016cc4a2e6a2caca8a4a498b1699ff0f844',
};
const HARMONY = 1666600000;

const COMMONM_FTM = [USDC[250], USDT[250], DAI[250]];
const COMMONM_ETH = [USDC[1], USDT[1], DAI[1]];
const COMMONM_ARB = [USDC[42161], USDT[42161], DAI[42161]];
const COMMONM_HARMONY = [USDC[HARMONY], USDT[HARMONY], DAI[HARMONY]];
const COMMONM_MOVR = [USDC[1285], USDT[1285], DAI[1285]];
const COMMONM_MOON = [USDC[1284], USDT[1284], DAI[1284]];
const COMMONM_AVAX = [USDC[43114], '', DAI[43114]];
const COMMONM_XDAI = [USDC[100], USDT[100], DAI[100]];
const COMMONM_MATIC = [USDC[137], USDT[137], DAI[137]];
const COMMONM_BNB = [USDC[56], USDT[56], DAI[56]];

export const TOKENS_BRIDGE = {
  1: COMMONM_ETH,
  56: COMMONM_BNB,
  100: COMMONM_XDAI,
  137: COMMONM_MATIC,
  250: COMMONM_FTM,
  1284: COMMONM_MOON,
  1285: COMMONM_MOVR,
  42161: COMMONM_ARB,
  43114: COMMONM_AVAX,
  1666600000: COMMONM_HARMONY,
};
