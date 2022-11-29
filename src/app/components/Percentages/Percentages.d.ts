export interface Props {
  balance: string;
  symbol: string;
  decimals: number;
  onChange?: ({
    tokenSymbol: string,
    value: string,
  }: {
    tokenSymbol: any;
    value: any;
  }) => void;
}
