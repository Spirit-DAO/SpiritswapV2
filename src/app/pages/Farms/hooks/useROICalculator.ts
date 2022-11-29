import { useState, useEffect } from 'react';
import useGetTokensPrices from 'app/hooks/useGetTokensPrices';
import { GetTokenBySymbol } from 'app/utils';
import { CHAIN_ID } from 'constants/index';

export const useROICalculator = ({ apr, rewardTokenSymbol, isOpen }) => {
  const [amount, setAmount] = useState<number | undefined>();
  const [timeFrame, setTimeFrame] = useState(365);
  const [roi, setRoi] = useState(0);
  const [roiUSDValue, setRoiUSDValue] = useState(0);
  const [roiPercent, setRoiPercent] = useState(0);

  const { address: tokenAddress } = GetTokenBySymbol(rewardTokenSymbol) || {
    address: '',
  };

  const { tokensPrices } = useGetTokensPrices({
    tokenAddresses: tokenAddress ? [tokenAddress] : [],
    chainId: CHAIN_ID,
  });

  const onAmountChange = ({ target: { value } }) => {
    setAmount(+value);
  };

  const onTimeFrameChange = ({ target: { value } }) => {
    setTimeFrame(+value);
  };

  useEffect(() => {
    if (!amount || !timeFrame || !tokensPrices) {
      setRoi(0);
      setRoiUSDValue(0);
      setRoiPercent(0);
      return;
    }
    const { rate: tokenPrice } = tokensPrices[rewardTokenSymbol];

    const aprPerTimeFrame = (timeFrame * apr) / 365;
    const roi = +((amount * aprPerTimeFrame) / 100).toFixed(4);
    setRoi(roi);
    setRoiPercent(+aprPerTimeFrame.toFixed(2));

    if (tokenPrice && roi) {
      const roiUSDValue = +(roi * tokenPrice).toFixed(2);
      setRoiUSDValue(roiUSDValue);
    }
    if (!isOpen) {
      setRoi(0);
      setRoiUSDValue(0);
      setRoiPercent(0);
      setTimeFrame(1);
      setAmount(undefined);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount, timeFrame, tokensPrices]);

  return {
    onAmountChange,
    onTimeFrameChange,
    roi,
    roiPercent,
    roiUSDValue,
  };
};
