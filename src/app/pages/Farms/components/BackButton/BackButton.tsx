import { Button } from '@chakra-ui/react';
import { BackIcon } from 'app/assets/icons';

export default function BackButton({ handleBackToFarms, text }) {
  return (
    <Button onClick={handleBackToFarms} variant="inverted" w="325px" mb="8px">
      <BackIcon mr="5px" /> {text}
    </Button>
  );
}
