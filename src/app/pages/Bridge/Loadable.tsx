/**
 * Asynchronously loads the component for LiquidityPage
 */

import { Center } from '@chakra-ui/react';
import { lazyLoad } from 'utils/loadable';

export const BridgePage = lazyLoad(
  () => import('./index'),
  module => module.BridgePage,
  {
    fallback: <Center h="100vh" />,
  },
);
