import contracts from '../contracts';
import { FarmConfig, QuoteToken } from '../types';

const farmRouterV2: FarmConfig[] = [
  {
    pid: 1,
    isGauge: true,
    lpSymbol: 'SPIRIT-WFTM LP',
    lpAddresses: {
      421611: '',
      42161: '0x9e7Df1a456D15324b6b4BFa9773E0d095b853E7f',
    },
    gaugeAddress: '0x19414ea529f164e5f4FeABDf0c42A09b846c1356',
    tokenSymbol: 'SPIRIT',
    tokenAddresses: {
      421611: '',
      42161: '0x5Cc61A78F164885776AA610fb0FE1257df78E59B',
    },
    quoteTokenSymbol: QuoteToken.FTM,
    quoteTokenAdresses: contracts.wftm,
    isRouterV2: true,
    v1Pid: 1,
  },
];

export default farmRouterV2;
