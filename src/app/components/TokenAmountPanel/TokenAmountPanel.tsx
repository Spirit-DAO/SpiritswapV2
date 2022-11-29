import { FC, useCallback, useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../Button';
import type { Props } from './TokenAmountPanel.d';
import {
  LimitOrderPanelFooterWrapper,
  TokenAmountPanelWrapper,
  InputAndTokenWrapper,
  InputWrapper,
  TokenWrapper,
  StyledInput,
  CurrencyEstimateAndBalanceWrapper,
  CurrencyEstimateWrapper,
  BalanceWrapper,
  LimitOrderLabelWrapper,
  LimitOrderLabel,
  LimitOrderWarning,
  LimitOrderInputWrapper,
  StyledLimitOrderInput,
  TokenDropdownWrapper,
  StyledTokenDropdown,
  PercentageWrapper,
} from './styles';
import { TokenIcon } from '../TokenIcon';
import { Token, Currency, CurrencyOption } from 'app/utils';
import { tokens } from 'constants/tokens';
import { formatCurrency, formatCryptoNumber } from '../../utils/methods';
import { ReactComponent as CaretDown } from 'app/assets/images/caret-down.svg';
import { ReactComponent as Refresh } from 'app/assets/images/refresh.svg';

const defaultDropDownItems: CurrencyOption[] = tokens.map((token, i) => ({
  value: token.symbol,
  id: i,
  type: 'tokens',
}));

const TokenAmountPanel: FC<Props> = ({
  limitSwap,
  value,
  defaultSelectedToken,
  wallet,
  currency = Currency.USD,
  tokenConversionRates,
  onChange,
  onClick,
  showPercentage,
  canSelect = true,
  direction,
}: Props) => {
  const { t } = useTranslation();
  const translationPath = 'common.tokenAmountPanel';

  const [currentToken, setCurrentToken] = useState(
    value?.token ? Token[value?.token] : defaultSelectedToken,
  );
  const [inputFocused, setInputFocused] = useState(false);
  const [tokenDropdownItems, setTokenDropdownItems] =
    useState<CurrencyOption[]>(defaultDropDownItems);

  useEffect(() => {
    const setComponentData = async () => {
      if (direction === 'in' && wallet?.portfolio) {
        const inputTokenDropDown: CurrencyOption[] = Object.keys(
          wallet.portfolio,
        ).map((token, index) => {
          return {
            value: token,
            id: index,
            type: 'tokens',
          };
        });

        return setTokenDropdownItems(inputTokenDropDown);
      }
    };
    setComponentData();
  }, [setTokenDropdownItems, direction, wallet]);

  const onFocusInput = useCallback(() => {
    setInputFocused(true);
  }, [setInputFocused]);

  const onBlurInput = useCallback(() => {
    setInputFocused(false);
  }, [setInputFocused]);

  const currentTokenIndex = useMemo(
    () => Object.values(Token).findIndex(token => token === currentToken),
    [currentToken],
  );

  const tokenValue: number = wallet?.portfolio[currentToken] || 0;

  const conversionRate: number =
    (currentToken &&
      tokenConversionRates &&
      tokenConversionRates[currentToken]?.conversionRate) ||
    0;

  const onClickChangeHalf = useCallback(() => {
    onChange?.({
      value: tokenValue * 0.5,
      token: currentToken,
    });
  }, [onChange, tokenValue, currentToken]);

  const onClickChangeFull = useCallback(() => {
    onChange?.({
      value: tokenValue,
      token: currentToken,
    });
  }, [onChange, tokenValue, currentToken]);

  const [tokenDropdownVisible, setTokenDropdownVisible] = useState(false);

  const hideTokenDropdownCallback = useCallback(() => {
    setTokenDropdownVisible(false);
  }, []);

  /*
  const showTokenDropdownCallback = useCallback(() => {
    setTokenDropdownVisible(true);
  }, []); */

  const onTokenDropdownSelect = useCallback(
    (selectedTokenId: number) => {
      const [selectedToken] = tokenDropdownItems.filter(
        token => token.id === selectedTokenId,
      );
      onChange?.({
        value: value?.value || 0,
        token: selectedToken.value,
      });

      setCurrentToken(selectedToken.value);
    },
    [onChange, value?.value, tokenDropdownItems],
  );

  const onChangeInput = useCallback(
    (parsedValue: number) => {
      if (parsedValue !== undefined) {
        onChange?.({
          value: parsedValue,
          token: `${value?.token}`,
        });

        setCurrentToken(`${value?.token}`);
      }
    },
    [onChange, value?.token],
  );

  return (
    <TokenAmountPanelWrapper
      limitSwapEnabled={!!limitSwap}
      data-testid="TokenAmountPanel"
    >
      <InputAndTokenWrapper>
        <InputWrapper isFocused={inputFocused}>
          <StyledInput
            value={value?.value}
            onChange={onChangeInput}
            onFocus={onFocusInput}
            onBlur={onBlurInput}
          />
        </InputWrapper>
        <TokenWrapper>
          <TokenDropdownWrapper onClick={onClick}>
            <TokenIcon size={32} token={currentToken} />
            {currentToken}
            {tokenDropdownVisible && canSelect && <CaretDown />}
          </TokenDropdownWrapper>
          {tokenDropdownVisible && canSelect && (
            <StyledTokenDropdown
              items={tokenDropdownItems}
              onClickOutside={hideTokenDropdownCallback}
              onSelect={onTokenDropdownSelect}
              selectedId={currentTokenIndex}
            />
          )}
        </TokenWrapper>
      </InputAndTokenWrapper>
      <CurrencyEstimateAndBalanceWrapper>
        <CurrencyEstimateWrapper>
          {(!direction || direction === 'in') && (
            <>
              &#x2248;{' '}
              {formatCurrency(currency, (value?.value || 0) * conversionRate)}
            </>
          )}
        </CurrencyEstimateWrapper>
        <BalanceWrapper>
          {(wallet && (
            <>
              {t(`${translationPath}.balance`)}:{' '}
              {formatCryptoNumber(tokenValue, 2)}
            </>
          )) || <>{t(`${translationPath}.notConnected`)}</>}
        </BalanceWrapper>
      </CurrencyEstimateAndBalanceWrapper>

      {showPercentage && (
        <PercentageWrapper>
          <Button variant="secondary" onClick={onClickChangeHalf}>
            25%
          </Button>
          <Button variant="secondary" onClick={onClickChangeHalf}>
            50%
          </Button>
          <Button variant="secondary" onClick={onClickChangeHalf}>
            75%
          </Button>
          <Button variant="secondary" onClick={onClickChangeFull}>
            {t(`${translationPath}.max`)}
          </Button>
        </PercentageWrapper>
      )}
      {!!limitSwap && (
        <LimitOrderPanelFooterWrapper>
          <LimitOrderLabelWrapper>
            <LimitOrderLabel>
              {t(`${translationPath}.setLimit.${limitSwap}`)}
            </LimitOrderLabel>
            <LimitOrderWarning>
              -0.32 %{' '}
              {t(
                `${translationPath}.market.${
                  limitSwap === 'buy' ? 'above' : 'below'
                }`,
              )}
            </LimitOrderWarning>
          </LimitOrderLabelWrapper>
          <LimitOrderInputWrapper>
            <StyledLimitOrderInput
              readOnly={true}
              iconPrefix={<Refresh />}
              value={formatCurrency(
                currency,
                (value?.value || 1) * conversionRate,
              )}
            />
          </LimitOrderInputWrapper>
        </LimitOrderPanelFooterWrapper>
      )}
    </TokenAmountPanelWrapper>
  );
};

export default TokenAmountPanel;
