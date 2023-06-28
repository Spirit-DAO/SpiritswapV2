import { CHAIN_ID, tokens } from 'constants/index';
import { useEffect, useMemo, useState } from 'react';
import { ADDRESS_ZERO, Currency, Token, WETH9, WNATIVE } from '../../../v3-sdk';
import { ExtendedEther } from '../../../v3-sdk/entities/ExtendedEther';
import { arrayify, getAddress, parseBytes32String } from 'ethers/lib/utils';
import { Contract } from 'utils/web3';

export function useCurrency(
  currencyId: string | undefined,
): Currency | null | undefined {
  let isETH = currencyId?.toUpperCase() === 'FTM';

  const token = useTokenV3(isETH ? undefined : currencyId);
  const extendedEther = ExtendedEther.onChain(CHAIN_ID);
  const weth = WETH9[CHAIN_ID];
  if (weth?.address?.toLowerCase() === currencyId?.toLowerCase()) return weth;
  return isETH ? extendedEther : token;
}

export function useTokenV3(
  tokenAddress?: string,
): Token | ExtendedEther | undefined | null {
  const [_token, setToken] = useState<Token | ExtendedEther | undefined | null>(
    undefined,
  );

  const address = getAddress(tokenAddress || '');

  useEffect(() => {
    async function fetchToken() {
      try {
        if (address === ADDRESS_ZERO) {
          setToken(ExtendedEther.onChain(CHAIN_ID));

          return;
        }

        const cachedToken = tokens.find(
          token => token.address.toLowerCase() === address.toLowerCase(),
        );

        if (cachedToken) {
          setToken(
            new Token(
              CHAIN_ID,
              address,
              cachedToken.decimals,
              cachedToken.symbol,
              cachedToken.name,
            ),
          );
          return;
        }

        const tokenContract = await Contract(address, 'erc20');
        const tokenContractBytes32 = await Contract(address, 'erc20');

        const tokenName = await tokenContract.callStatic.name();

        const tokenNameBytes32 = await tokenContractBytes32.callStatic.name();
        const symbol = await tokenContract.callStatic.symbol();
        const symbolBytes32 = await tokenContractBytes32.callStatic.symbol();
        const decimals = await tokenContract.callStatic.decimals();

        const token = new Token(
          CHAIN_ID,
          address,
          decimals,
          parseStringOrBytes32(symbol, symbolBytes32, 'UNKNOWN'),
          parseStringOrBytes32(tokenName, tokenNameBytes32, 'Unknown Token'),
        );

        setToken(token);
      } catch (err) {
        setToken(null);
      }
    }

    fetchToken();
  }, [tokenAddress]);

  return useMemo(() => {
    if (_token) return _token;

    return _token;
  }, [_token]);
}

const BYTES32_REGEX = /^0x[a-fA-F0-9]{64}$/;

function parseStringOrBytes32(
  str: string | undefined,
  bytes32: string | undefined,
  defaultValue: string,
): string {
  return str && str.length > 0
    ? str
    : // need to check for proper bytes string and valid terminator
    bytes32 && BYTES32_REGEX.test(bytes32) && arrayify(bytes32)[31] === 0
    ? parseBytes32String(bytes32)
    : defaultValue;
}
