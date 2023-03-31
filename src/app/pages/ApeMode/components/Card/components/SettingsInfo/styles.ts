import styled from 'styled-components';
import { Icon } from 'app/components/Icon';

export const Container = styled.div<{ gridArea?: string }>`
  background: ${({ theme }) => `${theme.color.bgBox}`};
  border: 1px solid rgba(55, 65, 81, 1);
  padding: 8px;
  margin: 10px 5px;
  border-radius: ${({ theme }) => `${theme.borderRadius.md}`};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-area: ${props => props.gridArea};
    margin: 3px 0px 0px 0px;
    padding: 1.5rem;
  }
`;
export const DescriptionContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 2px;
`;
export const DescriptionRow = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  display: flex;
  span {
    text-align: left;
  }
`;

export const StyledIcon = styled(Icon)`
  color: ${({ theme }) => `${theme.color.ci}`};
  border-radius: ${({ theme }) => `${theme.borderRadius.md}`};
  padding: ${({ theme }) => `${theme.spacing.spacing01}`};
`;
export const StyledLabel = styled.div`
  width: 100%;
  font-size: ${({ theme }) => `${theme.fontSize.xs}`};
  color: ${({ theme }) => `${theme.color.gray}`};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;
export const StyledValue = styled.div`
  width: 100%;
  font-size: ${({ theme }) => `${theme.fontSize.xs}`};
  color: ${({ theme }) => `${theme.color.gray}`};
  display: flex;
  flex-direction: row;
  text-align: right;
  align-items: center;
  justify-content: flex-end;
`;

export const GreenLink = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  color: #0086ff;
  font-size: ${({ theme }) => `${theme.fontSize.xs}`};
  font-weight: 700;
`;

export const StepContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;
