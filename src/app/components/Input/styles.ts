import styled, { css } from 'styled-components';
import { InputWrapperStyleProps, StyledIconWrapperStyleProps } from './Input.d';

export const StyledIconWrapper = styled.div<StyledIconWrapperStyleProps>`
  display: flex;
  align-items: center;
  padding: 7px;
  color: ${({ theme }) => theme.color.grayDarker};

  ${({ disabled }) =>
    !disabled &&
    css`
      cursor: pointer;

      &:hover {
        color: ${({ theme }) => theme.color.ci};
      }
    `}
`;

export const InputWrapper = styled.div<InputWrapperStyleProps>`
  border: 1px solid ${({ theme }) => theme.color.grayBorderBox};
  background-color: ${({ theme }) => theme.color.bgInput};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  display: flex;
  flex-direction: row;
  align-items: center;

  ${({ disabled, theme }) =>
    disabled &&
    `
    opacity: ${theme.opacity.opacity04};
    &, & > input {
      cursor: not-allowed;
    }
  `}
  &:focus-within {
    border-color: ${({ theme }) => theme.color.ciDark};
  }

  & > svg {
    color: ${({ theme }) => theme.color.white};
  }

  & > input {
    flex-grow: 1;
    background: transparent;
    border: none;
    color: ${({ theme }) => theme.color.white};
    font-size: ${({ theme }) => theme.fontSize.input};
    font-family: ${({ theme }) => theme.fontFamily.sans};
    height: 36px;
    width: 100%;

    /* TODO: Review implementaiton */
    // i know the padding value looks suspicious, however the input height is 15px due to user agent 15px block-size.
    // we need an additional 25px to make up for the 40px height that come from the 24px icons with their 8px paddings
    /* padding: calc((40px - ${({ theme }) => theme.fontSize.input}) / 2) 0; */
    padding: 0;

    ${({ hasIconPrefix }) =>
      !hasIconPrefix &&
      css`
        padding-left: calc((40px - ${({ theme }) => theme.fontSize.input}) / 2);
      `}

    ${({ hasIconSuffix }) =>
      !hasIconSuffix &&
      css`
        padding-right: calc(
          (40px - ${({ theme }) => theme.fontSize.input}) / 2
        );
      `}
    &:active,
    &:focus {
      outline: none;
    }

    &::placeholder {
      color: ${({ theme }) => theme.color.grayDarker};
    }
  }
`;
