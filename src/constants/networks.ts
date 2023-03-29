import { SelectedNetworksProps } from 'app/interfaces/Bridge';
import { WFTM } from './tokens';

// TODO: ADD websockets for the rest
export const NETWORK = {
  1: {
    chainId: 1,
    network: 'Ethereum',
    hex: '1',
    rpc: ['https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
    wss: [
      'wss://rpc.ankr.com/eth/ws/f8894f061b2982e7af3f627c607ef8e55df530ee60cbcfa04c4cec910775a4ee',
    ],
    name: 'Ethereum',
    symbol: 'ETH',
    blockExp: ['Ethereum'],
    decimals: 18,
  },
  10: {
    chainId: 10,
    network: 'Optimism Ethereum',
    hex: 'A',
    rpc: ['https://mainnet.optimism.io'],
    wss: ['wss://ws-kovan.optimism.io'],
    name: 'Optimistic',
    symbol: 'ETH',
    blockExp: ['https://optimistic.etherscan.io'],
    decimals: 18,
  },
  25: {
    chainId: 25,
    network: 'Cronos',
    hex: '19',
    rpc: ['https://evm-cronos.crypto.org'],
    name: 'Cronos',
    symbol: 'CRO',
    blockExp: ['https://cronos.crypto.org/explorer/'],
    decimals: 18,
  },
  56: {
    chainId: 56,
    network: 'Binance Smart Chain Mainnet',
    hex: '38',
    rpc: ['https://bsc-dataseed.binance.org/'],
    wss: [
      'wss://rpc.ankr.com/bsc/ws/f8894f061b2982e7af3f627c607ef8e55df530ee60cbcfa04c4cec910775a4ee',
    ],
    name: 'BSC',
    symbol: 'BNB',
    blockExp: ['https://bscscan.com'],
    decimals: 18,
  },
  100: {
    chainId: 100,
    network: 'Gnosis',
    hex: '64',
    rpc: ['https://rpc.gnosischain.com'],
    wss: [
      'wss://rpc.ankr.com/gnosis/ws/f8894f061b2982e7af3f627c607ef8e55df530ee60cbcfa04c4cec910775a4ee',
      'wss://xdai.poanetwork.dev/wss',
    ],
    name: 'Gnosis',
    symbol: 'xDai',
    blockExp: ['https://blockscout.com/xdai/mainnet/'],
    decimals: 18,
  },
  137: {
    chainId: 137,
    network: 'Polygon',
    hex: '89',
    rpc: ['https://polygon-rpc.com'],
    wss: [
      'wss://rpc.ankr.com/polygon/ws/f8894f061b2982e7af3f627c607ef8e55df530ee60cbcfa04c4cec910775a4ee',
      'wss://rpc-mainnet.matic.network',
      'wss://rpc-mainnet.matic.quiknode.pro',
      'wss://rpc-mainnet.maticvigil.com/ws',
    ],
    name: 'Polygon',
    symbol: 'MATIC',
    blockExp: ['https://polygonscan.com/'],
    decimals: 18,
  },
  250: {
    chainId: 250,
    network: 'Fantom Opera',
    hex: 'fa',
    rpc: [
      'https://fantom-mainnet.gateway.pokt.network/v1/lb/6261a8a154c745003bcdb0f8',
      'https://rpc.ankr.com/fantom/',
      'https://rpc.ftm.tools',
      'https://rpcapi.fantom.network',
    ],
    wss: [
      'wss://rpc.ankr.com/fantom/ws/f8894f061b2982e7af3f627c607ef8e55df530ee60cbcfa04c4cec910775a4ee/',
    ],
    name: 'Fantom',
    symbol: 'FTM',
    blockExp: ['https://ftmscan.com/'],
    decimals: 18,
    wrappedToken: WFTM,
  },
  288: {
    chainId: 288,
    network: 'BOBA L2',
    hex: '120',
    rpc: ['https://mainnet.boba.network'],
    name: 'BOBA',
    symbol: 'ETH',
    blockExp: ['https://blockexplorer.boba.network'],
    decimals: 18,
  },
  1284: {
    chainId: 1284,
    network: 'Moonbeam',
    hex: '504',
    rpc: ['https://rpc.api.moonbeam.network'],
    wss: [
      'wss://rpc.ankr.com/moonbeam/ws/f8894f061b2982e7af3f627c607ef8e55df530ee60cbcfa04c4cec910775a4ee',
    ],
    name: 'Moonbeam',
    symbol: 'GLMR',
    blockExp: ['https://moonscan.io'],
    decimals: 18,
  },
  1285: {
    chainId: 1285,
    network: 'Moonriver',
    hex: '505',
    rpc: ['https://rpc.moonriver.moonbeam.network'],
    wss: [
      'wss://moonriver-api.us-east-1.bwarelabs.com/ws/9c5749ac-9372-4d13-b149-48149155c80f',
    ],
    name: 'Moonriver',
    symbol: 'MOVR',
    blockExp: ['https://moonriver.moonscan.io/'],
    decimals: 18,
  },
  42161: {
    chainId: 42161,
    network: 'Arbitrum',
    hex: 'A4B1',
    rpc: ['https://arb1.arbitrum.io/rpc'],
    wss: [
      'wss://rpc.ankr.com/arbitrum/ws/f8894f061b2982e7af3f627c607ef8e55df530ee60cbcfa04c4cec910775a4ee',
    ],
    name: 'Arbitrum',
    symbol: 'AETH',
    blockExp: ['https://arbiscan.io'],
    decimals: 18,
  },
  43114: {
    chainId: 43114,
    network: 'Avalanche',
    hex: 'A86A',
    rpc: ['https://api.avax.network/ext/bc/C/rpc'],
    wss: [
      'wss://rpc.ankr.com/avalanche/ws/f8894f061b2982e7af3f627c607ef8e55df530ee60cbcfa04c4cec910775a4ee',
    ],
    name: 'Avalanche',
    symbol: 'AVAX',
    blockExp: ['https://cchain.explorer.avax.network/'],
    decimals: 18,
  },
  1666600000: {
    chainId: 1666600000,
    network: 'Harmony Mainnet',
    hex: '63564C40',
    rpc: ['https://api.harmony.one'],
    wss: [
      'wss://rpc.ankr.com/harmony/ws/f8894f061b2982e7af3f627c607ef8e55df530ee60cbcfa04c4cec910775a4ee',
    ],
    name: 'Harmony',
    symbol: 'ONE',
    blockExp: ['https://explorer.harmony.one/'],
    decimals: 18,
  },
  1313161554: {
    chainId: 1313161554,
    network: ' Aurora Mainnet',
    hex: '4E454152',
    rpc: ['https://mainnet.aurora.dev'],
    name: 'Aurora',
    symbol: 'aETH',
    blockExp: ['https://explorer.mainnet.aurora.dev/'],
    decimals: 18,
  },
};

export const networkList = [
  {
    id: 1,
    value: 'Ethereum',
    type: 'network',
  },
  // {
  //   id: 10,
  //   value: 'Optimism',
  //   type: 'network',
  // },
  {
    id: 56,
    value: 'BSC',
    type: 'network',
  },
  // {
  //   id: 100,
  //   value: 'Gnosis',
  //   type: 'network',
  // },
  {
    id: 137,
    value: 'Polygon',
    type: 'network',
  },
  {
    id: 250,
    value: 'Fantom',
    type: 'network',
  },
  // {
  //   id: 1284,
  //   value: 'Moonbeam',
  //   type: 'network',
  // },
  // {
  //   id: 1285,
  //   value: 'Moonriver',
  //   type: 'network',
  // },
  {
    id: 42161,
    value: 'Arbitrum',
    type: 'network',
  },
  {
    id: 43114,
    value: 'Avalanche',
    type: 'network',
  },
  // {
  //   id: 1666600000,
  //   value: 'Harmony',
  //   type: 'network',
  // },
];

export const networkColor = {
  1: 'rgba(57, 57, 57, 0.25)', // ETH
  10: 'rgba(255, 4, 32, 0.25)', // Optimism
  56: 'rgba(243, 186, 47, 0.25)', // BSC
  100: 'rgba(0, 166, 196, 0.25)', // Gnosis
  137: 'rgba(130, 71, 230, 0.25)', // Polygon
  250: 'rgba(19, 181, 236, 0.25)', // FTM
  1284: 'rgba(83, 203, 200, 0.25)', // MoonBeam NEED A COLOR
  1285: 'rgba(83, 203, 200, 0.25)', // Moonriver
  42161: 'rgba(40, 160, 240, 0.25)', // ARB
  43114: 'rgba(232, 65, 66, 0.25)', // AVL
  1666600000: 'rgba(232, 65, 66, 0.25)', // Harmony NEED A COLOR
};

export const INITIALBRIDGE: SelectedNetworksProps = {
  From: {
    id: 250,
    name: 'Fantom',
  },
  To: {
    id: 56,
    name: 'BSC',
  },
};
