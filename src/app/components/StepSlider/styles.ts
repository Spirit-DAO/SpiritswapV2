import styled from '@emotion/styled';
import { Paragraph } from '../Typography';

export const StyledItem = styled.div`
  height: ${({ theme }) => `${theme.space.spacing04}`};
  width: ${({ theme }) => `${theme.space.spacing04}`};
  padding: ${({ theme }) => `${theme.space.spacing01}`};
  border-radius: ${({ theme }) => `${theme.borderRadius.full}`};
  background-color: ${({ theme }) => `${theme.colors.grayDarker}`};
  transition: all 0.1s ease-out;
  cursor: pointer;
  margin: auto;
`;

export const StyledItemWrapper = styled.div<{ isSelected: boolean }>`
  width: ${({ theme }) => `${theme.space.spacing07}`};
  cursor: pointer;
  color: ${({ theme, isSelected }) =>
    `${isSelected ? theme.colors.ci : theme.colors.gray}`};

  & > div {
    background-color: ${({ theme, isSelected }) =>
      `${isSelected ? theme.colors.ci : theme.colors.gray}`};
    box-shadow: ${({ theme }) => `0 0 0 4px ${theme.colors.ciTrans15}`};
  }
  & > p {
    color: ${({ theme, isSelected }) =>
      `${isSelected ? theme.colors.ci : theme.colors.gray}`};
  }
  &:hover {
    div {
      background-color: ${({ theme }) => `${theme.colors.ci}`};
    }
    p {
      color: ${({ theme }) => `${theme.colors.ci}`};
    }
  }
`;

export const StyledLabel = styled(Paragraph)`
  margin-top: ${({ theme }) => `${theme.space.spacing04}`};
  font-size: ${({ theme }) => `${theme.fontSizes.xs}`};
  letter-spacing: 1px;
  text-align: center;
`;

export const StyledHr = styled.hr`
  height: 4px;
  width: 97%;
  position: relative;
  bottom: 22px;

  border-radius: 8px;
  background-color: #1f2937;
  border: ${({ theme }) => `2px solid ${theme.colors.grayBorderToggle}`};
`;
