import { Box, Image } from '@chakra-ui/react';
import LiquidityImage1 from './../../../assets/liquidity/liquidity01.png';
import LiquidityImage2 from './../../../assets/liquidity/liquidity02.png';
import LiquidityImage3 from './../../../assets/liquidity/liquidity03.png';
import LiquidityImage4 from './../../../assets/liquidity/liquidity04.png';
import useMobile from 'utils/isMobile';
import { FadeInAnimationBox } from 'app/components/FadeInAnimationBox';

export default function SpiritsBackground({ tokenTypeFilter }) {
  const isMobile = useMobile();

  if (!isMobile)
    return (
      <FadeInAnimationBox position="relative" width="100%">
        <Image
          src={LiquidityImage1}
          position="absolute"
          left="600px"
          top="450px"
          opacity="25%"
          maxW="unset"
        />
        <Image
          src={LiquidityImage2}
          position="absolute"
          left="800px"
          top="500px"
          opacity="25%"
          maxW="unset"
        />
        <Image
          src={LiquidityImage3}
          position="absolute"
          right="480px"
          top="50px"
          opacity="25%"
          maxW="unset"
        />
        <Image
          src={LiquidityImage4}
          position="absolute"
          right="480px"
          top="220px"
          opacity="25%"
          maxW="unset"
        />
      </FadeInAnimationBox>
    );

  return null;
}
