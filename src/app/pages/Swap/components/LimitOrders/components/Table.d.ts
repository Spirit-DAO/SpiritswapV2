import { GelattoLimitOrder } from 'utils/swap/types';

export interface Props {
  columns?: column[];
  variantTable: string;
  limitOrderIndex: number;
  orders: GelattoLimitOrder[];
  monitor: Function;
}

export interface column {
  Header: string;
  accessor: string;
  isNumeric?: boolean;
}
