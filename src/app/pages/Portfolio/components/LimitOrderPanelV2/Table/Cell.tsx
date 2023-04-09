import { Flex } from '@chakra-ui/react';

const Cell = ({ autoHeight = true, heading = false, children, ...props }) => (
  <Flex
    alignItems={'center'}
    w={'full'}
    bg={heading ? 'transparent' : 'bgBoxLighter'}
    h={autoHeight ? '2rem' : '2.5rem'}
    p={heading ? '0 0.5rem 0 0' : 'spacing03'}
    borderRadius={'.25rem'}
    minW={heading ? 'max-content' : '150px'}
    {...props}
  >
    {children}
  </Flex>
);

export default Cell;
