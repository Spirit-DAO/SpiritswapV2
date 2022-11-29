import BigNumber from 'bignumber.js';

export const calculateBoost = (
  totalinSpiritSupply: string,
  userinSpiritBalance: number | string,
  lpTokens,
  totalSupply,
) => {
  const totalinSpirit = new BigNumber(totalinSpiritSupply);
  const userinSpirit = new BigNumber(userinSpiritBalance);
  const lpTokensValue = new BigNumber(lpTokens || 0);
  const totalSupplyValue = new BigNumber(totalSupply || 0);

  const derivedBalance = lpTokensValue.times(0.4);
  const adjustedBalance = totalSupplyValue
    .times(userinSpirit)
    .div(totalinSpirit)
    .times(0.6);

  const currentBoost = BigNumber.minimum(
    derivedBalance.plus(adjustedBalance),
    lpTokensValue,
  )
    .div(lpTokensValue)
    .div(0.4);
  const spiritNeededForMax = lpTokensValue
    .times(totalinSpirit)
    .div(totalSupplyValue)
    .toFixed(2);

  return {
    currentBoost: currentBoost.toFixed(1),
    spiritNeededForMax,
  };
};
