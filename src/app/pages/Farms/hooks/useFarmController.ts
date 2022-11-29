import { useState, useCallback } from 'react';
import { FarmTransactionStatus } from '../enums/farmTransaction';

export const useFarmActions = () => {
  const [status, setStatus] = useState(FarmTransactionStatus.DEFAULT);

  const onDepositHandler = useCallback(() => {
    setStatus(FarmTransactionStatus.DEPOSITING);
  }, []);

  const onWithdrawHandler = useCallback(() => {
    setStatus(FarmTransactionStatus.WITHDRAWING);
  }, []);

  const onCancelTransaction = useCallback(() => {
    setStatus(FarmTransactionStatus.DEFAULT);
  }, []);

  return {
    status,
    onDepositHandler,
    onWithdrawHandler,
    onCancelTransaction,
  };
};
