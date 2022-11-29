import { Icon } from 'app/components/Icon';
import styled from 'styled-components';
import { Paragraph } from 'app/components/Typography';

export const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const StyledProgressWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.5rem;
  background-color: ${({ theme }) => theme.color.bgBoxLighter};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

export const StyledHoldLabel = styled.div`
  color: ${({ theme }) => theme.color.gray};
  display: flex;
  align-items: center;
  margin: auto;
  gap: 0.25rem;

  p {
    font-size: ${({ theme }) => theme.fontSize.sub};
  }

  strong,
  b {
    color: ${({ theme }) => theme.color.white};
  }
`;

export const StyledReducedIcon = styled(Icon)`
  margin: -3px;
`;

export const StyledParagraph = styled(Paragraph)`
  b {
    font-weight: ${({ theme }) => theme.fontWeight.medium};
  }

  mark {
    color: ${({ theme }) => theme.color.ci};
    font-weight: ${({ theme }) => theme.fontWeight.medium};
    background: transparent;
  }
`;
