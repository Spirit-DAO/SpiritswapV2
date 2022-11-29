import { Image } from '@chakra-ui/react';
import FarmLeftImage from './../../../assets/farm/farm01.png';
import FarmRightImage from './../../../assets/farm/farm02.png';
import useMobile from 'utils/isMobile';
import { FadeInAnimationBox } from 'app/components/FadeInAnimationBox';

export default function SpiritsBackground() {
  const isMobile = useMobile();

  if (!isMobile)
    return (
      <FadeInAnimationBox position="relative" width="100%">
        <Image
          src={FarmLeftImage}
          position="absolute"
          right="1020px"
          top="200px"
          opacity="25%"
          maxW="unset"
        />
        <Image
          src={FarmRightImage}
          position="absolute"
          left="1020px"
          top="170px"
          opacity="25%"
          maxW="unset"
        />
      </FadeInAnimationBox>
    );

  return null;
}
