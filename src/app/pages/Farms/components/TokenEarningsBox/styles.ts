import { Paragraph } from 'app/components/Typography';
import styled from 'styled-components';

export const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const StyledText = styled(Paragraph)`
  text-align: center;
  font-size: ${({ theme }) => theme.fontSize.sub};
`;

export const StyledTextTop = styled(StyledText)`
  color: ${({ theme }) => theme.color.gray};
`;

export const StyledTextCenter = styled(Paragraph)`
  text-align: center;
  font-weight: 500;
  font-size: ${({ theme }) => theme.fontSize.h2};
`;

export const StyledTextBottom = styled(StyledText)`
  color: ${({ theme }) => theme.color.grayDarker};
`;

export const StyledHighlightText = styled(StyledTextCenter)`
  color: ${({ theme }) => theme.color.ci};
`;
