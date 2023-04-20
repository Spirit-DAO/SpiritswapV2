import { TransactionStatus } from 'app/components/TransactionFlow';

export interface StepStateProps {
  action: () => Promise<any>;
  label: string;
  status: TransactionStatus;
}
