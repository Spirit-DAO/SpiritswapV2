import styled from 'styled-components';
import { PercentBadge } from 'app/components/PercentBadge';
import { Heading } from 'app/components/Typography';
import { Paragraph } from 'app/components/Typography';

export const StyledContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.color.bgInput};
`;

export const StyledTokensWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const StyledTokenName = styled(Heading)`
  font-size: 20px;
  text-transform: uppercase;
`;

export const StyledLabel = styled(Paragraph)`
  text-align: center;
`;

export const StyledPercentBadge = styled(PercentBadge)`
  color: ${({ theme }) => theme.color.white};
  background: ${({ theme }) => theme.color.grayBorderBox};
  font-weight: 500;
  margin-top: -1px;
`;

export const StyledAprWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
`;

export const StyledTokenIcons = styled.div`
  display: flex;

  div {
    border-radius: 100%;
    background-color: ${({ theme }) => theme.color.grayBorderBox};
    border: ${({ theme }) => `2px solid ${theme.color.bgInput}`};
  }

  div:last-child {
    margin-left: -10px;
  }
`;

export const StyledTokenNames = styled.div`
  margin: 3px 0;

  h3 {
    line-height: 1;
  }
`;
