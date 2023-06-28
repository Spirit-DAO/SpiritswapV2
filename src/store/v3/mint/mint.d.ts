import { Field } from './actions';
import { FullRange, Presets } from './reducer';

export interface MintState {
  readonly independentField: Field;
  readonly typedValue: string;
  readonly startPriceTypedValue: string; // for the case when there's no liquidity
  readonly leftRangeTypedValue: string | FullRange;
  readonly rightRangeTypedValue: string | FullRange;
  readonly dynamicFee: number;
  readonly preset: Presets | null;
  readonly txHash: string;
  readonly showNewestPosition: boolean;
  readonly initialUSDPrices: {
    [Field.CURRENCY_A]: string;
    [Field.CURRENCY_B]: string;
  };
  readonly initialTokenPrice: string;
  readonly currentStep: number;
}
