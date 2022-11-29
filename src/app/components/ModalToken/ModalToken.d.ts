import { Token } from 'app/interfaces/General';

export interface Props {
  tokens?: Token[];
  commonTokens: Token[];
  tokenSelected: Token;
  bridge?: 'from' | 'to' | undefined;
  onSelect?: (item: Token, onClose: () => void) => any;
  isOpen: boolean;
  onClose: () => void;
  chainID?: number;
  notSearchToken?: boolean;
}
