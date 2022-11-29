import { GelattoLimitOrder } from 'utils/swap/types';

export interface OpenLimitOrder {
  price?: string;
  paying?: string;
  receiving?: string;
  pair?: [string, string];
}

export interface LimitOrdersPanelProps {
  limitOrders: GelattoLimitOrder[];
}
