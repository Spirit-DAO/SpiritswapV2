import * as React from 'react';
import styled from 'styled-components';

const StyledContainer = styled.button<{
  textColor: string;
}>`
  background: ${({ theme }) => theme.color.bgDark};
  color: ${({ textColor }) => textColor};
  // custom style
  font-size: 1rem;
  font-weight: bold;
  padding: 1rem;
`;

export type Props = {
  children: React.ReactNode;
  textColor?: string;
};

const ExampleButton: React.FC<Props> = ({
  children,
  textColor = 'red',
}: Props) => (
  <StyledContainer textColor={textColor}>{children}</StyledContainer>
);

export default ExampleButton;
