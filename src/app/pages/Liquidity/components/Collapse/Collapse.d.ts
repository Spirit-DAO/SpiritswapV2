import { tokenData, Token } from 'utils/data';

export interface Props {
  pair: tokenData;
  userAddress: string;
  hideRemoveLiquidity: () => void;
  handleChangeToken: (
    item: Token,
    type: number,
    onClose?: () => void,
    tokenType?: string,
  ) => void;
  setLPToken: ({ LPPair }: tokenData) => void;
}
