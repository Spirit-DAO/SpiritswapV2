import React, { useCallback } from 'react';
import { useArgs } from '@storybook/client-api';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import {
  Currency,
  Token,
  TokenCurrencyConversionRate,
  TokenCurrencyConversionRateMap,
  Wallet,
  TokenValue,
} from 'app/utils';

import TokenAmountPanel from './TokenAmountPanel';
import type { Props } from './TokenAmountPanel.d';

export const tokenConversionRateMap: TokenCurrencyConversionRateMap =
  Object.values(Token).reduce((previous, current: Token, index: number) => {
    const conversionRate = Math.abs(Math.sin(index + 1)) * 5 + index * 0.2;
    // @ts-ignore
    previous[current] = {
      token: current,
      conversionRate: conversionRate,
      currency: Currency.USD,
    } as TokenCurrencyConversionRate;
    return previous;
  }, {} as TokenCurrencyConversionRateMap);

export const examplePortfolio: { [key in keyof typeof Token]: number } =
  Object.values(Token).reduce((previous, current: Token, index: number) => {
    // @ts-ignore
    previous[current] = Math.abs(Math.cos(index + 1.5)) * 20071 + index * 2.2;
    return previous;
  }, {} as { [key in keyof typeof Token]: number });

export const exampleWallet: Wallet = {
  portfolio: examplePortfolio,
  rates: {},
};

// noinspection JSUnusedGlobalSymbols
export default {
  title: 'SpiritSwap/Components/TokenAmountPanel',
  component: TokenAmountPanel,
  args: {
    limitSwap: false,
    currency: Currency.USD,
    tokenConversionRates: tokenConversionRateMap,
    defaultSelectedToken: Token.BNB,
    wallet: exampleWallet,
    value: undefined,
  },
} as ComponentMeta<typeof TokenAmountPanel>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
// noinspection RequiredAttributes
const Template: ComponentStory<typeof TokenAmountPanel> = (args: Props) => (
  <TokenAmountPanel {...args} />
);

const ControlledTemplate: ComponentStory<typeof TokenAmountPanel> = args => {
  const [{ value, onChange }, updateArgs] = useArgs();
  const onChangeCallback = useCallback(
    (value: TokenValue) => {
      const clampedValue = {
        value: Math.max(
          Math.min(value.value, examplePortfolio[value.token]),
          0,
        ),
        token: value.token,
      };
      updateArgs({ value: clampedValue });
      onChange?.(clampedValue);
    },
    [onChange, updateArgs],
  );
  return (
    <TokenAmountPanel {...args} value={value} onChange={onChangeCallback} />
  );
};

export const Default = Template.bind({});
Default.args = {};

export const WalletNotConnected = Template.bind({});
WalletNotConnected.args = {
  wallet: undefined,
};

export const Controlled = ControlledTemplate.bind({});
Controlled.args = {
  value: {
    value: 3.141,
    token: Token.HODL,
  },
};

export const LimitSwapBuy = Template.bind({});
LimitSwapBuy.args = {
  limitSwap: 'buy',
};

export const LimitSwapSell = Template.bind({});
LimitSwapSell.args = {
  limitSwap: 'sell',
};
