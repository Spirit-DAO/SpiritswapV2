import { Flex } from '@chakra-ui/react';

const Col = ({ children, ...props }) => (
  <Flex flexDir="column" alignItems="flex-start" {...props} gap="4px">
    {children}
  </Flex>
);

export default Col;
