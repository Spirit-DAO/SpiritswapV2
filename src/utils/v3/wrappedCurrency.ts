import { CHAIN_ID } from 'constants/index';
import { Currency, Ether, WNATIVE } from '../../v3-sdk';

export function unwrappedToken(currency: Currency): Currency {
  if (currency.isNative) return currency;

  if (currency.equals(WNATIVE[CHAIN_ID])) return Ether.onChain(CHAIN_ID);

  return currency;
}
