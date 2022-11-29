export interface Props {
  value: string;
  moneyValue?: string;
  tokens: Token[];
  onMaxClick: () => void;
  amountValue?: string;
  amountType?: string;
  onchange: (value: any) => void;
  amountStaked: string;
}
