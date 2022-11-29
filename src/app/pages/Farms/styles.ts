import styled from '@emotion/styled';
import { Heading, Paragraph } from 'app/components/Typography';
import { SelectWithDropdown } from 'app/components/SelectWithDropdown';
import IconToInput from '../../components/IconToInput/IconToInput';
import { Box, Grid } from '@chakra-ui/react';

export const StyledContainer = styled(Box)`
  max-width: 1024px;
  padding: 154px 1rem 1rem;
  position: relative;
  margin: auto auto 250px;

  @media (max-width: 768px) {
    padding: 108px 1rem 1rem;
  }
`;

export const StyledRewardsWrapper = styled(Box)`
  display: flex;
  align-items: center;
  gap: 2rem;

  @media (max-width: 768px) {
    justify-content: space-between;
  }
`;

export const StyledRewardsSubtitle = styled(Paragraph)`
  color: ${({ theme }) => theme.colors.grayDarker};
`;

export const StyledFarmsControls = styled(Box)`
  margin-top: 2rem;

  & > div:first-of-type {
    margin-bottom: 1rem;

    & > div {
      width: 100%;
    }
    h4 {
      width: 100%;
    }
  }

  @media (min-width: 768px) {
    div:first-of-type {
      margin-bottom: 0;
      h4 {
        width: auto;
      }
    }

    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;

export const StyledDropdown = styled(SelectWithDropdown)`
  color: ${({ theme }) => theme.colors.white};
  background: ${({ theme }) => theme.colors.grayBorderBox};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  align-items: center;
  height: 28px;
  padding: ${({ theme }) =>
    `${theme.space.spacing02} ${theme.space.spacing03}`};

  label {
    font-size: ${({ theme }) => theme.fontSizes.h5};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.xs}) {
    padding: ${({ theme }) =>
      `${theme.space.spacing01} ${theme.space.spacing02}`};
  }
`;

export const StyledIconToInput = styled(IconToInput)``;

export const StyledH2Heading = styled(Heading)`
  font-size: 1.5rem;
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

export const StakedGrid = styled(Grid)`
  margin-bottom: 0.75rem;
`;
