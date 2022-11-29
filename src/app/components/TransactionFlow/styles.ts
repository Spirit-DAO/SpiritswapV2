import { Box, Flex } from '@chakra-ui/react';
import styled from '@emotion/styled';
import { TFLoading } from 'app/assets/icons';

export const DetailBox = styled(Box)<{
  step: { title: string; type: string };
}>`
  background-color: ${({ theme }) => theme.colors.bgBoxLighter};
  margin-bottom: ${({ theme }) => theme.space[1]};
  margin-top: ${({ theme }) => theme.space[1]};
  padding: ${({ theme }) => theme.space[2]};
  border-radius: ${({ theme }) => theme.radii.md};
`;

export const NumberBox = styled(Flex)`
  align-items: center;
  place-content: center;
  background: ${({ theme }) => theme.colors.ciTrans15};
  width: 18px;
  height: 18px;
  padding: 4px;
  border-radius: 4px;
  margin: 0px 8px;
`;

export const StyledLoadingIcon = styled(TFLoading)`
  animation-name: spin;
  animation-duration: 5000ms;
  animation-iteration-count: infinite;
  animation-timing-function: linear;

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
    
`;
