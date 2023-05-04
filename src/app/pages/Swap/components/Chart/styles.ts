import { VStack } from '@chakra-ui/react';
import styled from '@emotion/styled';

export const ChartContainer = styled(VStack)<{ isLimit: boolean }>`
  padding: 16px 8px;

  margin-top: 0;
  margin-bottom: ${({ theme }) => `${theme.space.spacing03}`};
  margin-left: ${({ theme }) => `${theme.space.spacing03}`};

  @media (max-width: 1100px) {
    margin-top: ${({ theme, isLimit }) =>
      !isLimit ? '0' : `${theme.space.spacing03}`};
    margin-left: 0;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-top: ${({ theme }) => `${theme.space.spacing03}`};
    width: 100%;
  }
`;

export const HeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 10px;
`;
