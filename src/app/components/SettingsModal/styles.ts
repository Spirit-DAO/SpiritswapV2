import styled from '@emotion/styled';
import ImageLogo from '../ImageLogo';
import { SelectWithDropdown } from '../SelectWithDropdown';

export const BodyContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  margin-top: ${({ theme }) => theme.space.spacing03};
  min-width: 300px;
`;

export const Label = styled.label`
  font-weight: ${({ theme }) => theme.fontWeights.normal};
  font-size: ${({ theme }) => theme.fontSizes.base};
  line-height: ${({ theme }) => theme.lineHeights.h5};
  color: ${({ theme }) => theme.colors.gray};
  margin: 14px 0;
`;

export const StyledSelectWithDropdown = styled(SelectWithDropdown)`
  padding: 0;
  button {
    margin-top: ${({ theme }) => theme.space.spacing01};
    margin-bottom: ${({ theme }) => theme.space.spacing01};
  }
  img {
    margin-right: ${({ theme }) => theme.space.spacing03};
  }
`;
