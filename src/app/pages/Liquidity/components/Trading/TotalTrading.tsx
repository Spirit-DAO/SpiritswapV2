import { useTranslation } from 'react-i18next';
import { Heading } from 'app/components/Typography';
import { Props } from './TotalTrading.d';
import {
  StyledTotalTradingTitle,
  StyledTotalTradingPrice,
  StyledTotalTradingApproxPrice,
} from './styles';

const TotalTrading = ({
  liquidityTradeEstimate,
  liquidityTradeEstimateUSD,
}: Props) => {
  const { t } = useTranslation();
  const translationPath = 'home.about.swap.trading.totalTrading';
  return (
    <StyledTotalTradingTitle data-testid="TotalTrading">
      {t(`${translationPath}.YouWillReceive`)}
      <StyledTotalTradingPrice>
        <Heading level={4}>{liquidityTradeEstimate}</Heading>
        <StyledTotalTradingApproxPrice>
          {liquidityTradeEstimateUSD}
        </StyledTotalTradingApproxPrice>
      </StyledTotalTradingPrice>
    </StyledTotalTradingTitle>
  );
};

export default TotalTrading;
