import { ButtonGroup as ButtonContainer, Button } from '@chakra-ui/react';
import UseIsLoading from 'app/hooks/UseIsLoading';
import { isValidBalance } from 'app/utils';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { sendTransactionV2 } from 'utils/web3';
import { Props } from './ButtonGroup.d';
import Web3Monitoring from 'app/connectors/EthersConnector/transactions';
import { NETWORK, NOTIFICATIONS_STATE } from 'constants/index';
import { getChainById } from '@lifi/sdk';
import { PopulatedTransaction } from 'ethers';
import { useProgressToast } from 'app/hooks/Toasts/useProgressToast';
import getNotificationIcon from 'app/connectors/getNotificationIcon';
import { useTokenBalance } from 'app/hooks/useTokenBalance';
import useWallets from 'app/hooks/useWallets';

const ButtonGroup = ({
  isLoading,
  showConfrimModal,
  onClose,
  onConfirm,
  allowance,
  token,
  secondToken,
  isQuoteAllowed,
  quote,
  waitForReceivingChain,
  tokenFromValue,
  resetValue,
  errorQuote,
  handleError,
}: Props) => {
  const { t } = useTranslation();
  const translationPath = 'farms.common';
  const { isLoggedIn, login } = useWallets();
  const { addToQueue } = Web3Monitoring();
  const { showToast, closeToast } = useProgressToast();
  const [isApproved, setIsApproved] = useState(false);

  const { isLoading: isLoadingApprove, loadingOff, loadingOn } = UseIsLoading();
  const {
    isLoading: isLoadingBridge,
    loadingOff: loadOffBridge,
    loadingOn: loadOnBridge,
  } = UseIsLoading();
  const connectWallet = useCallback(() => {
    login();
  }, [login]);

  useEffect(() => {
    if (allowance) setIsApproved(false);
    return () => setIsApproved(true);
  }, [token, allowance]);

  const approveCallback = useCallback(async () => {
    try {
      loadingOn();
      if (allowance) {
        const txHash = await sendTransactionV2(allowance);
        if (txHash && token) {
          showToast({
            title: t(`notifications.bridge.approve.pending`),
            id: `${txHash.hash}-pending`,
            inputSymbol: token.symbol,
            type: NOTIFICATIONS_STATE.PENDING,
            duration: 10000,
            uniqueMessage: {
              text: isApproved ? 'Approved' : 'Approving',
            },
          });

          await txHash.wait();
          closeToast(`${txHash.hash}-pending`);
          const explorerLink = NETWORK[token.chainId]?.blockExp;

          showToast({
            title: t(`notifications.bridge.approve.success`),
            id: txHash.hash,
            inputSymbol: token?.symbol,
            type: NOTIFICATIONS_STATE.SUCCESS,
            duration: 10000,
            link: `${explorerLink}tx/${txHash?.hash}`,

            uniqueMessage: {
              text: isApproved ? 'Approved' : 'Approving',
            },
          });
        }
        loadingOff();
        setIsApproved(true);
      }
    } catch (error) {
      loadingOff();
      setIsApproved(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allowance, loadingOff, loadingOn, addToQueue, token]);

  const processBridge = async e => {
    e.preventDefault();
    try {
      if (quote?.transactionRequest) {
        handleError('');
        loadOnBridge();
        const tx = await sendTransactionV2(
          quote.transactionRequest as PopulatedTransaction,
        );
        if (tx && token) {
          const explorerLink = NETWORK[token.chainId]?.blockExp;

          if (quote.action.fromChainId !== quote.action.toChainId) {
            showToast({
              title: t(`notifications.bridge.process.pending`),
              id: `${tx.hash}-pending`,
              uniqueMessage: {
                text: tokenFromValue,
                secondText: `${token?.symbol} ${
                  getChainById(quote.action.toChainId).name
                }`,
                uniqueIcon: getNotificationIcon('BRIDGE'),
              },

              type: NOTIFICATIONS_STATE.PENDING,
            });
            await tx.wait();
            closeToast(`${tx.hash}-pending`);
            showToast({
              title: t(`notifications.bridge.process.success`),
              id: tx.hash,
              type: NOTIFICATIONS_STATE.SUCCESS,
              link: `${explorerLink}tx/${tx.hash}`,
              uniqueMessage: {
                text: tokenFromValue,
                secondText: `${token?.symbol} ${
                  getChainById(quote.action.toChainId).name
                }`,
                uniqueIcon: getNotificationIcon('BRIDGE'),
              },
            });
            onClose();
            resetValue();
            loadOffBridge();
          }
        }
      }
    } catch (error) {
      loadOffBridge();
      onClose();
    }
  };
  const { token: tokenWithBalance } = useTokenBalance(
    token?.chainId ?? 1,
    token?.address ?? '',
    'bridge',
  );

  // @ts-ignore
  const hasBalance = isValidBalance(tokenWithBalance?.amount, tokenFromValue);

  const loadingApproveText = `${t('common.button.approving')} ${token?.symbol}`;
  const loadingText = t('common.button.finding');

  const buttonInfo = useMemo(() => {
    if (!isLoggedIn) {
      return {
        text: t(`${translationPath}.connectWallet`),
        fn: connectWallet,
        loading: isLoading,
        loadingText: loadingText,
        isDisabled: false,
      };
    }
    if (isLoading) {
      return {
        text: t('bridge.common.title'),
        loading: isLoading,
        loadingText: loadingText,
        isDisabled: true,
      };
    }
    if (tokenFromValue && errorQuote) {
      return {
        text: t('bridge.common.title'),
        isDisabled: true,
        fn: onConfirm,
      };
    }
    if (!hasBalance && tokenFromValue) {
      return {
        loading: isLoading,
        loadingText: loadingText,
        text: t('bridge.common.title'),
        fn: onConfirm,
      };
    }
    if (isQuoteAllowed && allowance && !isApproved) {
      return {
        text: t(
          isLoadingApprove ? 'common.button.approving' : 'farms.common.approve',
        ),
        fn: approveCallback,
        loading: isLoadingApprove,
        loadingText: loadingApproveText,
        isDisabled: isApproved,
      };
    }
    if (isQuoteAllowed && isApproved) {
      return {
        text: t('bridge.common.title'),
        fn: onConfirm,
        loading: isLoadingBridge,
        loadingText: loadingText,
        isDisabled: isQuoteAllowed && !hasBalance,
      };
    }

    return {
      text: t('bridge.common.title'),
      fn: onConfirm,
      loading: isLoading,
      loadingText: loadingText,
      isDisabled: true,
    };
  }, [
    approveCallback,
    connectWallet,
    isApproved,
    isLoading,
    isLoadingApprove,
    isLoadingBridge,
    isLoggedIn,
    isQuoteAllowed,
    loadingApproveText,
    loadingText,
    onConfirm,
    t,
    hasBalance,
    allowance,
    tokenFromValue,
    errorQuote,
  ]);

  if (!showConfrimModal)
    return (
      <Button
        onClick={buttonInfo.fn}
        isLoading={buttonInfo.loading}
        loadingText={buttonInfo.loadingText}
        spinnerPlacement="end"
        mt="16px"
        w="full"
        h={10}
        fontWeight="500"
        fontSize="lg"
        isDisabled={buttonInfo.isDisabled}
      >
        {buttonInfo.text}
      </Button>
    );

  return (
    <ButtonContainer mt="16px" w="full">
      <Button onClick={onClose} bg="grayBorderBox" w="full">
        {t(`${translationPath}.cancel`, 'Cancel')}
      </Button>

      <Button
        isLoading={isLoadingBridge}
        onClick={e => processBridge(e)}
        w="full"
      >
        {t('common.button.confirm')}
      </Button>
    </ButtonContainer>
  );
};

export default ButtonGroup;
