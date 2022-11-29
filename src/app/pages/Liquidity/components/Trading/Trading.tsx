import { FC, useState, useEffect } from 'react';
// import { useTranslation } from 'react-i18next';
import { Props } from './Trading.d';
import { TokenAmountPanel } from 'app/components/TokenAmountPanel';
import {
  StyledSwapIcon,
  StyledArrowDownIcon,
  StyledSwapToken,
  StyledTradingItem,
} from './styles';
import { Currency, Token, Wallet } from 'app/utils';
import { tokenConversionRateMap } from 'app/components/TokenAmountPanel/TokenAmountPanel.stories';

const Trading: FC<Props> = ({
  title,
  balancePrice,
  isDisplayBalance,
  tradingAmount,
  tradingTokenSymbol,
  tradingActualPrice,
  tradingApproxPrice,
  tradingLogo,
  showSwapIcon,
  birectional,
  limitValueName,
  limitSubValueName,
  isDisplayRefresh,
  limitValue,
  onChangeInput,
  index,
  totalTradingTitleName,
  totalTradingActualPriceValue,
  totalTradingApproxPriceValue,
  liquidityPools,
  userPortfolio,
  ratePrice,
  limitSwap,
  ...props
}) => {
  const [userWallet, setUserWallet] = useState<Wallet>({
    portfolio: {},
    rates: {},
  });
  useEffect(() => {
    const updateUserPortfolio = () => {
      const newWallet: Wallet = {
        portfolio: {},
        rates: {},
      };
      if (userPortfolio) {
        userPortfolio.forEach(token => {
          newWallet.portfolio[token.symbol] = parseFloat(token.amount).toFixed(
            5,
          );
        });

        setUserWallet(newWallet);
      }
    };

    updateUserPortfolio();
  }, [userPortfolio]);

  const conversionRates = ratePrice
    ? {
        [`${tradingTokenSymbol}`]: {
          token: tradingTokenSymbol,
          conversionRate: parseFloat(ratePrice),
          currency: Currency.USD,
        },
      }
    : tokenConversionRateMap;

  return (
    <>
      <StyledTradingItem data-testid="Trading">
        <TokenAmountPanel
          limitSwap={limitSwap}
          currency={Currency.USD}
          tokenConversionRates={conversionRates}
          defaultSelectedToken={Token.SPIRIT}
          wallet={userWallet}
          value={{
            value: parseFloat(`${tradingAmount}`),
            token: tradingTokenSymbol || Token.SPIRIT,
          }}
          direction={index ? 'out' : 'in'}
          liquidityPools={liquidityPools}
          onChange={event => onChangeInput(event, index)}
        />
      </StyledTradingItem>

      {showSwapIcon ? (
        <StyledSwapToken>
          {birectional ? <StyledSwapIcon /> : <StyledArrowDownIcon />}
        </StyledSwapToken>
      ) : null}
    </>
  );
};

export default Trading;
