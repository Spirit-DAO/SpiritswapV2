import { IFarmTransaction } from 'app/interfaces/Farm';
import { FarmTransactionType } from 'app/pages/Farms/enums/farmTransaction';

export interface Props extends IFarmTransaction {
  type: FarmTransactionType;
  TokenList: MemoExoticComponent<() => Element>;
}
