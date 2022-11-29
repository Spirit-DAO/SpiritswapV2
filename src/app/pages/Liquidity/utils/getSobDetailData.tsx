import { tokenData } from 'utils/data/types';
import { LiquidityDetailProps } from './getDetailData';

const getSobDetailData = (pair: tokenData) => {
  let data: LiquidityDetailProps[] = [];

  const { lpSupply, amount, tokensAmounts } = pair;

  const poolTokenPercentage = lpSupply
    ? `${((parseFloat(amount) / lpSupply) * 100).toFixed(5)} %`
    : 'Unknown'; // get the share pool percentaje

  tokensAmounts?.forEach(tokenWAmount => {
    data.push({
      detailTitle: `Pooled ${tokenWAmount.token.symbol}:`,
      detailValue: tokenWAmount.amount ? `${tokenWAmount.amount}` : 'Unknown',
    });
  });

  data = [
    ...data,
    {
      detailTitle: 'Your pool share:',
      detailValue: `${poolTokenPercentage}`,
    },
  ];

  data = data.map((item, i) => {
    return { ...item, id: i };
  });

  return data;
};

export default getSobDetailData;
