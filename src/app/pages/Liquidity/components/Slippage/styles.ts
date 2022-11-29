import styled from 'styled-components';

export const StyledSlippageItemTag = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
  margin: 2px 0px 0px 0px;
`;

export const StyledSlippageNameTag = styled.div`
  font-size: ${({ theme }) => theme.fontSize.h5};
  line-height: ${({ theme }) => theme.lineHeight.p};
  color: ${({ theme }) => theme.color.gray};
  display: flex;

  svg {
    margin-top: -15px;
    margin-left: 5px;
  }
`;

export const StyledSlippageValueTag = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  font-size: ${({ theme }) => theme.fontSize.h5};
  line-height: ${({ theme }) => theme.lineHeight.p};
  color: ${({ theme }) => theme.color.gray};

  svg {
    margin: 0px 0px 0px 4px;
  }
`;
