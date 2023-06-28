import styled, { css } from 'styled-components';
import { Heading } from '../Typography';

export const StyledContainer = styled.div<{ disabled?: boolean }>`
  @media (min-width: ${({ theme }) => theme.breakpoints.xxs}) {
    width: 100%;
  }
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    width: fit-content;
  }

  display: flex;
  flex-direction: row;
  padding: ${({ theme }) => `${theme.spacing.spacing02}`};

  border: ${({ theme }) => `1px solid ${theme.color.grayBorderToggle}`};
  box-sizing: border-box;
  backdrop-filter: blur(12px);
  border-radius: ${({ theme }) => theme.borderRadius.md};

  opacity: ${({ disabled, theme }) => (disabled ? '0.6' : '1')};
  width: auto;
  white-space: nowrap;
`;

export const SharedItemStyle = css<{
  $active: boolean;
  disabled: boolean;
  $last: boolean;
  $component: boolean;
}>`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;

  font-weight: ${({ theme }) => theme.fontWeight.normal};
  margin-right: ${({ $last, theme }) =>
    !$last ? theme.spacing.spacing02 : ''};

  background: ${({ $active, theme }) => ($active ? theme.color.ciTrans15 : '')};
  border-radius: ${({ theme }) => theme.borderRadius.sm};

  &,
  & > * {
    color: ${({ $active, theme }) =>
      $active ? theme.color.ci : theme.color.white};
  }
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  user-select: none;

  &:hover {
    background: ${({ $active, disabled, $component, theme }) =>
      !$active && !disabled && !$component ? theme.color.grayBorderBox : ''};
  }
`;

export const StyledItem = styled.div`
  ${SharedItemStyle};
  width: fit-content;
  padding: 0;
`;

export const StyledHeading = styled(Heading)`
  ${SharedItemStyle};
  padding: ${({ theme }) =>
    `${theme.spacing.spacing02} ${theme.spacing.spacing04}`};
`;
