import styled from 'styled-components';
import { Text, Th, Td, PopoverHeader } from '@chakra-ui/react';

export const StyledContainer = styled.div<{
  staked?: boolean;
}>`
  color: ${({ theme }) => theme.color.bgBoxLighter};
  background-color: ${({ staked, theme }) =>
    staked ? theme.color.ciTrans15 : theme.color.bgBoxLighter};
  padding: ${({ theme }) => theme.spacing.spacing02};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
`;

export const StyledWrapper = styled.div`
  gap: ${({ theme }) => theme.spacing.spacing03};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const StyledParagraph = styled(Text)`
  font-size: ${({ theme }) => theme.fontSize.h5};
  color: ${({ theme }) => theme.color.grayDarker};
`;

export const StyledHeader = styled(PopoverHeader)`
  color: ${({ theme }) => theme.color.white};
  margin-left: ${({ theme }) => theme.spacing.spacing02};
  padding-top: ${({ theme }) => theme.spacing.spacing04};
  border: none;
  font-size: ${({ theme }) => theme.fontSize.h3};
`;

export const StyledHeaderText = styled(Th)`
  font-size: ${({ theme }) => theme.fontSize.h4};
  padding-bottom: ${({ theme }) => theme.spacing.spacing03};
  padding-top: ${({ theme }) => theme.spacing.spacing02};
`;

export const StyledInfoLabel = styled(Td)`
  color: ${({ theme }) => theme.color.gray};
  font-size: ${({ theme }) => theme.fontSize.h4};
`;

export const StyledInfoValue = styled(Td)`
  color: ${({ theme }) => theme.color.ci};
  font-size: ${({ theme }) => theme.fontSize.h4};
`;
