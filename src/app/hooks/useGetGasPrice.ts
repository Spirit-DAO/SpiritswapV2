import BigNumber from 'bignumber.js';
import { useEffect, useState } from 'react';
import { SPEED_PRICES } from 'utils/swap';

const useGetGasPrice = ({ speed }: { speed: string }) => {
  const [gasData, setGasData] = useState({
    gasPrice: '0',
    txGweiCost: '0',
    type: '',
  });

  useEffect(() => {
    const init = async () => {
      try {
        let standardSpeed: string = '0';
        let fastSppeed: string = '0';
        let instantSpeed: string = '0';

        // const response = await fetch(`https://api.paraswap.io/prices/gas/250 `);
        const response = await fetch(`https://oapi.fantom.network/gasprice `);

        // const data2 = await response2.json();
        const data = await response.json();

        if (data) {
          standardSpeed = data.SafeGasPrice;
          fastSppeed = data.ProposedGasPrice;
          instantSpeed = data.FastGasPrice;
        }

        switch (speed) {
          case SPEED_PRICES.FAST:
            return setGasData({
              gasPrice: new BigNumber(fastSppeed)
                .multipliedBy(1000000000)
                .toString(),
              txGweiCost: parseFloat(fastSppeed).toFixed(2),
              type: 'fast',
            });

          case SPEED_PRICES.INSTANT:
            return setGasData({
              gasPrice: new BigNumber(instantSpeed)
                .multipliedBy(1000000000)
                .toString(),
              txGweiCost: parseFloat(instantSpeed).toFixed(2),
              type: 'instant',
            });
          default:
            return setGasData({
              gasPrice: new BigNumber(standardSpeed)
                .multipliedBy(1000000000)
                .toString(),
              txGweiCost: parseFloat(standardSpeed).toFixed(2),
              type: 'standard',
            });
        }
      } catch (error) {
        return setGasData({
          gasPrice: '0',
          txGweiCost: '0',
          type: '',
        });
      }
    };

    init();

    const reFetcher = setInterval(() => {
      init();
      // Every 3 second
    }, 3000);

    return () => clearInterval(reFetcher);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speed]);

  return gasData;
};

export default useGetGasPrice;
