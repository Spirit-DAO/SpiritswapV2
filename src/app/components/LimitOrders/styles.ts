import { InputLeftElement } from '@chakra-ui/react';
import styled from 'styled-components';

export const LimitOrderPanelFooterWrapper = styled.div`
  padding: ${({ theme }) =>
    `${theme.spacing.spacing03} ${theme.spacing.spacing05} ${theme.spacing.spacing03} ${theme.spacing.spacing04}`};
  margin: ${({ theme }) =>
    `${theme.spacing.spacing03} -${theme.spacing.spacing04} -${theme.spacing.spacing05} -${theme.spacing.spacing04}`};
  background-color: ${({ theme }) => theme.color.bgBoxDarker};
  border-bottom-left-radius: ${({ theme }) => theme.borderRadius.md};
  border-bottom-right-radius: ${({ theme }) => theme.borderRadius.md};
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  @media (max-width: ${({ theme }) => theme.breakpoints.xs}) {
    padding: ${({ theme }) => theme.spacing.spacing03};
    margin: ${({ theme }) =>
      `${theme.spacing.spacing03} -${theme.spacing.spacing03} -${theme.spacing.spacing05} -${theme.spacing.spacing03}`};
  }
`;

export const InputIcon = styled(InputLeftElement)`
  left: 4px;
  color: ${({ theme }) => theme.color.grayDarker};

  cursor: pointer;
  &:hover {
    color: ${({ theme }) => theme.color.ci};
  }
`;
