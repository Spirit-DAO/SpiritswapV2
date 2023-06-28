import { Presets } from 'store/v3/mint/reducer';

export interface PresetsArgs {
  type: Presets;
  min: number;
  max: number;
}

export interface Props {
  isInvalid: boolean;
  outOfRange: boolean;
  isStablecoinPair: boolean;
  activePreset: Presets | null;
  handlePresetRangeSelection: (preset: PresetsArgs | null) => void;
  priceLower: string | undefined;
  priceUpper: string | undefined;
  price: string | undefined;
}
