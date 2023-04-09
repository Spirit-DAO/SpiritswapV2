import { AlgebraLimitOrder } from 'utils/swap/types';

export interface Props {
  columns?: column[];
  variantTable: string;
  limitOrderIndex: number;
  orders: AlgebraLimitOrder[];
  monitor: Function;
}

export interface column {
  Header: string;
  accessor: string;
  isNumeric?: boolean;
}
