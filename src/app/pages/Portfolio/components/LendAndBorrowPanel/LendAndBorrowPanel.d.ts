export interface Props {
  limitOrders?: string[];
}
export interface LendAndBorrowItem {
  symbol: string;
  amount: string;
  amountInUSD: string;
  apy: string;
}

export enum ActionType {
  Supplied,
  Borrowed,
}
