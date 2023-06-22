import styled from '@emotion/styled';
import { Icon } from 'app/components/Icon';
import { Box } from '@chakra-ui/react';

export const LimitOrderContainer = styled(Box)<{
  gridArea?: string;
  showChart?: boolean;
  isTWAP?: boolean;
}>`
  height: ${({ isTWAP }) => (isTWAP ? '34%' : 'auto')};
  background: ${({ theme }) => `${theme.colors.bgBox}`};
  border: 1px solid ${({ theme }) => `${theme.colors.grayBorderBox}`};
  padding: 16px 8px;
  margin-top: ${props => (props.showChart ? '8px' : 0)};
  border-radius: ${({ theme }) => `${theme.borderRadius.md}`};
  overflow: scroll;
  overflow-y: hidden;
  -ms-overflow-y: hidden;
  scrollbar-width: none;
  text-transform: none;
  -ms-overflow-style: none;
  ::-webkit-scrollbar {
    display: none;
  }
  @media (max-width: 1100px) {
    margin-top: ${({ theme }) => theme.space.spacing03};
    margin-left: 0;
  }
`;

export const StyledIcon = styled(Icon)`
  color: ${({ theme }) => `${theme.colors.ci}`};
  border-radius: ${({ theme }) => `${theme.borderRadius.md}`};
  padding: ${({ theme }) => `${theme.space.spacing01}`};
  margin-right: 3px;
`;
