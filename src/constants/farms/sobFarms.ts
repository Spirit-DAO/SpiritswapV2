import contracts from '../contracts';
import { FarmConfig, QuoteToken } from '../types';

const sobFarms: FarmConfig[] = [
  {
    pid: 1,
    isPsc: false,
    lpSymbol: 'DAI-USDC',
    isBoosted: false,
    lpAddresses: {
      421611: '',
      42161: '0x5ddb92a5340fd0ead3987d3661afcd6104c3b757',
    },
    tokenSymbol: 'DAI',
    tokenAddresses: {
      421611: '',
      42161: '0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e',
    },
    quoteTokenSymbol: QuoteToken.USDC,
    quoteTokenAdresses: contracts.usdc,
  },
];

export default sobFarms;
