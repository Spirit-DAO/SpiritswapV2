import { tokens } from 'constants/tokens';
import { formatAmount, getRoundedSFs } from 'app/utils';
import { tokenData } from 'utils/data';

export interface LiquidityDetailProps {
  detailTitle: string;
  detailValue: string;
  id?: number;
}

const getDetailData = (pairData: tokenData) => {
  let data: LiquidityDetailProps[] = [];

  if (!pairData) {
    return [];
  }

  const { pooled0, pooled1, token0, token1, poolShare } =
    pairData?.originalItem?.response;

  const pairs = [token0, token1];

  const MIN_POOLED_VALUE = 0.0001;

  pairs.forEach((address, i) => {
    const findToken = tokens.find(
      token => `${token.address}`.toLowerCase() === `${address}`.toLowerCase(),
    );
    let tokenDeposited = '0';
    if (findToken) {
      if (i === 0) {
        const formatedAmount = formatAmount(`${pooled0}`, 18);
        tokenDeposited =
          parseFloat(formatedAmount) < MIN_POOLED_VALUE
            ? `<${MIN_POOLED_VALUE}`
            : `${getRoundedSFs(formatedAmount, 5)}`;
      } else {
        const formatedAmount = formatAmount(`${pooled1}`, 18);
        tokenDeposited =
          parseFloat(formatedAmount) < MIN_POOLED_VALUE
            ? `<${MIN_POOLED_VALUE}`
            : `${getRoundedSFs(formatedAmount, 5)}`;
      }
      data.push({
        detailTitle: `Pooled ${findToken.symbol}:`,
        detailValue: tokenDeposited ? `${tokenDeposited}` : 'Unknown',
      });
    }
  });

  data = [
    ...data,
    {
      detailTitle: 'Your pool share:',
      detailValue: poolShare,
    },
  ];

  data = data.map((item, i) => {
    return { ...item, id: i };
  });

  return data;
};

export default getDetailData;
