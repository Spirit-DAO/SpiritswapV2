import { useEffect, useMemo, useState } from 'react';
import { Contract } from 'utils/web3';

export function usePoolsGlobalState(
  poolsAddresses: (string | undefined)[],
  methodName: string,
) {
  const [globalStates, setGlobalStates] = useState<
    {
      loading: boolean;
      result: any;
      valid: boolean;
      syncing: boolean;
      error: boolean;
    }[]
  >(
    poolsAddresses.map(_ => ({
      loading: true,
      result: undefined,
      valid: true,
      syncing: false,
      error: false,
    })),
  );

  const poolContracts = useMemo(() => {
    return poolsAddresses.map(pool =>
      pool ? Contract(pool, 'v3AlgebraPool') : undefined,
    );
  }, [poolsAddresses]);

  useEffect(() => {
    async function fetch() {
      let contracts;

      try {
        contracts = await Promise.all(poolContracts);
      } catch {
        setGlobalStates(
          poolContracts.map(_ => ({
            valid: false,
            result: undefined,
            loading: false,
            error: true,
            syncing: false,
          })),
        );

        return;
      }

      const requests = contracts.map(pool =>
        pool ? pool[methodName]() : undefined,
      );

      const globalStates = await Promise.allSettled(requests).then(results =>
        results.map(result =>
          result.status === 'fulfilled' ? result.value : undefined,
        ),
      );

      const results = globalStates.map(result => ({
        loading: false,
        valid: true,
        error: false,
        syncing: false,
        result,
      }));

      setGlobalStates(results);
    }

    fetch();
  }, [poolContracts]);

  return globalStates;
}
