import { Center } from '@chakra-ui/react';
import { lazyLoad } from 'utils/loadable';

export const FarmsPage = lazyLoad(
  () => import('./index'),
  module => module.Farms,
  {
    fallback: <Center h="100vh" />,
  },
);
