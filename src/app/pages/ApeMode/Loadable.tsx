/**
 * Asynchronously loads the component for LiquidityPage
 */

import { lazyLoad } from 'utils/loadable';
import { store } from 'store';
import { selectFeatures } from 'store/features/selectors';
import { Center } from '@chakra-ui/react';

export const ApeModePage = lazyLoad(
  () => import('./index'),
  module => {
    const { apemode } = selectFeatures(store.getState());
    return apemode ? module.ApeModePage : module.ApeModePlaceholder;
  },
  {
    fallback: <Center h="100vh" />,
  },
);
