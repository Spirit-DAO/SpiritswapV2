import { TokenAmount } from 'app/interfaces/General';

export interface Props {
  onConfirm: () => void;
  onCancel: () => void;
  sharePool: number | string;
  price: string;
  parsedAmounts: any;
  tokensWithValue?: TokenAmount[];
  isWeightedPool?: boolean;
  poolName?: string;
  isLoading?: boolean;
  zapDirectly: boolean;
  poolData?: any;
  setZapDirectly: (boolean) => void;
}
