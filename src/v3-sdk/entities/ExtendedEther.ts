import { CHAIN_ID } from 'constants/index';
import { Matic } from './matic';
import { Token } from './Token';
import { WNATIVE } from './wnative';

export class ExtendedEther extends Matic {
  private static _cachedEther: { [chainId: number]: ExtendedEther } = {};

  public get wrapped(): Token {
    return WNATIVE[CHAIN_ID];
  }

  public static onChain(chainId: number): ExtendedEther {
    return (
      this._cachedEther[chainId] ??
      (this._cachedEther[chainId] = new ExtendedEther(chainId))
    );
  }
}
