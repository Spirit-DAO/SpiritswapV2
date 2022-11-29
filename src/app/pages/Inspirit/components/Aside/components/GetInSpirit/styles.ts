import styled from 'styled-components';
import { Paragraph } from 'app/components/Typography';
import { Select } from 'app/components/Select';

export const StyledStepWrapper = styled.div`
  margin-top: ${({ theme }) => `${theme.spacing.spacing04}`};
  margin-bottom: ${({ theme }) => `${theme.spacing.spacing02}`};
`;

export const StyledStepHeader = styled.div`
  display: flex;
  gap: ${({ theme }) => `${theme.spacing.spacing03}`};
  margin-bottom: ${({ theme }) => `${theme.spacing.spacing04}`};
`;

export const StyledStepNumber = styled.div`
  color: ${({ theme }) => `${theme.color.ci}`};
  font-size: ${({ theme }) => `${theme.fontSize.xs}`};
  font-weight: ${({ theme }) => `${theme.fontWeight.medium}`};
  background-color: ${({ theme }) => `${theme.color.ciTrans15}`};
  border-radius: ${({ theme }) => `${theme.borderRadius.sm}`};
  width: ${({ theme }) => `${theme.spacing.spacing05}`};
  height: ${({ theme }) => `${theme.spacing.spacing05}`};
  text-align: center;
  line-height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const StyledLabel = styled.div`
  font-size: ${({ theme }) => `${theme.fontSize.xs}`};
  color: ${({ theme }) => `${theme.color.gray}`};
`;

export const StyledHr = styled.hr`
  border-color: ${({ theme }) => `${theme.color.bgInput}`};
  margin: ${({ theme }) => `${theme.spacing.spacing05} 0`};
`;

export const StyledInfoMessage = styled.div`
  margin: 0 auto;
  border-radius: ${({ theme }) => `${theme.borderRadius.md}`};
  background-color: ${({ theme }) => `${theme.color.bgBoxLighter}`};
  padding: ${({ theme }) => `${theme.spacing.spacing03}`};

  & > div {
    display: flex;
    align-items: center;
    gap: ${({ theme }) => `${theme.spacing.spacing03}`};
  }

  svg {
    color: ${({ theme }) => `${theme.color.gray}`};
  }

  p {
    font-size: ${({ theme }) => `${theme.fontSize.xs}`};
    letter-spacing: 0;
    color: ${({ theme }) => `${theme.color.gray}`};

    b {
      color: ${({ theme }) => `${theme.color.ci}`};
    }
  }
`;

export const StyledLockDetailsWrapper = styled.div`
  display: grid;
  grid-template-columns: 50% 50%;
  grid-gap: 8px;
  gap: ${({ theme }) => `${theme.spacing.spacing02}`};

  svg {
    color: white;
  }
`;

export const StyledLockDetails = styled.div`
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => `${theme.color.bgBoxLighter}`};
  border-radius: ${({ theme }) => `${theme.borderRadius.md}`};
  padding: ${({ theme }) => `${theme.spacing.spacing03}`};
  gap: ${({ theme }) => `${theme.spacing.spacing03}`};
  width: 100%;
  height: 100%;

  p:first-of-type {
    color: ${({ theme }) => `${theme.color.gray}`};
  }

  p:last-child {
    margin-top: ${({ theme }) => `${theme.spacing.spacing01}`};
  }
`;

export const StyledHighlight = styled(Paragraph)`
  font-size: ${({ theme }) => `${theme.fontSize.md}`};
  color: ${({ theme }) => `${theme.color.ci}`};
  font-weight: ${({ theme }) => `${theme.fontWeight.medium}`};
  line-height: ${({ theme }) => `${theme.lineHeight.baseLg}`};
`;

export const StyledButtonsContainer = styled.div`
  margin-top: ${({ theme }) => `${theme.spacing.spacing05}`};
`;

export const StyledSelect = styled(Select)`
  margin-top: ${({ theme }) => `${theme.spacing.spacing05}`};
  margin-bottom: ${({ theme }) => `${theme.spacing.spacing05}`};
  width: 100%;
`;
