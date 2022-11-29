import styled from '@emotion/styled';
import { Panel } from 'app/components/Panel';
import { IconToInput } from 'app/components/IconToInput';
import { Heading, Paragraph } from 'app/components/Typography';
import { Box } from '@chakra-ui/react';

export const StyledPanel = styled(Panel)`
  overflow: hidden;
`;

export const StyledContent = styled.div`
  padding: 1.5rem;
`;

export const StyledHeader = styled.div`
  display: flex;
  align-items: center;
`;

export const StyledIconToInput = styled(IconToInput)`
  justify-content: flex-end;
  flex: 1;
  margin-left: 0.625rem;
`;

export const StyledNoFarmsBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem;
`;

export const StyledGrayParagraph = styled(Paragraph)`
  color: ${({ theme }) => theme.colors.gray};
`;

export const StyledSubtitle = styled(StyledGrayParagraph)`
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  margin: 0.75rem 0;
`;

export const StyledNoFarmsMessage = styled(StyledGrayParagraph)`
  margin-bottom: 0.5rem;
`;

export const StyledFarmCount = styled(Heading)`
  color: ${({ theme }) => theme.colors.gray};
  margin: 0.75rem 0;
`;

export const StyledDescription = styled(Box)`
  display: flex;
  justify-content: space-between;
`;

export const StyledFooter = styled(Box)`
  display: inline-grid;
  grid-auto-flow: column;
  align-items: center;
  gap: 0.5rem;
`;
