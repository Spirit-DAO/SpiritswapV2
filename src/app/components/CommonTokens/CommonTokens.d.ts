import { Token } from 'app/interfaces/General';

export interface CommonTokensProps {
  onClose: () => void;
  tokenSelected: Token;
  onSelectToken?: (item: Token, onClose: () => void) => any;
  tokensToShow: Token[];
  showCommonTokens?: boolean;
}
