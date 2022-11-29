import { Image } from '@chakra-ui/react';
import SwapLeftImage from './../../../../assets/swap/swap01.png';
import SwapRightImage from './../../../../assets/swap/swap02.png';
import useMobile from 'utils/isMobile';
import FadeInAnimationBox from 'app/components/FadeInAnimationBox/FadeInAnimationBox';

export default function SpiritsBackground({
  islimit,
  showChart,
  showSettings,
}) {
  const isMobile = useMobile();

  const ImageCommonStyles = {
    height: '200px',
    opacity: '25%',
    maxW: 'unset',
    transition: 'top 0.2s ease-in-out',
    position: 'absolute',
  };

  const firstImageTop =
    islimit && showSettings ? '0px' : showSettings ? '0px' : '70px';

  const secondImageTop =
    islimit && showSettings
      ? '120px'
      : islimit
      ? '400px'
      : showSettings
      ? '120px'
      : '300px';

  if (!isMobile)
    return (
      <FadeInAnimationBox
        position="relative"
        width="520px"
        margin="0 auto"
        zIndex={-1}
      >
        <Image
          src={SwapLeftImage}
          sx={ImageCommonStyles}
          right="519px"
          top={firstImageTop}
        />
        <Image
          src={SwapRightImage}
          sx={ImageCommonStyles}
          left={showChart ? '1280px' : '520px'}
          top={secondImageTop}
        />
      </FadeInAnimationBox>
    );

  return null;
}
