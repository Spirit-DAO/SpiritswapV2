import styled from 'styled-components';
import { Select } from '../Select';

export const StyledSelect = styled(Select)`
  width: 100%;
  h4,
  input {
    height: 36px;
    width: 70px;
    padding: 0px;
  }

  h4 {
    margin-right: ${({ theme }) => theme.spacing.spacing03};
  }
`;

export const StyledInput = styled.input`
  background-color: ${({ theme }) => theme.color.bgInput};
  color: ${({ theme }) => theme.color.grayDarker};

  border: 1px solid ${({ theme }) => theme.color.grayBorderBox};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  outline: none;

  font-family: ${({ theme }) => theme.fontFamily.sans};
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: normal;
  line-height: ${({ theme }) => theme.lineHeight.base};

  height: 34px;
  text-align: center;

  &:focus {
    color: ${({ theme }) => theme.color.ci};
    border: 1px solid ${({ theme }) => theme.color.ciDark};
    /* outline: 1px solid ${({ theme }) => theme.color.ciDark}; */
  }
`;
