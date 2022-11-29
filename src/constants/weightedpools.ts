import { WeightedTokenPool } from 'app/interfaces/General';
import {
  ICE,
  MIM,
  SPELL,
  WFTM,
  /*
  SPIRIT,
  UOS,
  USDC,
  USDK,
  USDN,
  USDT,
  USDX,
  AVAX,
  DAI,
  DEUS,
  FTM, */
} from './tokens';

export const weightedpools: WeightedTokenPool[] = [
  /*
  {
    name: 'Deus the Spirit',
    symbol: '',
    address: '0x0000000000000000000000000000000000000000',
    chainId: 250,
    decimals: 18,
    tokens: [FTM, SPIRIT, DEUS],
    poolId:
      '0x0000000000000000000000000000000000000000000000000000000000000000',
  },
  {
    name: 'Crowd control',
    symbol: '',
    address: '0x0000000000000000000000000000000000000000',
    chainId: 250,
    decimals: 18,
    tokens: [USDC, DAI, USDT, USDX, USDK],
    poolId:
      '0x0000000000000000000000000000000000000000000000000000000000000000',
  },
  {
    name: 'Holy Panda',
    symbol: '',
    address: '0x0000000000000000000000000000000000000000',
    chainId: 250,
    decimals: 18,
    tokens: [AVAX, UOS, USDX, USDT, DAI, USDC, USDK, USDN],
    poolId:
      '0x0000000000000000000000000000000000000000000000000000000000000000',
  }, */
  {
    name: 'A Song of Ice and Fire',
    symbol: 'BPT-ICEFIRE',
    address: '0x2BeA17EdE5D83ad19ae112B8592AadaA2B015De7',
    rewards: {
      address: '0x8166994d9ebBe5829EC86Bd81258149B87faCfd3',
      method: 'pendingBeets',
      pid: 18,
      abi: 'beetmasterchef',
    },
    type: 'weighted',
    chainId: 250,
    decimals: 18,
    tokens: [WFTM, SPELL, MIM, ICE],
    weights: [0.25, 0.25, 0.25, 0.25], // In the order tokens are listed above
    poolId:
      '0x2bea17ede5d83ad19ae112b8592aadaa2b015de7000100000000000000000069',
  },
];
