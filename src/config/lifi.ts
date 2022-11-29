import LIFI from '@lifi/sdk';
import { EXCHANGE_ALLOWED } from 'constants/index';

export const LiFi = new LIFI({
  defaultRouteOptions: {
    integrator: 'SpiritSwap',
    exchanges: {
      allow: EXCHANGE_ALLOWED,
    },
  },
});
