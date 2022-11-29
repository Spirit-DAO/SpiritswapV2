import { Box, VStack } from '@chakra-ui/react';
import styled from '@emotion/styled';
import { Select } from 'app/components/Select';

export const StyledContent = styled(Box)<{ direction?: string }>`
  display: flex;
  flex-direction: ${({ direction }) => direction || 'row'};
`;

export const StyledGrid = styled(Box)`
  display: grid;
  grid-template-columns: 50% 50%;
  grid-gap: 8px;
`;

export const StyledLabel = styled(Box)`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.grayDarker};
`;

export const StyledTitleBox = styled(Box)`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.ci};
  width: 100%;
  background: ${({ theme }) => theme.colors.bgBoxLighter};
  padding: 10px;
  text-align: center;
  margin-bottom: 4px;
`;

export const StyledDataBox = styled(VStack)<{ isteal?: boolean }>`
  padding: 8px;
  border-radius: 4px;
  background-color: ${({ theme, isteal }) =>
    isteal ? theme.colors.ciTrans15 : theme.colors.bgBoxLighter};
  align-items: flex-start;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    /* margin: 4px; */
  }
  margin-top: 0.5rem;
`;

export const StyledValue = styled(StyledLabel)<{
  primary?: boolean;
  size?: number;
}>`
  font-size: ${({ size }) => size || 20}px;
  color: ${({ theme }) => theme.colors.white};

  &:nth-of-type(1) {
    font-size: 16px;
  }
  &:nth-of-type(2),
  &:nth-of-type(3) {
    color: ${({ theme, primary }) => primary && theme.colors.ci};
  }
`;

export const StyledSubText = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.grayDarker};
`;

export const StyledSubHeader = styled(StyledGrid)`
  margin: 16px 0;
`;

export const StyledSelectContainer = styled(StyledContent)`
  justify-content: flex-end;
`;

export const StyledChartContainer = styled.div`
  margin: 16px 0;
`;

export const TimeFrameSelect = styled(Select)`
  h4 {
    font-size: 12px;
  }
`;
