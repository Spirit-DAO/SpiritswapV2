import { usePositionData } from 'app/hooks/v3/usePositionData';
import { RetrieveTokens } from '../RetrieveTokens/RetrieveTokens';

export const RetrieveConcentratedPosition = ({ position, ...props }: any) => {
  const { usdAmount, amount0String, amount1String } = usePositionData(position);

  const value =
    amount0String && amount1String ? `${amount0String} + ${amount1String}` : '';

  return (
    <RetrieveTokens
      moneyValue={usdAmount}
      value={value}
      isConcentrated={true}
      {...props}
    ></RetrieveTokens>
  );
};
