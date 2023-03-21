import invariant from 'tiny-invariant';
import { Currency, Token } from '.';
import { WNATIVE } from './wnative';

import NativeCurrency from './NativeCurrency';
/**
 * Ether is the main usage of a 'native' currency, i.e. for Ethereum mainnet and all testnets
 */
export class Matic extends NativeCurrency {
  private static _etherCache: { [chainId: number]: Matic } = {};

  protected constructor(chainId: number) {
    super(chainId, 18, 'FTM', 'Fantom');
  }

  public get wrapped(): Token {
    const weth9 = WNATIVE[this.chainId];
    invariant(!!weth9, 'WRAPPED');
    return weth9;
  }

  public static onChain(chainId: number): Matic {
    return (
      this._etherCache[chainId] ??
      (this._etherCache[chainId] = new Matic(chainId))
    );
  }

  public equals(other: Currency): boolean {
    return other.isNative && other.chainId === this.chainId;
  }
}
