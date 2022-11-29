import styled from 'styled-components';
import { Button } from 'app/components/Button';
import { ReactComponent as SettingApe } from 'app/assets/images/settings.svg';
import { ReactComponent as BusinessProductIcon } from 'app/assets/images/business-product.svg';
// import { ReactComponent as SlipPageNameIcon } from 'app/assets/images/question-3-circle.svg';

export const Container = styled.div<{ gridArea?: string }>`
  background: ${({ theme }) => `${theme.color.bgBox}`};
  border: 1px solid rgba(55, 65, 81, 1);
  padding: 8px;
  margin: 0 5px;
  border-radius: ${({ theme }) => `${theme.borderRadius.md}`};
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-area: ${props => props.gridArea};
    margin: 0;
    padding: 1.5rem;
  }
`;

export const AsideStyled = styled.div<{ gridArea?: string }>`
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-area: ${props => props.gridArea};
  }
`;

export const Panel = styled.div`
  padding: ${({ theme }) => `${theme.spacing.spacing06}`};
  border-radius: ${({ theme }) => `${theme.borderRadius.md}`};
  border: ${({ theme }) => `1px solid ${theme.color.grayBorderBox}`};
  background-color: ${({ theme }) => `${theme.color.bgBox}`};

  margin: 3px 0px;
  /* TODO: Review */
  // margin: 12px 8px;
`;

export const ApeContainer = styled.div`
  padding: 24px;
  width: 520px;
  height: auto;
  background: ${({ theme }) => theme.color.bgBox};
  border: 1px solid ${({ theme }) => theme.color.grayBorderBox};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: fit-content;
  }
`;

export const ApeConatinerHeader = styled.div`
  margin-top: ${({ theme }) => `${theme.spacing.spacing03}`};
  display: flex;
  align-items: center;
  justify-content: space-between;
  align-self: stretch;
`;

export const SettingApeIcon = styled(SettingApe)`
  color: ${({ theme }) => theme.color.ci};
`;
export const BusinessProduct = styled(BusinessProductIcon)`
  color: ${({ theme }) => theme.color.ci};
  margin-right: 16px;
`;
export const ContainerIcon = styled.div`
  display: flex;
  padding: 8px 0px;
  margin: 0px;
`;

export const TradingWrapper = styled.div`
  padding: 4px 0px;
  border-radius: 12px;
  margin: 16px 0px;
`;
export const ConnectWallet = styled(Button)`
  width: 100%;
  padding: 8px;
`;

export const ListItem = styled.div`
  display: flex;
  gap: ${({ theme }) => `${theme.spacing.spacing04}`};
  margin-top: ${({ theme }) => `${theme.spacing.spacing06}`};

  h3 {
    color: ${({ theme }) => `${theme.color.white}`};
  }

  p {
    margin-top: ${({ theme }) => `${theme.spacing.spacing02}`};
    color: ${({ theme }) => `${theme.color.gray}`};
    line-height: ${({ theme }) => `${theme.lineHeight.base}`};
  }
`;
export const InfoCardContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${({ theme }) => `${theme.spacing.spacing04}`};
`;
