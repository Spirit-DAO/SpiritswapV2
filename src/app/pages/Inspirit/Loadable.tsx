/**
 * Asynchronously loads the component for InspiritPage
 */

import { Center } from '@chakra-ui/react';
import { lazyLoad } from 'utils/loadable';

export const InspiritPage = lazyLoad(
  () => import('./index'),
  module => module.InspiritPage,
  {
    fallback: <Center h="100vh" />,
  },
);
