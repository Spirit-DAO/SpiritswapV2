/**
 * Asynchronously loads the component for PortfolioPage
 */

import { Center } from '@chakra-ui/react';
import { lazyLoad } from 'utils/loadable';

export const PortfolioPage = lazyLoad(
  () => import('./index'),
  module => module.PortfolioPage,
  {
    fallback: <Center h="100vh" />,
  },
);
