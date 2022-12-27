import { WFTM } from 'constants/tokens';
import { BASE_TOKEN_ADDRESS } from 'constants/index';
import { useEffect, useState } from 'react';
import { getLpFromApollo } from 'utils/apollo/queries';

const useGetLpFromApollo = (
  inAddress: string,
  outAddress: string,
  makeCall: boolean,
) => {
  const [lpAddress, setLpAddress] = useState<string>('');

  const inputAddress =
    inAddress === BASE_TOKEN_ADDRESS ? WFTM.address : inAddress;
  const outputAddress =
    outAddress === BASE_TOKEN_ADDRESS ? WFTM.address : outAddress;

  useEffect(() => {
    const fetchData = async () => {
      if (!makeCall) return;
      try {
        const { data: firstCall } = await getLpFromApollo(
          inputAddress,
          outputAddress,
        );
        if (firstCall.pairs[0]) setLpAddress(firstCall.pairs[0].id);
        else {
          const { data: secondCall } = await getLpFromApollo(
            outputAddress,
            inputAddress,
          );
          if (secondCall.pairs[0]) setLpAddress(secondCall.pairs[0].id);
        }
      } catch (error) {}
    };
    inAddress && outAddress && fetchData();
  }, [inputAddress, outputAddress, inAddress, outAddress, makeCall]);

  return { lpAddress };
};

export default useGetLpFromApollo;
