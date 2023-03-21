import { defaultAbiCoder } from '@ethersproject/abi';
import { getCreate2Address } from '@ethersproject/address';
import { keccak256 } from '@ethersproject/solidity';
import { V3_POOL_INIT_CODE_HASH } from 'constants/index';
import { Token } from '../../v3-sdk/entities';

/**
 * Computes a pool address
 * @param factoryAddress The Uniswap V3 factory address
 * @param tokenA The first token of the pair, irrespective of sort order
 * @param tokenB The second token of the pair, irrespective of sort order
 * @param fee The fee tier of the pool
 * @returns The pool address
 */
export function computePoolAddress({
  poolDeployer,
  tokenA,
  tokenB,
  initCodeHashManualOverride,
}: {
  poolDeployer: string;
  tokenA: Token;
  tokenB: Token;
  initCodeHashManualOverride?: string;
}): string {
  const [token0, token1] = tokenA.sortsBefore(tokenB)
    ? [tokenA, tokenB]
    : [tokenB, tokenA]; // does safety checks
  return getCreate2Address(
    poolDeployer,
    keccak256(
      ['bytes'],
      [
        defaultAbiCoder.encode(
          ['address', 'address'],
          [token0.address, token1.address],
        ),
      ],
    ),
    initCodeHashManualOverride ?? V3_POOL_INIT_CODE_HASH,
  );
}
