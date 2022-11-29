import styled from 'styled-components';
import { Paragraph } from 'app/components/Typography';

export const StyledContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) =>
    `${theme.spacing.spacing03} ${theme.spacing.spacing04}`};
  background-color: ${({ theme }) => theme.color.bgBoxLighter};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  margin-bottom: ${({ theme }) => theme.spacing.spacing03};
`;

export const StyledParagraph = styled(Paragraph)<{
  color?: any;
}>`
  font-size: ${({ theme }) => theme.fontSize.h5};
  font-weight: ${({ theme }) => theme.fontWeight.regular};
  color: ${({ color, theme }) =>
    color ? 'theme.color.grayDarker' : theme.color.gray};
  letter-spacing: 1;
`;

export const StyledValue = styled(Paragraph)`
  font-size: ${({ theme }) => theme.fontSize.base};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.color.white};
  margin: ${({ theme }) => `${theme.spacing.spacing02} 0`};
`;

export const StyledHighlightValue = styled(StyledValue)`
  color: ${({ theme }) => theme.color.ci};
`;
