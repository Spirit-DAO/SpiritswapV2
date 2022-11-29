/**
 * Asynchronously loads the component for LiquidityPage
 */

import { Center } from '@chakra-ui/react';
import { lazyLoad } from 'utils/loadable';

export const LiquidityPage = lazyLoad(
  () => import('./index'),
  module => module.LiquidityPage,
  {
    fallback: <Center h="100vh" />,
  },
);
