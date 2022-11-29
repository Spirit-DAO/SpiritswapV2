import { FC } from 'react';
import { Props } from './StepsFarms.d';
import { Box, Text, VStack } from '@chakra-ui/react';

const StepsFarms: FC<Props> = ({ label, isActive }) => {
  return (
    <VStack w="full" align="flex-start">
      <Text color={isActive ? 'white' : 'gray'}>{label}</Text>
      <Box w="full" h={'.25rem'} bg={isActive ? 'ci' : 'grayBorderBox'}></Box>
    </VStack>
  );
};

export default StepsFarms;
