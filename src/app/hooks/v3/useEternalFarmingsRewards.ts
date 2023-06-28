import { useEffect, useMemo, useState } from 'react';
import { useAppSelector } from 'store/hooks';
import { selectConcentratedLiquidityWallet } from 'store/user/selectors';
import { getTokenUsdPrice } from 'utils/data';

export function useEternalFarmingRewards() {
  const liquidity = useAppSelector(selectConcentratedLiquidityWallet);
  const [totalUSDPrice, setTotalUSDPrice] = useState<number>();
  const [positionsRewardsUSDPrice, setPositionsRewardsUSDPrice] = useState<
    { positionId: string; amount: number }[]
  >([]);

  const positionsOnFarming = useMemo(() => {
    if (!liquidity) return [];
    return liquidity.filter(stake => stake.eternalFarming);
  }, [liquidity]);

  useEffect(() => {
    async function fetchRate() {
      let totalAmount = 0;
      const positionsRewards: { positionId: string; amount: number }[] = [];

      for (const position of positionsOnFarming) {
        try {
          const rewardPrice = await getTokenUsdPrice(
            position.eternalFarming.rewardToken.id,
          );
          const bonusRewardPrice = await getTokenUsdPrice(
            position.eternalFarming.bonusRewardToken.id,
          );

          const positionReward =
            (rewardPrice || 0) * Number(position.eternalFarming.earned);
          const positionBonusRewards =
            (bonusRewardPrice || 0) *
            Number(position.eternalFarming.bonusEarned);

          totalAmount += positionReward + positionBonusRewards;

          positionsRewards.push({
            positionId: position.tokenId,
            amount: positionReward + positionBonusRewards,
          });
        } catch {
          totalAmount += 0;
          positionsRewards.push({ positionId: position.tokenId, amount: 0 });
        }
      }

      setTotalUSDPrice(totalAmount);
      setPositionsRewardsUSDPrice(positionsRewards);
    }

    fetchRate();
  }, [positionsOnFarming]);

  return {
    farmRewards: totalUSDPrice,
    farmRewardsByPositions: positionsRewardsUSDPrice,
    positionsOnFarming,
  };
}
