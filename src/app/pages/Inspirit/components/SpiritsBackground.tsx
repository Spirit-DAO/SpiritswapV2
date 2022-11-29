import { Image } from '@chakra-ui/react';
import InspiritLeftImage from './../../../assets/inspirit/inspirit01.png';
import InspiritRightImage from './../../../assets/inspirit/inspirit02.png';

import { useMediaQuery } from '@chakra-ui/react';
import { FadeInAnimationBox } from 'app/components/FadeInAnimationBox';

export default function SpiritsBackground() {
  const [showSpirits] = useMediaQuery('(min-width: 1800px)');

  if (showSpirits)
    return (
      <FadeInAnimationBox position="relative" width="100%">
        <Image
          src={InspiritLeftImage}
          position="absolute"
          right="100px"
          top="170px"
          opacity="25%"
          zIndex="-1"
        />
        <Image
          src={InspiritRightImage}
          position="absolute"
          left="100px"
          top="290px"
          opacity="25%"
        />
      </FadeInAnimationBox>
    );

  return null;
}
