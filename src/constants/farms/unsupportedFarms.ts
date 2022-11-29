import contracts from 'constants/contracts';
import { FarmConfig, QuoteToken } from 'constants/types';

const unsupportedFarms: FarmConfig[] = [
  {
    pid: 0,
    isPsc: true,
    isStakingPool: true,
    isTokenOnly: false,
    lpSymbol: 'sSPELL-FTM LP',
    isLPToken: true,
    lpAddresses: {
      4002: '',
      250: '0x5b6b77a6669c4540a905d7fcb3c2f1916f9ef31c',
    },
    tokenSymbol: 'sSPELL',
    tokenAddresses: contracts.sspell,
    quoteTokenSymbol: QuoteToken.FTM,
    quoteTokenAdresses: contracts.wftm,
  },
  {
    pid: 0,
    isPsc: true,
    lpSymbol: 'FXS-FRAX LP',
    lpAddresses: {
      4002: '',
      250: '0x7a2ad237e389de505de7a89768143337e516c6ce',
    },
    tokenSymbol: 'FXS',
    tokenAddresses: contracts.fxs,
    quoteTokenSymbol: QuoteToken.FRAX,
    quoteTokenAdresses: contracts.frax,
  },
  {
    pid: 0,
    isPsc: true,
    lpSymbol: 'DOPE-FTM LP',
    lpAddresses: {
      4002: '',
      250: '0xae5fa70b5dc414fd1e0b9241bd34b67369eaa02d',
    },
    tokenSymbol: 'DOPE',
    tokenAddresses: contracts.dope,
    quoteTokenSymbol: QuoteToken.FTM,
    quoteTokenAdresses: contracts.wftm,
  },
  {
    pid: 0,
    isPsc: true,
    lpSymbol: 'DEI-FTM LP',
    lpAddresses: {
      4002: '',
      250: '0xade92bb0788390dd4d31dbdefcd9bbfbfc4b00f8',
    },
    tokenSymbol: 'DEI',
    tokenAddresses: contracts.dei,
    quoteTokenSymbol: QuoteToken.FTM,
    quoteTokenAdresses: contracts.wftm,
  },
  {
    pid: 0,
    isPsc: true,
    lpSymbol: 'wSSQUID-FTM LP',
    lpAddresses: {
      4002: '',
      250: '0x6e158b89c1bf0db29d61518f88c40ce5039655f7',
    },
    tokenSymbol: 'DEI',
    tokenAddresses: contracts.wssquid,
    quoteTokenSymbol: QuoteToken.FTM,
    quoteTokenAdresses: contracts.wftm,
  },
  {
    pid: 0,
    isPsc: true,
    lpSymbol: 'gPHM-FTM LP',
    lpAddresses: {
      4002: '',
      250: '0x99a67afaea8d95ba30984498fd8be2f2ecfc2701',
    },
    tokenSymbol: 'gPHM',
    tokenAddresses: contracts.gphm,
    quoteTokenSymbol: QuoteToken.FTM,
    quoteTokenAdresses: contracts.wftm,
  },
  {
    pid: 0,
    isPsc: true,
    lpSymbol: 'ATLAS-FTM LP',
    lpAddresses: {
      4002: '',
      250: '0xffcf183126df14ec4e59409bab431885cceeb1c2',
    },
    tokenSymbol: 'ATLAS',
    tokenAddresses: contracts.atlas,
    quoteTokenSymbol: QuoteToken.FTM,
    quoteTokenAdresses: contracts.wftm,
  },
  {
    pid: 0,
    isPsc: true,
    lpSymbol: 'rainSPIRIT-SPIRIT LP',
    lpAddresses: {
      4002: '',
      250: '0x15fd4c105ead01fc357cae997cbd7fe989fb40e5',
    },
    tokenSymbol: 'rainSPIRIT',
    tokenAddresses: contracts.rainspirit,
    quoteTokenSymbol: QuoteToken.SPIRIT,
    quoteTokenAdresses: contracts.spirit,
  },
  {
    pid: 0,
    isPsc: true,
    lpSymbol: 'INK-FTM LP',
    lpAddresses: {
      4002: '',
      250: '0xdecc75dbf9679d7a3b6ad011a98f05b5cc6a8a9d',
    },
    tokenSymbol: 'INK',
    tokenAddresses: contracts.ink,
    quoteTokenSymbol: QuoteToken.FTM,
    quoteTokenAdresses: contracts.wftm,
  },
];

export default unsupportedFarms;
