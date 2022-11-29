import { Farm } from 'app/pages/Farms/Farm';
import { FarmTransaction } from 'app/pages/Farms/components/FarmTransaction';
import { IFarm, IFarmTransaction } from 'app/interfaces/Farm';
import { useFarmActions } from '../hooks/useFarmController';
import {
  FarmTransactionStatus,
  FarmTransactionType,
} from '../enums/farmTransaction';
import {
  approveFarm,
  gaugeHarvest,
  harvest,
  harvest2,
  stakeGaugePoolToken,
  stakePoolToken,
  unstakeGaugePoolToken,
  unstakeGaugePoolTokenAll,
  unstakePoolToken,
} from 'utils/web3/actions/farm';
import { transactionResponse } from 'utils/web3';
import Web3Monitoring from 'app/connectors/EthersConnector/transactions';
import { useDisclosure } from '@chakra-ui/react';
import { memo, useEffect, useState } from 'react';
import { TokenList } from '../components/TokenList';

const MemorizeTokenList = memo(({ farm }: IFarm) => (
  <TokenList
    tokens={farm.tokens}
    title={farm.title}
    boosted={farm.boosted}
    ecosystem={farm.ecosystem}
    apr={farm.apr}
    rewardToken={farm.rewardToken}
    farmType={farm.type}
    lpAddress={farm.lpAddress}
    type={farm.type}
  />
));

export const FarmController = ({
  farm,
  onOpen,
}: {
  farm: IFarm;
  onOpen: () => void;
}) => {
  const { status, onDepositHandler, onWithdrawHandler, onCancelTransaction } =
    useFarmActions();
  const [currentStatus, setCurrentStatus] = useState<any>();
  const { addToQueue } = Web3Monitoring();
  const { isOpen, onOpen: openFarm, onClose: closeFarm } = useDisclosure();

  const farmTrasactionData: IFarmTransaction = {
    farm: farm,
    amountStaked: `${farm.lpTokens}`,
    value: '0',
    moneyValue: '0', //TODO: Add a pricing quote for farm that can be passed to determine price per unit
    onApproveTransaction: async () => {
      if (farm) {
        const tx = await approveFarm(farm.lpAddress, farm.gaugeAddress, 250);
        const response = transactionResponse('farm.approve', {
          operation: 'APPROVE',
          tx: tx,
          uniqueMessage: {
            text: 'Approving',
            secondText: farm.title,
          },
        });
        addToQueue(response);
        return tx;
      }
      return null;
    },
    onConfirmDeposit: async (_value: string) => {
      if (!_value) {
        // TODO: Possibly add a message for user input error
        return null;
      }

      let tx;

      if (farm.gaugeAddress) {
        tx = await stakeGaugePoolToken(farm?.gaugeAddress, _value);
      } else {
        tx = await stakePoolToken(farm.pid, _value);
      }

      return tx;
    },
    onConfirmWithdraw: async (_value: string, isMax?: boolean) => {
      if (!_value) {
        // TODO: Possibly add a message for user input error
        return null;
      }
      let tx;

      if (farm.gaugeAddress) {
        if (isMax) {
          tx = await unstakeGaugePoolTokenAll(farm.gaugeAddress);
        } else {
          tx = await unstakeGaugePoolToken(farm.gaugeAddress, _value);
        }
      } else {
        tx = await unstakePoolToken(farm.pid, _value);
      }

      return tx;
    },
    onClaimTransaction: async () => {
      let tx;
      if (farm.gaugeAddress) {
        tx = await gaugeHarvest(farm?.gaugeAddress);
      } else if (farm.rewards) {
        const { rewards } = farm;

        if (rewards && rewards.pid) {
          tx = await harvest2(rewards.pid, farm.lpAddress);
        }
      } else {
        tx = await harvest(farm.pid);
      }

      return tx;
    },
  };

  useEffect(() => {
    if (
      currentStatus >= 0 &&
      status !== currentStatus &&
      (status === FarmTransactionStatus.DEFAULT ||
        currentStatus === FarmTransactionStatus.DEFAULT)
    ) {
      openFarm();
      new Promise(() =>
        setTimeout(() => {
          closeFarm();
          setCurrentStatus(status);
        }, 250),
      );
    } else {
      setCurrentStatus(status);
    }
  }, [status]);

  return (
    <>
      {(currentStatus === FarmTransactionStatus.DEFAULT || isOpen) && (
        <Farm
          farm={farm}
          onWithdraw={onWithdrawHandler}
          onDeposit={onDepositHandler}
          onClaim={farmTrasactionData.onClaimTransaction}
          isTransitioning={isOpen}
          isOpen={currentStatus !== FarmTransactionStatus.DEFAULT}
          TokenList={MemorizeTokenList}
        />
      )}

      {currentStatus === FarmTransactionStatus.DEPOSITING && !isOpen && (
        <FarmTransaction
          {...farmTrasactionData}
          type={FarmTransactionType.DEPOSIT}
          onCancelTransaction={onCancelTransaction}
          onOpen={onOpen}
          TokenList={MemorizeTokenList}
        />
      )}

      {currentStatus === FarmTransactionStatus.WITHDRAWING && !isOpen && (
        <FarmTransaction
          {...farmTrasactionData}
          type={FarmTransactionType.WITHDRAW}
          onCancelTransaction={onCancelTransaction}
          TokenList={MemorizeTokenList}
        />
      )}
    </>
  );
};
