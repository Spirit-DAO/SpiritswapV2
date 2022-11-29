import { Button } from '@chakra-ui/react';
import useMobile from 'utils/isMobile';
const CloseButton = () => {
  const isMobile = useMobile();
  return (
    <Button
      gap="5px"
      bg="grayBorderBox"
      border="transparent"
      textAlign="center"
      fontWeight="bold"
    >
      Close
      {isMobile && ' position'}
    </Button>
  );
};
export default CloseButton;
