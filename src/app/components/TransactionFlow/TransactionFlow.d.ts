import { Web3TxData } from 'utils/web3';

export interface StepProps {
  number: number;
  title: string;
  status: string;
  action: Function | undefined;
  fn: (params) => void;
  params: {} | [];
  monitoring?: boolean;
  tx: Web3TxData;
}

export interface TransactionFlowProps {
  heading: string;
  generalText?: string;
  description?: string;
  leftText?: string;
  arrayOfSteps: StepProps[];
  onClose: () => void;
  isOpen: boolean;
  handleFinish: () => void;
  disabled?: boolean;
  nextStep: () => void;
  hasNext?: boolean;
  stepsLeft?: number;
  migrationsLeft?: number;
  account?: string;
  notifications?: boolean;
}
