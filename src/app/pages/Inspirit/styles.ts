import { Box } from '@chakra-ui/react';
import styled from '@emotion/styled';

export const StyledContainer = styled(Box)<{ ismobile?: string }>`
  padding-top: ${props => (props.ismobile ? '124px' : '168px')};

  padding-bottom: 175px;
  max-width: ${({ theme }) => theme.breakpoints.xl};
  margin: auto;
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: grid;
    grid-template-columns: clamp(30%, 10%, 40%) 1fr;
    gap: 0.5rem;
    margin-top: 10px;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    padding-left: 1em;
    padding-right: 1em;
  }
`;

export const Container = styled.div<{
  gridArea?: string;
  height?: string;
  isMobile?: boolean;
}>`
  background: rgba(16, 23, 38, 1);
  border: 1px solid rgba(55, 65, 81, 1);
  padding: 1rem;
  height: fit-content;

  border-radius: ${({ theme }) => `${theme.borderRadius.md}`};
  border: ${({ theme }) => `1px solid ${theme.colors.grayBorderBox}`};
  background-color: ${({ theme }) => `${theme.colors.bgBox}`};

  max-width: ${({ isMobile }) => (isMobile ? '92%' : '98%')};
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-area: ${props => props.gridArea};
    padding: ${({ theme }) => theme.space.spacing056};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    max-width: 100%;
  }
`;

export const StyledAside = styled.div<{ gridArea?: string }>`
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-area: ${props => props.gridArea};
  }
`;

export const StyledVoting = styled.div<{
  gridArea?: string;
  isMobile?: boolean;
}>`
  max-width: ${({ isMobile }) => (isMobile ? '92%' : '98%')};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-area: ${props => props.gridArea};
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    max-width: 100%;
  }
`;

export const StyledPanel = styled.div`
  padding: 0.5rem;
  border-radius: ${({ theme }) => `${theme.borderRadius.md}`};
  border: ${({ theme }) => `1px solid ${theme.colors.grayBorderBox}`};
  background-color: ${({ theme }) => `${theme.colors.bgBox}`};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.space.spacing056};
  }
`;

export const Description = styled.div`
  color: rgba(209, 213, 219, 1);
  font-size: 12px;
  line-height: 17.34px;
  font-weight: normal;
  font-family: 'Jost', sans-serif;
`;

export const Card = styled.div<{
  isGreen?: boolean;
  alignCenter?: boolean;
  flex?: boolean;
  fullWidth?: boolean;
  fullHeight?: boolean;
}>`
  background: ${props =>
    props.isGreen ? 'rgba(100, 221, 192, 0.15)' : 'rgba(23, 32, 47, 1)'};
  border: ${props => props.isGreen && '1px solid rgba(96, 230, 197, 1)'};
  text-align: ${props => props.alignCenter && 'center'};
  padding: 12px;
  border-radius: ${({ theme }) => `${theme.borderRadius.md}`};
  display: grid;
  width: ${props => props.fullWidth && '100%'};
  height: ${props => props.fullHeight && '100%'};
  margin: ${props => (props.fullWidth ? '0' : '3px')};
  gap: 0.5rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    display: ${props => props.flex && 'flex'};
    align-items: ${props => props.flex && 'center'};
    justify-content: ${props => props.flex && 'space-between'};
  }
`;

export const CardTitle = styled.div`
  color: rgba(156, 163, 175, 1);
  font-family: 'Jost', sans-serif;
  font-size: 14px;
  line-height: 18px;
`;

export const CardDescription = styled.div<{ pb12?: boolean }>`
  color: #fff;
  font-family: 'Jost', sans-serif;
  font-size: 20px;
  padding-bottom: ${props => props.pb12 && '12px'};
  text-align: left;
  margin-top: 0.5rem;
`;

export const NumberStyled = styled.div<{ isGreen?: boolean }>`
  color: ${props => (props.isGreen ? props.theme.colors.ci : '#fff')};
  font-family: 'Jost', sans-serif;
  background: ${props =>
    props.isGreen ? 'rgba(100, 221, 192, 0.15)' : '#1F2937'};
  height: 29px;
  margin: 2px;
  margin-right: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0.25rem;
  padding: 0.5rem;
  font-variant-numeric: tabular-nums;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding: 0.5rem 1rem;
  }
`;

export const CardContainer = styled.div<{
  gridArea?: string;
  fullHeight?: boolean;
}>`
  grid-area: ${({ gridArea }) => gridArea};
  height: ${({ fullHeight }) => fullHeight && '100%'};
  display: grid;
`;

export const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: flex;
    flex-direction: row;
  }
`;

export const FixedWidthCardContainer = styled(CardContainer)`
  width: 100%;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    width: 40%;
  }
`;

/* 
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding-top: 160px;
    display: grid;
    grid-template-columns: 467px 1fr 1fr;
    grid-template-rows: 0fr 1fr 1fr;
    gap: 4px 5px;

    grid-template-areas:${({ spiritLocked }) =>
      spiritLocked
        ? `
      'Aside Dashboard Dashboard'
      'Voting Voting Voting'
      'Stats Stats Stats';`
        : `
      'Aside Dashboard Dashboard'
      'Aside Dashboard Dashboard'
      'Stats Stats Stats';
      `}
  }
*/
