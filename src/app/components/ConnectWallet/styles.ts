import styled from 'styled-components';
import { Heading } from 'app/components/Typography';
import { ModalCloseButton, Text } from '@chakra-ui/react';

export const StyledHeader = styled(Heading)`
  margin-left: 8px;
  font-size: 1.3rem;
  align-self: center;
`;

export const StyledLink = styled.a`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

export const StyledButton = styled.button`
  padding: 14px 8px;
  border-radius: 4px;
  &:hover {
    background-color: ${({ theme }) => theme.color.grayBorderBox};
  }
`;

export const StyledModalCloseButton = styled(ModalCloseButton)`
  position: unset;
  margin-left: auto;
  align-items: center;
`;

export const StyledText = styled(Text)`
  align-self: center;
  margin-left: 10px;
`;
