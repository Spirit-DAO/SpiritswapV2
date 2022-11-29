export interface Props {
  tokenName: string;
  tokenAmount: string | number;
  tokenAddress?: string;
  usdAmount: string | number;
  options: { id: number | string; value: string; type: string }[];
}
