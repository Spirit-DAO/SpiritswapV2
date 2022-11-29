import { Button } from '@chakra-ui/react';
import { StyledIcon } from '../styles';
import { ReactComponent as CloseIconSvg } from 'app/assets/images/closeApe.svg';
import { useMediaQuery } from '@chakra-ui/react';
const CloseButton = () => {
  const [isMobile] = useMediaQuery('(max-width: 768px)');
  return (
    <Button alignSelf="start" bgColor="grayBorderBox" border="none">
      <StyledIcon icon={<CloseIconSvg />} size={28} /> Close
      {isMobile && ' position'}
    </Button>
  );
};
export default CloseButton;
