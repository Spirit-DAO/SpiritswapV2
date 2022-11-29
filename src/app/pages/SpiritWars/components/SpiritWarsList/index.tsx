import LiquidDriver from 'app/assets/images/liquid-driver.png';
import Ola from 'app/assets/images/ola.png';
import Beefy from 'app/assets/images/beefy.png';
import Scarab from 'app/assets/images/scarab.png';
import Tarot from 'app/assets/images/tarot.png';
import Grim from 'app/assets/images/grim.png';
import MilleniumClub from 'app/assets/images/millenium-club.png';
import { Image } from '@chakra-ui/react';
import { QuestionIcon } from 'app/assets/icons';

export { default as SpiritWarsList } from './SpiritWarsList';
export type { SpiritWarProps as Props, Token } from './SpiritWars.d';

export const getIcon = (name: string, w = '32px', h = '32px') => {
  // TODO: Same icon is getting displayed because of likely caching on the other end where image tag references to.
  //Replacing svg content with proper svg file will suffice to fix this issue. For ex: go to ola.svg and replace the svg content with new one that Julian can provide. Do the same for liquidDriver.svg, tarot.svg etc.

  const style = {
    alignSelf: 'center',
    width: w,
    height: h,
  };

  switch (name) {
    case 'Ola':
      return <Image src={Ola} {...style} />;
    case 'Liquid Driver':
      return <Image src={LiquidDriver} {...style} />;
    case 'Beefy':
      return <Image src={Beefy} {...style} />;
    case 'Scarab':
      return <Image src={Scarab} {...style} />;
    case 'Grim':
      return <Image src={Grim} {...style} />;
    case 'Tarot':
      return <Image src={Tarot} {...style} />;
    case 'Millennium Club':
      return <Image src={MilleniumClub} {...style} />;
    default:
      return <QuestionIcon {...style} />;
  }
};
