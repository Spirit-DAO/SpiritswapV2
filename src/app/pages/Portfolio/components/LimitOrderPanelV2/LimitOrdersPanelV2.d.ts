import { AlgebraLimitOrder } from 'utils/swap/types';

export interface OpenLimitOrder {
  [key: string]: any;
}

export interface LimitOrdersPanelProps {
  limitOrders: AlgebraLimitOrder[];
}
