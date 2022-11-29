import styled from 'styled-components';
import { IconButton } from 'app/components/IconButton';
import { IconPoolButton } from 'app/pages/Liquidity/components/IconPoolButton';

export const StyledIconButton = styled(IconButton)`
  width: 100%;
  max-width: 456px;
  margin: auto;
  border-radius: 8px;
  background: ${({ theme }) => theme.color.grayBorderToggle};
  height: 64px;
  border: none;
  font-size: 24px;
`;

export const StyledIconPoolButton = styled(IconPoolButton)`
  width: 100%;
  max-width: 456px;
  margin: auto;
  padding: 16px;
  border-radius: 8px;
  background: ${({ theme }) => theme.color.grayBorderToggle};
  height: auto;
  border: none;
  font-size: 24px;
  justify-content: flex-start;
`;
