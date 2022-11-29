import { Paragraph } from 'app/components/Typography';
import { default as styledComponent } from 'styled-components';
import styled from '@emotion/styled';

export const StyledHeader = styledComponent.div`
  display: flex;
  gap: ${({ theme }) => `${theme.spacing.spacing04}`};
`;

export const StyledParagraph = styledComponent(Paragraph)`
  color: ${({ theme }) => `${theme.color.gray}`};
`;

export const StyledHeaderParagraph = styledComponent(StyledParagraph)`
  margin-top: ${({ theme }) => `${theme.spacing.spacing02}`};
`;

export const StyledSectionHeader = styled.div`
  margin: ${({ theme }) => `${theme.space.spacing06} 0`};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const StyledButtonWrapper = styledComponent.div`
  display: flex;
  gap: ${({ theme }) => `${theme.spacing.spacing03}`};
  justify-content: flex-end;

  button {
    width: 100%;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    button {
      width: inherit;
    }
  }
`;

export const StyledHighlightMessage = styledComponent(Paragraph)`
  color: ${({ theme }) => `${theme.color.white}`};
  background-color: ${({ theme }) => `${theme.color.ciTrans15}`};
  border-radius: ${({ theme }) => `${theme.borderRadius.md}`};
  border: ${({ theme }) => `1px solid ${theme.color.ci}`};
  font-size: ${({ theme }) => `${theme.fontSize.base}`};
  font-weight: ${({ theme }) => `${theme.fontWeight.medium}`};
  margin-top: ${({ theme }) => `${theme.spacing.spacing04}`};
  margin-bottom: ${({ theme }) => `${theme.spacing.spacing05}`};
  padding: 9px;
  text-align: center;
  width: 100%
`;
