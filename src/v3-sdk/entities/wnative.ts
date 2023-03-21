import { CHAIN_ID } from 'constants/index';
import { Token } from './Token';

/**
 * Known WETH9 implementation addresses, used in our implementation of Ether#wrapped
 */
export const WNATIVE: { [chainId: number]: Token } = {
  [CHAIN_ID]: new Token(
    CHAIN_ID,
    '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83',
    18,
    'WFTM',
    'Wrapped FTM',
  ),
};
