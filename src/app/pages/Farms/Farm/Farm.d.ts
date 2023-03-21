import { IFarm } from 'app/interfaces/Farm';

export interface Props {
  farm: IFarm;
  isTransitioning: boolean;
  isOpen: boolean;
  TokenList: MemoExoticComponent<() => Element>;
  onWithdraw: (_amount: string) => Promise<any> | void;
  onDeposit: (_amount: string) => Promise<any> | void;
  onClaim: (position?: any) => any;
}
