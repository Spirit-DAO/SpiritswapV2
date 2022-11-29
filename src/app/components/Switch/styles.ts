import styled from 'styled-components';
import { Heading } from '../Typography';

export const StyledHeading = styled(Heading)`
  margin-right: ${({ theme }) => theme.spacing.spacing03};
`;

export const StyledChekbox = styled.div`
  position: relative;
  display: inline-block;

  width: ${({ theme }) => theme.spacing.spacing08};
  height: ${({ theme }) => theme.spacing.spacing06};
`;

export const StyledSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  background: ${({ theme }) => theme.color.ciTrans15};
  border-radius: ${({ theme }) => theme.borderRadius.sm};

  -webkit-transition: 0.4s;
  transition: 0.4s;

  &:before {
    position: absolute;
    content: '';
    left: ${({ theme }) => theme.spacing.spacing02};
    bottom: ${({ theme }) => theme.spacing.spacing02};

    background-color: ${({ theme }) => theme.color.white};
    border-radius: ${({ theme }) => theme.borderRadius.sm};

    height: ${({ theme }) => theme.spacing.spacing05};
    width: ${({ theme }) => theme.spacing.spacing05};

    -webkit-transition: 0.4s;
    transition: 0.4s;
  }
`;

export const StyledInput = styled.input.attrs({ type: 'checkbox' })`
  position: relative;
  cursor: pointer;

  width: 100%;
  height: 100%;
  margin: 0;

  opacity: 0;
  z-index: 1;

  &:checked + ${StyledSlider}:before {
    -webkit-transform: translateX(16px);
    -ms-transform: translateX(16px);
    transform: translateX(16px);
    background-color: ${({ theme }) => theme.color.ci};
  }
`;
