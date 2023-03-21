import { useEffect, useMemo, useState } from 'react';
import { useAppSelector } from 'store/hooks';
import { selectConcentratedLiquidityWallet } from 'store/user/selectors';
import { getTokenUsdPrice } from 'utils/data';

export function useEternalFarmingRewards() {
  const liquidity = useAppSelector(selectConcentratedLiquidityWallet);
  const [totalUSDPrice, setTotalUSDPrice] = useState<number>();

  const positionsOnFarming = useMemo(
    () => liquidity.filter(stake => stake.eternalFarming),
    [liquidity],
  );

  useEffect(() => {
    async function fetchRate() {
      let totalAmount = 0;

      for (const position of positionsOnFarming) {
        try {
          const rewardPrice = await getTokenUsdPrice(
            position.eternalFarming.rewardToken.id,
          );
          const bonusRewardPrice = await getTokenUsdPrice(
            position.eternalFarming.bonusRewardToken.id,
          );

          totalAmount +=
            (rewardPrice || 0) * Number(position.eternalFarming.earned) +
            (bonusRewardPrice || 0) *
              Number(position.eternalFarming.bonusEarned);
        } catch {
          totalAmount += 0;
        }
      }

      setTotalUSDPrice(totalAmount);
    }

    fetchRate();
  }, [positionsOnFarming]);

  return {
    farmRewards: totalUSDPrice,
    positionsOnFarming,
  };
}
