export interface StyledRateProps {
  isPlus: boolean;
}

export interface Props {
  tokenName: string;
  tokenPriceCurrency: string;
  tokenPrice: number | null;
  tokenRate?: number | null;
}
