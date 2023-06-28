import React, { SetStateAction, useCallback, useEffect, useState } from 'react';
import { HarvestPanelProps } from './index';
import { TransactionFlowV2 } from 'app/components/TransactionFlowV2';
import { TransactionStatus } from 'app/components/TransactionFlow';
import { claimRewards } from 'app/components/TransactionFlow/utils/helper';
import { StepStateProps } from 'app/pages/Inspirit/components/Aside/components/GetInSpirit/GetInSpirit.d';
import Web3Monitoring from 'app/connectors/EthersConnector/transactions';
import { useAppSelector } from 'store/hooks';
import { selectFarmMasterData } from 'store/farms/selectors';
import { checkAddress } from 'app/utils';

const HarvestManagerMemo = ({
  farmsWithRewards,
  isOpen,
  onClose,
}: HarvestPanelProps) => {
  const [steps, setSteps] = useState<StepStateProps[]>([]);
  const { addToQueue } = Web3Monitoring();
  const farms = useAppSelector(selectFarmMasterData);

  const setupSteps = useCallback((): SetStateAction<any> => {
    const farmSteps: StepStateProps[] = farmsWithRewards.map(farm => {
      const action = () => claimRewards({ farm, addToQueue });

      const farmFound = farms.find(f =>
        checkAddress(farm.gaugeAddress, f.gaugeAddress),
      );

      let title = '';
      if (farmFound) {
        title = farmFound.title;
      }

      if (farm.isConcentrated) {
        title = `${farm.eternalFarming.pool.token0.symbol} + ${farm.eternalFarming.pool.token1.symbol}`;
      }

      return {
        label: `Claim ${title} rewards`,
        status: TransactionStatus.UPCOMING,
        action,
      };
    });

    setSteps(farmSteps);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [farmsWithRewards]);

  useEffect(() => {
    if (isOpen && farmsWithRewards.length) {
      setupSteps();
    } else {
      setSteps([]);
    }
  }, [farmsWithRewards, isOpen, setupSteps]);

  return (
    <TransactionFlowV2
      title="Claim rewards"
      steps={steps}
      onClose={onClose}
      isOpen={isOpen}
      description="Confirm all transactions to finish the claiming process."
    />
  );
};

export const HarvestManager = React.memo(HarvestManagerMemo);
