import styled from 'styled-components';
import { StyledProps } from './Panel.d';

export const StyledContainer = styled.div<StyledProps>`
  ${({ theme, hasFooter }) => {
    return (
      !hasFooter &&
      `
				border: 1px solid ${theme.color.grayBorderBox};
			`
    );
  }};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.color.bgBox};
  color: ${({ theme }) => theme.color.white};

  box-sizing: border-box;
`;

export const StyledBodyContainer = styled.div<StyledProps>`
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
  ${({ theme, hasFooter }) => {
    return hasFooter
      ? `
        border: 1px solid ${theme.color.grayBorderBox}; 
        border-radius: ${theme.borderRadius.md} ${theme.borderRadius.md} 0px 0px;
      `
      : `border-radius: ${theme.borderRadius.md}`;
  }};
`;

export const StyledFooterContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: ${({ theme }) => theme.color.bgBoxLighter};
  border-radius: ${({ theme }) => `0 0 8px 8px`};
  padding: ${({ theme }) =>
    `${theme.spacing.spacing04} ${theme.spacing.spacing06}`};
  box-sizing: border-box;
  align-items: flex-end;
`;
