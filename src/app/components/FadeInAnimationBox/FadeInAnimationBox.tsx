import { Box } from '@chakra-ui/react';
import styled from '@emotion/styled';

const StyledBox = styled(Box)`
  animation: fadeIn 2s;

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`;

const FadeInAnimationBox = ({ children, ...props }) => {
  return <StyledBox {...props}>{children}</StyledBox>;
};

export default FadeInAnimationBox;
