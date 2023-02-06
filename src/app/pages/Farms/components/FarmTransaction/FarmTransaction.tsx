import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Flex, Skeleton } from '@chakra-ui/react';
import { FarmTransactionType } from 'app/pages/Farms/enums/farmTransaction';
import { StyledHeading, StylesContainer } from './styles';
import UseIsLoading from 'app/hooks/UseIsLoading';
import { checkAddress } from 'app/utils';
import { farmStatus } from 'utils/web3/actions/farm';
import { TokenAmountPanel } from 'app/components/NewTokenAmountPanel';
import { NON_ZERO, NOT_ENOUGH_FUNDS } from 'constants/errors';
import Web3Monitoring from 'app/connectors/EthersConnector/transactions';
import { transactionResponse } from 'utils/web3';
import { SuggestionsTypes } from 'app/hooks/Suggestions/Suggestion';
import { useAppSelector } from 'store/hooks';
import {
  selectFarmsStaked,
  selectIsLoggedIn,
  selectLiquidityWallet,
} from 'store/user/selectors';
import useWallets from 'app/hooks/useWallets';
import { selectLpPrices } from 'store/general/selectors';
import { Props } from './FarmTransaction.d';
import { useTokenBalance } from 'app/hooks/useTokenBalance';

const FarmTransaction = ({
  farm,
  type,
  onCancelTransaction,
  onApproveTransaction,
  onConfirmWithdraw,
  onConfirmDeposit,
  onOpen,
  TokenList,
}: Props) => {
  const { t } = useTranslation();
  const { account } = useWallets();
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const { addToQueue } = Web3Monitoring();
  const [inputValue, setInputValue] = useState('');
  const { isLoading, loadingOff, loadingOn } = UseIsLoading();
  const [loadingText, setLoadingText] = useState('Pending');
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined,
  );
  const [shouldTransition, setShouldTransition] = useState(true);
  const farmsStaked = useAppSelector(selectFarmsStaked);
  const lpPrices = useAppSelector(selectLpPrices);

  useEffect(() => {}, [account]);

  const isWithdraw = type === FarmTransactionType.WITHDRAW;
  const lowerLp = farm.lpAddress ? farm.lpAddress.toLowerCase() : '';

  const { tokens, lpAddress, gaugeAddress, title } = farm;

  const [token, setToken] = useState({
    address: lpAddress,
    symbol: '',
    name: '',
    decimals: 18,
    chainId: 250,
    rate: lpPrices[lowerLp],
  });

  const { token: fetchedTokenBalance } = useTokenBalance(
    250,
    lpAddress,
    'liquidity',
    token,
  );

  const amount =
    isWithdraw && farmsStaked[lowerLp]
      ? farmsStaked[lowerLp].amount
      : fetchedTokenBalance && fetchedTokenBalance.amount
      ? fetchedTokenBalance.amount
      : '0';

  if (isWithdraw && lowerLp && token.address !== lowerLp) {
    setToken({ ...token, address: lowerLp });
  }

  useEffect(() => {
    new Promise(() =>
      setTimeout(() => {
        setShouldTransition(false);
      }, 20),
    );
  }, []);

  if (tokens?.length !== 2 && farm.type !== 'weighted') {
    return null;
  }

  const hasError = () => {
    const checkNonZeroValue = !+inputValue;
    if (checkNonZeroValue) {
      setErrorMessage(NON_ZERO);
      return true;
    }
    if (Number(inputValue) > Number(amount)) {
      setErrorMessage(NOT_ENOUGH_FUNDS);
      return true;
    }
    return false;
  };

  const handleInput = token => {
    setInputValue(token.value);
    setErrorMessage(undefined);
  };

  const handleWithdraw = async () => {
    if (hasError()) return;
    setErrorMessage(undefined);
    try {
      loadingOn();
      setLoadingText('Checking approve');
      if (gaugeAddress) {
        const status = await farmStatus(lpAddress, gaugeAddress, account);

        if (status.toString() === '0') {
          setLoadingText('Approve');
          const txApprove = await onApproveTransaction();
          setLoadingText('Approving');
          await txApprove.wait();
        }
      }
      setLoadingText('Pending');
      const isMax = inputValue === amount;
      const tx = await onConfirmWithdraw(inputValue, isMax);
      const response = transactionResponse('farm.withdraw', {
        tx: tx,
        inputSymbol: `${title} LP`,
        inputValue: inputValue,
        operation: 'FARM',
        update: 'portfolio',
        updateTarget: 'user',
      });
      addToQueue(response);
      setLoadingText('Withdrawing');
      await tx.wait();
      loadingOff();
      onCancelTransaction && onCancelTransaction();
    } catch (error) {
      console.error(error);
      loadingOff();
    }
  };

  const handleDeposit = async () => {
    if (!isLoggedIn && onOpen) {
      return onOpen();
    }
    if (hasError()) return;
    setErrorMessage(undefined);
    try {
      loadingOn();
      setLoadingText('Checking approve');
      const status = await farmStatus(lpAddress, gaugeAddress, account);
      setLoadingText('Approve');
      if (status.toString() === '0') {
        const txApprove = await onApproveTransaction();
        setLoadingText('Approving');
        await txApprove.wait();
      }
      setLoadingText('Pending');
      const tx = await onConfirmDeposit(inputValue);
      const response = transactionResponse('farm.deposit', {
        tx: tx,
        inputSymbol: `${title} LP`,
        inputValue: inputValue,
        operation: 'FARM',
        update: 'portfolio',
        updateTarget: 'user',
      });

      const suggestionData = {
        id: tx.hash,
        type: SuggestionsTypes.FARMS,
        data: {
          depositLp: true,
        },
      };
      addToQueue(response, suggestionData);
      setLoadingText('Depositing');
      await tx.wait();
      loadingOff();
      onCancelTransaction && onCancelTransaction();
    } catch (error) {
      console.error(error);
      loadingOff();
    }
  };

  const getTitle = () => {
    switch (type) {
      case FarmTransactionType.DEPOSIT:
        return `${t('farms.common.deposit')} ${t('farms.common.lpTokens')}`;
      case FarmTransactionType.WITHDRAW:
        return `${t('farms.common.withdraw')} ${t('farms.common.lpTokens')}`;
    }
  };

  return (
    <StylesContainer
      staked={
        farmsStaked[lowerLp] && parseFloat(farmsStaked[lowerLp].amount) > 0
      }
    >
      <TokenList farm={farm} />

      <Skeleton isLoaded={!shouldTransition} fadeDuration={0.15} mt="0">
        <StyledHeading level={2}>{getTitle()}</StyledHeading>

        <TokenAmountPanel
          token={token}
          context={isWithdraw ? 'farm' : 'liquidity'}
          showPercentage
          showBalance
          showTokenSelection={false}
          errorMessage={errorMessage}
          inputValue={inputValue}
          onChange={handleInput}
          setErrorMessage={setErrorMessage}
        />

        <Flex>
          <Button
            w="full"
            variant="secondary"
            onClick={onCancelTransaction}
            mr="2px"
            mt="0.5rem"
          >
            {t(`farms.common.cancel`)}
          </Button>

          {isWithdraw ? (
            <Button
              isLoading={isLoading}
              loadingText={loadingText}
              w="full"
              ml="2px"
              variant="inverted"
              mt="0.5rem"
              onClick={handleWithdraw}
            >
              {t(`farms.common.confirmWithdraw`)}
            </Button>
          ) : (
            <Button
              isLoading={isLoading}
              loadingText={loadingText}
              ml="2px"
              w="full"
              variant="inverted"
              mt="0.5rem"
              onClick={handleDeposit}
            >
              {isLoggedIn
                ? t(`farms.common.confirmWithdraw`)
                : t('farms.common.connectWallet')}
            </Button>
          )}
        </Flex>
      </Skeleton>
    </StylesContainer>
  );
};

export default FarmTransaction;
