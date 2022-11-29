import { Flex } from '@chakra-ui/react';
import styled from 'styled-components';
import { ReactComponent as PlusLogo } from 'app/assets/images/plus.svg';

export const StyledPlusLogo = styled(PlusLogo)`
  color: ${({ theme }) => theme.color.ci};
`;

const PlusLogoGreen = () => {
  return (
    <Flex justify="center" mt="6px" mb="6px">
      <StyledPlusLogo />
    </Flex>
  );
};

export default PlusLogoGreen;
