/**
 * Asynchronously loads the component for SwapPage
 */

import { Center } from '@chakra-ui/react';
import { lazyLoad } from 'utils/loadable';

export const SwapPage = lazyLoad(
  () => import('./index'),
  module => module.SwapPage,
  {
    fallback: <Center h="100vh" />,
  },
);
