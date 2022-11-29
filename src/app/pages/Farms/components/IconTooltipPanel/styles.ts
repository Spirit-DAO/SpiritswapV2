import { ReactComponent as QuestionIcon } from 'app/assets/images/question-circle.svg';
import styled from 'styled-components';

export const StyledContainer = styled.div<{
  staked?: boolean;
}>`
  padding: ${({ theme }) =>
    `${theme.spacing.spacing02} ${theme.spacing.spacing03}`};
  background: ${({ staked, theme }) =>
    staked ? theme.color.ciTrans15 : theme.color.bgBoxLighter};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
`;

export const StyledRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const StyledLeftCell = styled.div`
  color: ${({ theme }) => theme.color.gray};
  font-size: ${({ theme }) => theme.fontSize.p};
`;

export const StyledRightCell = styled.div`
  color: ${({ theme }) => theme.color.white};
  text-align: right;
  font-size: ${({ theme }) => theme.fontSize.p};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
`;

export const StyledQuestionIcon = styled(QuestionIcon)`
  color: ${({ theme }) => theme.color.ci};
`;
