import styled from 'styled-components';
import { Icon } from 'app/components/Icon';

export const SectionItem = styled.div`
  background: ${({ theme }) => theme.color.bgBoxLighter};
  // border: 1px solid ${({ theme }) => theme.color.grayBorderBox};
  box-sizing: border-box;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: 12px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;
export const DescriptionContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-left: 13px;
`;

export const StyledIcon = styled(Icon)`
  color: ${({ theme }) => `${theme.color.ci}`};
  border-radius: ${({ theme }) => `${theme.borderRadius.md}`};
  padding: ${({ theme }) => `${theme.spacing.spacing01}`};
`;
export const StyledLabel = styled.div`
  font-size: ${({ theme }) => `${theme.fontSize.xs}`};
  color: ${({ theme }) => `${theme.color.gray}`};
  margin-bottom: 8px;
`;

export const StepContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;
