import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components';

const StyledSpan = styled.span`
  color: ${({ theme }) => theme.color.ciDark};
`;

export function PortfolioPage() {
  return (
    <>
      <Helmet>
        <title>PortfolioPage</title>
        <meta name="description" content="A Boilerplate application homepage" />
      </Helmet>
      <StyledSpan>Portfolio container</StyledSpan>
    </>
  );
}
