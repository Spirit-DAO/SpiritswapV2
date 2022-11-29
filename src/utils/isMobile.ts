import { useMediaQuery } from '@chakra-ui/react';
import { breakpoints } from 'theme/base/breakpoints';

const useMobile = (width = breakpoints.md) =>
  useMediaQuery(`(max-width: ${width})`)[0];

// isMobile static check
export const isMobile = () =>
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );

export default useMobile;
