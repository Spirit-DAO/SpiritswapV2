import { Token } from 'app/interfaces/General';
import { FlexProps } from '@chakra-ui/react';
export interface Props extends FlexProps {
  token?: TokenWithAmount;
  tokens?: Token[];
  bridge?: 'from' | 'to' | undefined;
  onSelect?: (item: Token, onClose: () => void) => void;
  inputValue: string;
  onChange?: ({ tokenSymbol: string, value: string }) => void;
  showPercentage?: boolean;
  handleOpen?: () => void;
  showInputInUSD?: boolean;
  setShowInputInUSD?: (value: boolean) => void;
  isLimit?: boolean;
  isSelectable?: boolean;
  percentageOnFocus?: boolean;
  poolPercentage?: string;
  showConfirm?: boolean;
  inputWidth?: string;
  context: 'liquidity' | 'farm' | 'token' | 'sob' | 'weighted' | 'bridge';
  showTokenSelection?: boolean;
  maxValue?: number;
  isLoading?: boolean;
  isOutput?: boolean;
  tradeUSD?: string;
  priceDiff?: number | null;
  notSearchToken?: boolean;
  handleCheckBalance?: ({
    hasBalance: boolean,
    symbol: string,
    isOutput: boolean,
  }) => void;
  errorMessage?: string | ObjectType;
  showNumberInputField?: boolean;
  showBalance?: boolean;
  chainID?: number;
  setErrorMessage?: any;
  setBalance?: (balance: string | null) => void;
  canApproveFunds?: any;
  notShowCommonBase?: boolean;
  tradeUsdValue?: string;
}

export interface TokenWithAmount extends Token {
  amount?: string;
  balance?: string;
}
