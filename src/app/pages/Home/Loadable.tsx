import { Center } from '@chakra-ui/react';
import { lazyLoad } from 'utils/loadable';

export const HomePage = lazyLoad(
  () => import('./index'),
  module => module.Home,
  {
    fallback: <Center h="100vh" />,
  },
);
