import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import {
  removePendingTransaction,
  setNewPendingTransactions,
} from 'store/user';
import { selectPendingTransactions } from 'store/user/selectors';
import { useProgressToast } from 'app/hooks/Toasts/useProgressToast';
import { Web3TxData } from 'utils/web3';
import { useTranslation } from 'react-i18next';
import getNotificationIcon from '../getNotificationIcon';
import { NOTIFICATIONS_STATE } from 'constants/index';
import { TransactionResponseProps } from 'utils/web3/actions';
import { getRoundedSFs } from 'app/utils/methods';
import { useSuggestionsProps } from 'app/hooks/Suggestions/Suggestion';

interface Props extends TransactionResponseProps {
  title: string;
  update?: string;
  updateTarget?: string;
  bridgeIndex?: number | undefined;
}

const Web3Monitoring = () => {
  const dispatch = useAppDispatch();
  const { showToast } = useProgressToast();
  const { t } = useTranslation();

  const addToQueue = (
    response: Props,
    suggestionData?: useSuggestionsProps,
    type: string = 'none',
  ) => {
    const {
      title,
      operation,
      tx,
      uniqueMessage,
      inputSymbol,
      outputSymbol,
      inputValue,
      outputValue,
      link,
      update,
      updateTarget,
      bridgeIndex,
    } = response;

    const translationsPath = `notifications.${title}`;
    const isApprove = operation === 'APPROVE';

    const formattedInputValue = inputValue ? getRoundedSFs(inputValue) : '';
    const formattedOutputValue = outputValue ? getRoundedSFs(outputValue) : '';

    // We save our pending transaction into our store
    const monitoringParams: Web3TxData = {
      actionType: operation,
      hash: tx.hash,
      successTitle: t(`${translationsPath}.success`),
      errorTitle: t(`${translationsPath}.error`),
      inputSymbol: inputSymbol,
      outputSymbol: outputSymbol,
      uniqueMessage,
      inputValue: formattedInputValue,
      outputValue: formattedOutputValue,
      link: link,
      type: type,
      update,
      updateTarget,
      bridgeIndex,
      chainId: tx.chainId,
      origin: translationsPath,
      suggestionData: suggestionData ? suggestionData : undefined,
    };

    dispatch(setNewPendingTransactions(monitoringParams));

    // We immediately show a pending tx message
    showToast({
      title: t(`${translationsPath}.pending`),
      id: tx.hash,
      uniqueMessage,
      type: NOTIFICATIONS_STATE.PENDING,
      inputSymbol: inputSymbol,
      outputSymbol: outputSymbol,
      inputValue: formattedInputValue,
      outputValue: formattedOutputValue,
      duration: 5000,
      icon: !isApprove && operation && getNotificationIcon(operation),
      link,
    });

    const waitForReceipt = async (hash: string) => {
      try {
        await tx.wait();
      } catch (e) {
      } finally {
        dispatch(removePendingTransaction(hash));
      }
    };

    waitForReceipt(tx.hash);
  };

  return {
    addToQueue,
  };
};

export const MonitorTx = (_hash: string, _callback: Function) => {
  const queue = useAppSelector(selectPendingTransactions);
  const [inQueue, setInQueue] = useState<boolean>(false);

  useEffect(() => {
    if (_hash) {
      let match;

      if (queue && queue.length) {
        [match] = queue.filter(
          transaction => `${transaction.hash}` === `${_hash}`,
        );
      }

      if (!inQueue && match) {
        setInQueue(true);
      }

      if (inQueue && !match) {
        setInQueue(false);
        _callback();
      }
    }
  }, [_hash, _callback, queue, inQueue, setInQueue]);

  return {
    inQueue,
    queue,
  };
};

export default Web3Monitoring;
