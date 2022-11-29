import styled from 'styled-components';
import { ReactComponent as ArrowDown } from 'app/assets/images/arrow-down.svg';
import { IconButton } from 'app/components/IconButton';
import { IconPoolButton } from 'app/pages/Liquidity/components/IconPoolButton';

export const StyledArrowDownLogo = styled(ArrowDown)`
  color: ${({ theme }) => theme.color.green};
`;

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
  border-radius: 8px;
  background: ${({ theme }) => theme.color.grayBorderToggle};
  height: 64px;
  border: none;
  font-size: 24px;
`;

export const StyledPlusLogoWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 41px;
`;
