import { TransactionStatus } from 'app/components/TransactionFlow';

export interface StepStateProps {
  action: () => Promise<void>;
  label: string;
  status: TransactionStatus;
}
