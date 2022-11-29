import { StatusResponse, Step } from '@lifi/sdk';
import { Token } from 'app/interfaces/General';
import { PopulatedTransaction } from 'ethers';

export interface Props {
  isLoading: boolean;
  showConfrimModal: boolean;
  onClose: () => void;
  onConfirm: () => void;
  waitForReceivingChain: (
    txHash: string,
  ) => Promise<StatusResponse | undefined>;
  allowance: PopulatedTransaction | undefined;
  token?: Token;
  secondToken?: Token;
  isQuoteAllowed: boolean;
  quote: Step | undefined;
  tokenFromValue: string;
  resetValue: () => void;
  errorQuote: string;
  handleError: (error: any) => void;
}
