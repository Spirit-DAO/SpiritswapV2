import { Currency, Token, Price } from '../../../v3-sdk';

import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  IDerivedMintInfo,
  useInitialTokenPrice,
  useInitialUSDPrices,
} from 'store/v3/mint/hooks';
import { useAppDispatch } from 'store/hooks';
import {
  Field,
  setInitialTokenPrice,
  setInitialUSDPrices,
  updateSelectedPreset,
} from 'store/v3/mint/actions';
import { Input } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

interface IPrice {
  baseCurrency: Currency | undefined;
  quoteCurrency: Currency | undefined;
  basePrice: Price<Currency, Token> | undefined;
  quotePrice: Price<Currency, Token> | undefined;
  isLocked: boolean;
  isSelected: boolean;
}

interface ITokenPrice extends IPrice {
  userQuoteCurrencyToken?: string | undefined;
  changeQuotePriceHandler?: any;
}

interface IUSDPrice extends IPrice {
  userBaseCurrencyUSD: string | undefined;
  userQuoteCurrencyUSD: string | undefined;
  changeBaseCurrencyUSDHandler: any;
  changeQuoteCurrencyUSDHandler: any;
}

function TokenPrice({
  baseCurrency,
  quoteCurrency,
  basePrice,
  quotePrice,
  isLocked,
  userQuoteCurrencyToken,
  changeQuotePriceHandler,
  isSelected,
}: ITokenPrice) {
  const baseSymbol = useMemo(
    () => (baseCurrency ? baseCurrency.symbol : '-'),
    [baseCurrency],
  );
  const quoteSymbol = useMemo(
    () => (quoteCurrency ? quoteCurrency.symbol : '-'),
    [quoteCurrency],
  );

  const { t } = useTranslation();

  const tokenRatio = useMemo(() => {
    if (!basePrice || !quotePrice) return t`Loading...`;

    return String(
      (+basePrice.toSignificant(5) / +quotePrice.toSignificant(5)).toFixed(5),
    );
  }, [basePrice, quotePrice]);

  return (
    <div
      className={`token-price ${
        isSelected ? 'main' : 'side'
      } ws-no-wrap mxs_fs-075`}
    >
      <div className={'quote-token w-100 f'}>
        <div className="w-100">
          {isLocked ? (
            <div className="f f-ac">
              <span className="pl-1">Locked</span>
              <span className="quote-token__auto-fetched">{tokenRatio}</span>
            </div>
          ) : isSelected ? (
            <Input
              className={`quote-token__input bg-t c-w ol-n`}
              placeholder={`${baseCurrency?.symbol} in ${quoteCurrency?.symbol}`}
              value={userQuoteCurrencyToken || ''}
              onChange={e => changeQuotePriceHandler(e.target.value)}
            />
          ) : (
            <span>-</span>
          )}
        </div>
        <div className="quote-token__symbol ml-a">{quoteSymbol}</div>
      </div>
      <div className="quote-token__separator"> = </div>
      <div className="base-token">
        <div className="base-token__amount">1</div>
        <div className="base-token__symbol">{baseSymbol}</div>
      </div>
    </div>
  );
}

function USDPriceField({
  symbol,
  price,
  isSelected,
  userUSD,
  changeHandler,
}: {
  symbol: string | undefined;
  price: Price<Currency, Token> | undefined;
  isSelected: boolean;
  userUSD: string | undefined;
  changeHandler: (price: string) => void;
}) {
  const { t } = useTranslation();

  const _price = useMemo(
    () => (price ? price.toSignificant(5) : t`Loading...`),
    [price],
  );

  return (
    <div
      className={`usd-price-field w-100 f ac ws-no-wrap ${
        isSelected ? 'main' : 'side'
      } mxs_mb-1 mxs_ml-0`}
    >
      <div className="usd-price">
        <span className={'usd-price__amount'}>1 {symbol}</span>
        <span className={'usd-price__separator'}> = </span>
        <span className={'usd-price__dollar'}>$</span>
        {price ? (
          <span className={`usd-price__price`}>{_price}</span>
        ) : isSelected ? (
          <Input
            className={`ol-n usd-price__input`}
            value={userUSD || ''}
            onChange={e => changeHandler(e.target.value)}
            placeholder={`${symbol} in $`}
          />
        ) : (
          <span> - </span>
        )}
      </div>
    </div>
  );
}

function USDPrice({
  baseCurrency,
  quoteCurrency,
  basePrice,
  quotePrice,
  isLocked,
  userQuoteCurrencyUSD,
  userBaseCurrencyUSD,
  changeBaseCurrencyUSDHandler,
  changeQuoteCurrencyUSDHandler,
  isSelected,
}: IUSDPrice) {
  const baseSymbol = useMemo(
    () => (baseCurrency ? baseCurrency.symbol : '-'),
    [baseCurrency],
  );
  const quoteSymbol = useMemo(
    () => (quoteCurrency ? quoteCurrency.symbol : '-'),
    [quoteCurrency],
  );

  return (
    <div
      className={`f usd-price__wrapper ${
        isSelected ? 'main' : 'side'
      } mxs_fd-c`}
    >
      <USDPriceField
        symbol={baseSymbol}
        price={basePrice}
        isSelected={isSelected}
        userUSD={userBaseCurrencyUSD}
        changeHandler={changeBaseCurrencyUSDHandler}
      ></USDPriceField>
      <USDPriceField
        symbol={quoteSymbol}
        price={quotePrice}
        isSelected={isSelected}
        userUSD={userQuoteCurrencyUSD}
        changeHandler={changeQuoteCurrencyUSDHandler}
      ></USDPriceField>
    </div>
  );
}

interface IStartingPrice {
  currencyA: Currency | undefined;
  currencyB: Currency | undefined;
  startPriceHandler: (value: string) => void;
  mintInfo: IDerivedMintInfo;
}

export default function StartingPrice({
  currencyA,
  currencyB,
  startPriceHandler,
  mintInfo,
}: IStartingPrice) {
  const dispatch = useAppDispatch();
  const initialUSDPrices = useInitialUSDPrices();
  const initialTokenPrice = useInitialTokenPrice();

  const isSorted =
    currencyA &&
    currencyB &&
    currencyA?.wrapped.sortsBefore(currencyB?.wrapped);

  const [userBaseCurrencyUSD, setUserBaseCurrencyUSD] = useState<
    string | undefined
  >(initialUSDPrices.CURRENCY_A);
  const [userQuoteCurrencyUSD, setUserQuoteCurrencyUSD] = useState<
    string | undefined
  >(initialUSDPrices.CURRENCY_B);

  const [userQuoteCurrencyToken, setUserQuoteCurrencyToken] = useState<
    string | undefined
  >(
    mintInfo && isSorted
      ? mintInfo.price?.toSignificant(5)
      : mintInfo.price?.invert().toSignificant(5) || undefined,
  );

  useEffect(() => {
    if (initialTokenPrice) {
      startPriceHandler(initialTokenPrice);
      setUserQuoteCurrencyToken(initialTokenPrice);
    }
  }, [initialTokenPrice]);

  return (
    <div
      className={'f starting-price-wrapper c p-1'}
      style={{ width: '100%', backgroundColor: 'var(--ebony-clay)' }}
    >
      {/* <div className={"flex-s-between"}>
                {isLocked ? (
                    <span className={"auto-fetched"}>
                        <Trans>✨ Prices were auto-fetched</Trans>
                    </span>
                ) : !basePriceUSD && !quotePriceUSD ? (
                    <span className={"not-auto-fetched"}>{t`Can't auto-fetch prices.`}</span>
                ) : !basePriceUSD ? (
                    <span className={"not-auto-fetched"}>{t`Can't auto-fetch ${currencyA?.symbol} price.`}</span>
                ) : !quotePriceUSD ? (
                    <span className={"not-auto-fetched"}>{t`Can't auto-fetch ${currencyB?.symbol} price.`}</span>
                ) : null}
            </div> */}
      {/* <TokenPrice
                            baseCurrency={currencyA}
                            quoteCurrency={currencyB}
                            basePrice={basePriceUSD}
                            quotePrice={quotePriceUSD}
                            isLocked={isLocked}
                            userQuoteCurrencyToken={userQuoteCurrencyToken}
                            changeQuotePriceHandler={(v: string) => handleTokenChange(v)}
                            isSelected={priceFormat === PriceFormats.TOKEN}
                        ></TokenPrice> */}
      {/* <div className={"br-8 mt-1 f c"}>
                <div className={`f ${priceFormat === PriceFormats.TOKEN ? "reverse" : "c"}`}>
                    {priceFormat === PriceFormats.TOKEN ? (
                        <TokenPrice
                            baseCurrency={currencyA}
                            quoteCurrency={currencyB}
                            basePrice={basePriceUSD}
                            quotePrice={quotePriceUSD}
                            isLocked={isLocked}
                            userQuoteCurrencyToken={userQuoteCurrencyToken}
                            changeQuotePriceHandler={(v: string) => handleTokenChange(v)}
                            isSelected={priceFormat === PriceFormats.TOKEN}
                        ></TokenPrice>
                    ) : (
                        <USDPrice
                            baseCurrency={currencyA}
                            quoteCurrency={currencyB}
                            basePrice={basePriceUSD}
                            quotePrice={quotePriceUSD}
                            isLocked={isLocked}
                            userBaseCurrencyUSD={userBaseCurrencyUSD}
                            userQuoteCurrencyUSD={userQuoteCurrencyUSD}
                            changeBaseCurrencyUSDHandler={(v: string) => handleUSDChange(Field.CURRENCY_A, v)}
                            changeQuoteCurrencyUSDHandler={(v: string) => handleUSDChange(Field.CURRENCY_B, v)}
                            isSelected={priceFormat === PriceFormats.USD}
                        ></USDPrice>
                    )}
                </div>
            </div> */}
    </div>
  );
}
