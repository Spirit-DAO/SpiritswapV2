import { useState, useEffect } from 'react';
import { Token } from 'app/interfaces/General';
import { getBribeLeftOver } from 'utils/data/inspirit';
import { getBribeContract, wallet } from 'utils/web3';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { getProvider } from 'app/connectors/EthersConnector/login';

interface Props {
  selectedFarmLpAddress: string;
  selectedBribe: string;
  selectedToken: Token | undefined;
}

export const useTokenAmountPanel = ({
  selectedFarmLpAddress,
  selectedBribe,
  selectedToken,
}: Props) => {
  const [ongoingBribeAmount, setOngoingBribeAmount] = useState<string>('0');
  const [minBribeAmount, setMinBribeAmount] = useState<string>('0');

  useEffect(() => {
    if (!selectedToken) return;
    const calculateBribeLeftOver = async () => {
      const connector = await getProvider();
      const { signer } = await wallet(connector);
      const bribeContract = await getBribeContract(selectedBribe, signer);

      const leftOver = await getBribeLeftOver({
        bribeContract,
        rewardToken: selectedToken.address,
      });

      const BRIBE_MAX = '604800';
      const BG_Bribe = new BigNumber(BRIBE_MAX);

      if (leftOver === '0') {
        const formattedMin = ethers.utils.formatUnits(
          BRIBE_MAX,
          selectedToken.decimals,
        );
        setMinBribeAmount(formattedMin);
      } else {
        const minBribeAmount = BG_Bribe.minus(leftOver);
        if (minBribeAmount.isNegative()) {
          const formattedMin = ethers.utils.formatUnits(
            `${leftOver}`,
            selectedToken.decimals,
          );
          setMinBribeAmount(formattedMin);
        } else {
          const formattedMin = ethers.utils.formatUnits(
            BRIBE_MAX,
            selectedToken.decimals,
          );
          setMinBribeAmount(formattedMin);
        }
      }

      setOngoingBribeAmount(leftOver);
    };
    calculateBribeLeftOver();
  }, [selectedFarmLpAddress, selectedBribe, selectedToken]);

  return {
    ongoingBribeAmount,
    minBribeAmount,
  };
};
