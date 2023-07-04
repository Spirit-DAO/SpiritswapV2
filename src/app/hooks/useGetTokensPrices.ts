import { BASE_TOKEN_ADDRESS, CHAIN_ID } from 'constants/index';
import { useEffect, useState } from 'react';
import { selectFtmInfo } from 'store/general/selectors';
import { useAppSelector } from 'store/hooks';
import { getTokensDetails } from 'utils/data/covalent';
import { tokenData } from 'utils/data/types';

interface Props {
  tokenAddresses: string[];
  chainId?: number;
  refresh?: number;
}

const useGetTokensPrices = ({
  tokenAddresses,
  refresh = 0,
  chainId = CHAIN_ID,
}: Props) => {
  const [tokensPrices, setTokensPrices] =
    useState<{ [symbol: string]: tokenData }>();
  const [loadingPrices, setLoadingPrices] = useState<boolean>(false);
  const ftmInfo = useAppSelector(selectFtmInfo);
  const { price: ftmPrice } = ftmInfo;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingPrices(true);
        const data = await getTokensDetails(tokenAddresses, chainId);
        if (!data) return setTokensPrices({});
        let tokenObjectPrices = {};
        data?.forEach(token => {
          if (token.address === BASE_TOKEN_ADDRESS) {
            tokenObjectPrices['FTM'] = {
              ...token,
              rate: ftmPrice,
            };
          } else {
            tokenObjectPrices[token.symbol] = token;
          }
        });
        setTokensPrices(tokenObjectPrices);
        setLoadingPrices(false);
      } catch (error) {
        setLoadingPrices(false);
      }
    };
    tokenAddresses && tokenAddresses.length && chainId && fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId, refresh, ...tokenAddresses]);

  return {
    tokensPrices,
    loadingPrices,
  };
};

export default useGetTokensPrices;
