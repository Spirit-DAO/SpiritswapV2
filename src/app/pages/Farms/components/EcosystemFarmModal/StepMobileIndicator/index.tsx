import { Box, Flex } from '@chakra-ui/react';

export const StepMobileIndicator = ({ steps, currentStepIndex }) => {
  const width = `${100 / steps.length}%`;
  return (
    <Flex
      display={{
        base: 'flex',
        md: 'none',
      }}
      gap={'.25rem'}
      mt={'-1rem'}
    >
      {steps.map((step, index) => (
        <Box
          key={step.label}
          w={width}
          h={'.25rem'}
          bg={index === currentStepIndex ? 'ci' : 'grayBorderBox'}
        ></Box>
      ))}
    </Flex>
  );
};
