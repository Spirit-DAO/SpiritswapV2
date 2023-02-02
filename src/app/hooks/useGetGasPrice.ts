import BigNumber from 'bignumber.js';
import { formatUnits } from 'ethers/lib/utils';
import { useEffect, useState } from 'react';
import { SPEED_PRICES } from 'utils/swap';

const useGetGasPrice = ({ speed }: { speed: string }) => {
  const [gasData, setGasData] = useState({
    gasPrice: '0',
    txGweiCost: '0',
  });

  useEffect(() => {
    const init = async () => {
      try {
        let standardSpeed: string = '0';
        let fastSppeed: string = '0';
        let instantSpeed: string = '0';

        const response = await fetch(`https://api.paraswap.io/prices/gas/250 `);

        const data = await response.json();

        if (data) {
          standardSpeed = new BigNumber(data?.average)
            .multipliedBy(10)
            .toString();
          fastSppeed = new BigNumber(data?.fast).multipliedBy(3).toString();
          instantSpeed = new BigNumber(data?.fastest)
            .multipliedBy(10)
            .toString();
        }

        switch (speed) {
          case SPEED_PRICES.FAST:
            return setGasData({
              gasPrice: fastSppeed,
              txGweiCost: parseFloat(
                formatUnits(`${fastSppeed}`, 'gwei'),
              ).toFixed(2),
            });

          case SPEED_PRICES.INSTANT:
            return setGasData({
              gasPrice: instantSpeed,
              txGweiCost: parseFloat(
                formatUnits(`${instantSpeed}`, 'gwei').toString(),
              ).toFixed(2),
            });
          default:
            return setGasData({
              gasPrice: standardSpeed,
              txGweiCost: parseFloat(
                formatUnits(`${standardSpeed}`, 'gwei').toString(),
              ).toFixed(2),
            });
        }
      } catch (error) {
        return setGasData({
          gasPrice: '0',
          txGweiCost: '0',
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
