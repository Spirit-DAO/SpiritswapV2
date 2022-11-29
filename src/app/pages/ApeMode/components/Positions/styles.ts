import styled from 'styled-components';
import { Icon } from 'app/components/Icon';
export const PositionsContainer = styled.div<{ gridArea?: string }>`
  background: ${({ theme }) => `${theme.color.bgBox}`};
  border: 1px solid rgba(55, 65, 81, 1);
  padding: 8px;
  border-radius: ${({ theme }) => `${theme.borderRadius.md}`};
  overflow: scroll;
  overflow-y: hidden;
  -ms-overflow-y: hidden;
  scrollbar-width: none;
  text-transform: none;
  -ms-overflow-style: none;
`;
export const PositionsQuantity = styled.p`
  margin-top: 16px;
  margin: 5px 0 10px 0;
  font-size: ${({ theme }) => theme.fontSize.md};
  line-height: ${({ theme }) => theme.lineHeight.p};
  color: ${({ theme }) => theme.color.grayDarker};
`;
export const HeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 10px;
`;

export const StyledIcon = styled(Icon)`
  color: ${({ theme }) => `${theme.color.ci}`};
  border-radius: ${({ theme }) => `${theme.borderRadius.md}`};
  padding: ${({ theme }) => `${theme.spacing.spacing01}`};
  margin-right: 3px;
`;
