import { Token } from 'app/interfaces/General';
import { BASE_TOKEN_ADDRESS, WFTM } from 'constants/index';
import { useEffect, useState } from 'react';
import { getTokensDetails } from 'utils/data';

interface Props {
  inputValue: number;
  outputValue: number;
  tokenInput: Token | undefined;
  tokenOutput: Token | undefined;
  updateOn: any;
}

const useGetPriceDiff = ({
  updateOn,
  inputValue,
  outputValue,
  tokenInput,
  tokenOutput,
}: Props) => {
  const [priceDiff, setDiff] = useState<number | undefined>(undefined);
  const [firstTokenUSD, setFirstTokenUSD] = useState(0);
  const [secondTokenUSD, setSecondTokenUSD] = useState(0);

  const [tokens, setTokens] = useState<{
    tokenA: Token | undefined;
    tokenB: Token | undefined;
  }>({
    tokenA: undefined,
    tokenB: undefined,
  });

  useEffect(() => {
    if (!tokenInput || !tokenOutput) return;

    const inputAddress =
      tokenInput.address === BASE_TOKEN_ADDRESS
        ? WFTM.address
        : tokenInput.address;
    const outputAddress =
      tokenOutput.address === BASE_TOKEN_ADDRESS
        ? WFTM.address
        : tokenOutput.address;

    const noPrevTokens = !tokens.tokenA && !tokens.tokenB;
    const differentsPrevTokens =
      (tokens.tokenA &&
        tokens.tokenB &&
        tokens?.tokenA?.address !== tokenInput.address) ||
      tokens?.tokenB?.address !== tokenOutput.address;

    if (noPrevTokens || differentsPrevTokens) {
      const init = async () => {
        try {
          const [firstTokenUSDRate] = await getTokensDetails(
            [inputAddress],
            tokenInput.chainId,
          );
          const [secondTokenUSDRate] = await getTokensDetails(
            [outputAddress],
            tokenOutput.chainId,
          );

          setFirstTokenUSD(firstTokenUSDRate.rate);
          setSecondTokenUSD(secondTokenUSDRate.rate);
          setTokens({ tokenA: tokenInput, tokenB: tokenOutput });
        } catch (error) {}
      };

      init();
    }

    if (!inputValue) setDiff(undefined);
    if (firstTokenUSD && secondTokenUSD) {
      const inputUSDValue = inputValue * firstTokenUSD;
      const outputUSDValue = outputValue * secondTokenUSD;
      const diff = ((outputUSDValue - inputUSDValue) / inputUSDValue) * 100;

      if (diff === Infinity || isNaN(diff) || diff > 60 || diff < -60)
        return setDiff(undefined);

      return setDiff(diff);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateOn, tokenInput, tokenOutput]);

  return priceDiff;
};

export default useGetPriceDiff;
