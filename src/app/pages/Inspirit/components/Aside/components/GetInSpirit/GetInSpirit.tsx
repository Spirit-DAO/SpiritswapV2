import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ReactComponent as InSPIRITSvg } from 'app/assets/images/menu-inspirit.svg';
import { ReactComponent as LockingSvg } from 'app/assets/images/locking.svg';
import { Paragraph } from 'app/components/Typography';
import { formatAmount } from 'app/utils';
import { useAppSelector } from 'store/hooks';
import moment from 'moment';
import addresses from 'constants/contracts';
import {
  getInspiritEstimate,
  canUnlockInspirit,
  getMaxTime,
} from 'utils/data/inspirit';
import {
  approveSpirit,
  createInspiritLock,
  increaseLockAmount,
  increaseLockTime,
  unlockInspirit,
} from 'utils/web3/actions/inspirit';
import Web3Monitoring from 'app/connectors/EthersConnector/transactions';
import { StyledListItem } from '../Help/styles';
import {
  StyledLabel,
  StyledStepHeader,
  StyledStepNumber,
  StyledStepWrapper,
  StyledHr,
  StyledLockDetailsWrapper,
  StyledLockDetails,
  StyledHighlight,
  StyledButtonsContainer,
  StyledSelect,
} from './styles';
import { TokenAmountPanel } from 'app/components/NewTokenAmountPanel';
import { SPIRIT, CHAIN_ID } from 'constants/index';
import { Icon } from 'app/components/Icon';
import {
  selectLockedInsSpiritEndDate,
  selectInspiritAllowance,
  selectLockedInSpiritAmount,
} from 'store/user/selectors';
import { Button, Box, HStack, useDisclosure, Text } from '@chakra-ui/react';
import { CardHeader } from 'app/components/CardHeader';
import { INSPIRIT } from 'constants/icons';
import UseIsLoading from 'app/hooks/UseIsLoading';
import { SuggestionsTypes } from 'app/hooks/Suggestions/Suggestion';
import { NON_ZERO, NOT_ENOUGH_FUNDS } from 'constants/errors';
import { StepSlider } from 'app/components/StepSlider';
import { TransactionFlowV2 } from 'app/components/TransactionFlowV2';
import { TransactionStatus } from 'app/components/TransactionFlow';
import { StepStateProps } from './GetInSpirit.d';
import useWallets from 'app/hooks/useWallets';

const INITIAL_ERROR_MESSAGE = {
  msg: '',
  canApprove: false,
};

const GetInSpirit = () => {
  const { t } = useTranslation();
  const { addToQueue } = Web3Monitoring();
  const { isLoading, loadingOff, loadingOn } = UseIsLoading();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const translationPathHelper = 'inSpirit.modalHelper';
  const lockedInSpiritEndDate = useAppSelector(selectLockedInsSpiritEndDate);
  const lockedSpiritBalance = useAppSelector(selectLockedInSpiritAmount);
  const [steps, setSteps] = useState<StepStateProps[]>([]);
  const inspiritAllowance = useAppSelector(selectInspiritAllowance);
  const { isLoggedIn, account } = useWallets();
  const [loadingText, setLoadingText] = useState('');

  const [errorMessage, setErrorMessage] = useState<{
    msg: string;
    canApprove: boolean;
  }>(INITIAL_ERROR_MESSAGE);

  const [balance, setBalance] = useState<string | null>(null);
  const {
    isLoading: isLoadingUnlock,
    loadingOff: loadOffUnlock,
    loadingOn: loadOnUnlock,
  } = UseIsLoading();

  const timeStepsV2 = [
    { unit: '2W', days: 14 },
    { unit: '1M', days: 30 },
    { unit: '3M', days: 90 },
    { unit: '6M', days: 180 },
    { unit: '1Y', days: 360 },
    { unit: '2Y', days: 720 },
    { unit: 'MAX', days: 1440 },
  ];

  const timestampMapping = {
    '2W': { value: 2, scale: 'weeks' },
    '1M': { value: 1, scale: 'months' },
    '3M': { value: 3, scale: 'months' },
    '6M': { value: 6, scale: 'months' },
    '1Y': { value: 1, scale: 'years' },
    '2Y': { value: 2, scale: 'years' },
    MAX: { value: 4, scale: 'years' },
  };
  const hasLock = isLoggedIn && lockedInSpiritEndDate !== 0;
  const [lockMode, setLockMode] = useState(0);
  const [lockAmount, setLockAmount] = useState<string>('');
  const [lockPeriod, setLockPeriod] = useState<string>('');
  const [estimate, setEstimate] = useState<{
    date: moment.Moment | undefined;
    amount: string;
  }>({
    date: undefined,
    amount: '0',
  });
  const stepOneExist =
    (lockMode === 0 && lockAmount !== '' && Number(lockAmount) !== 0) ||
    (lockMode === 1 && lockPeriod !== '');

  const stepsCompleted = (): boolean => {
    if (lockedInSpiritEndDate !== 0) {
      return stepOneExist;
    }
    const stepOneFullfiled = lockAmount !== '' && Number(lockAmount) !== 0;
    const stepTwoFullfiled = lockPeriod !== '' && lockPeriod !== '0';
    return stepOneFullfiled && stepTwoFullfiled;
  };

  const maxTime = getMaxTime(lockedInSpiritEndDate);

  const filterTime = timeStepsV2.filter(
    step => step.days < maxTime || step.unit === 'MAX',
  );

  const [hasUnlocked, setHasUnlocked] = useState(false);

  const onStepSliderHandler = value => {
    setLockPeriod(value);

    const estimation = getInspiritEstimate(
      lockMode === 0 ? lockAmount : lockedSpiritBalance,
      timestampMapping[value],
      lockedInSpiritEndDate,
      lockMode,
    );

    setEstimate(estimation);
  };

  const onSelectLockHandler = ({ index }) => {
    if (!index) setLockPeriod('');
    setLockMode(index);
  };

  const handleSetLockAmount = event => {
    setErrorMessage(INITIAL_ERROR_MESSAGE);
    setLockAmount(event.value);

    if (validate(event.value)) return;

    const estimation = getInspiritEstimate(
      event.value,
      timestampMapping[lockPeriod],
      lockedInSpiritEndDate,
      lockMode,
    );

    setEstimate(estimation);
  };

  const approveSpiritAmount = async () => {
    try {
      loadingOn();
      setLoadingText('Pending Approval');
      const response = await approveSpirit(
        addresses.inspirit[CHAIN_ID],
        lockAmount,
      );
      addToQueue(response);
      await response.tx.wait();
      loadingOff();
      setLoadingText('');
    } catch (error) {
      loadingOff();
      console.error(error);
    }
  };

  const lockSpiritForInSpirit = async () => {
    try {
      loadingOn();
      setLoadingText('Pending');
      const response = await createInspiritLock(
        account,
        lockAmount,
        estimate.date?.unix(),
      );
      addToQueue(response);
      await response.tx.wait();
      loadingOff();
      setLoadingText('');
    } catch (error) {
      loadingOff();
      setLoadingText('');
      console.error(error);
    }
  };

  const lockMoreSpirit = async () => {
    try {
      loadingOn();
      setLoadingText('Pending');
      const response = await increaseLockAmount(account, lockAmount);
      const suggestionData = {
        type: SuggestionsTypes.INSPIRIT,
        data: { lockSpirit: true },
        id: response.tx.hash,
      };
      addToQueue(response, suggestionData);
      await response.tx.wait();
      loadingOff();
      setLoadingText('');
    } catch (error) {
      loadingOff();
      setLoadingText('');
      console.error(error);
    }
  };

  const extendLockingPeriod = async () => {
    try {
      loadingOn();
      const response = await increaseLockTime(account, estimate.date?.unix());
      addToQueue(response);
      await response.tx.wait();
      loadingOff();
      setLoadingText('');
    } catch (error) {
      loadingOff();
      setLoadingText('');
      console.error(error);
    }
  };

  const validate = (lockAmount: string) => {
    const numberLockAmount = parseFloat(lockAmount);

    if (lockMode === 0) {
      if (!lockAmount || !numberLockAmount) {
        setErrorMessage({ msg: NON_ZERO, canApprove: false });
        return true;
      }
    }
    if (lockMode === 1 && (!lockPeriod || lockPeriod === '')) {
      if (!lockPeriod || lockPeriod === '') {
        setErrorMessage({ msg: NON_ZERO, canApprove: false });
        return true;
      }
    }

    if (parseFloat(balance || '') < numberLockAmount) {
      setErrorMessage({ msg: NOT_ENOUGH_FUNDS, canApprove: false });
      return true;
    }

    return false;
  };

  const handleInspiritAction = async () => {
    setErrorMessage(INITIAL_ERROR_MESSAGE);

    if (validate(lockAmount)) return;

    if (inspiritAllowance && !hasLock) {
      return lockSpiritForInSpirit();
    }

    if (hasLock && lockMode === 0) {
      return lockMoreSpirit();
    }

    if (hasLock && lockMode === 1) {
      return extendLockingPeriod();
    }
  };

  const handleInspiritLabel = () => {
    const lockText = 'Lock SPIRIT for inSPIRIT';
    if (inspiritAllowance && !hasLock) {
      return lockText;
    }

    if (hasLock && lockMode === 0) {
      return lockText;
    }

    if (hasLock && lockMode === 1) {
      return 'Extend lock for inSPIRIT';
    }
    return lockText;
  };

  const getIsNotApproved = (): boolean => {
    if (lockMode === 0) {
      return !inspiritAllowance || inspiritAllowance < Number(lockAmount);
    }
    return inspiritAllowance === 0 ?? false;
  };

  useEffect(() => {
    const status =
      canUnlockInspirit(lockedInSpiritEndDate) &&
      !['0', '0.0'].includes(lockedSpiritBalance);

    if (status) {
      return setHasUnlocked(true);
    }

    setHasUnlocked(false);
  }, [lockedInSpiritEndDate, lockedSpiritBalance]);

  const handleUnlock = async () => {
    try {
      if (hasUnlocked) {
        loadOnUnlock();
        const response = await unlockInspirit(lockedSpiritBalance);
        addToQueue(response);
        loadOffUnlock();
        setHasUnlocked(true);
      }
    } catch (error) {
      loadOffUnlock();
    }
  };

  const getStatusButton = () => {
    const DISABLED = true;
    const NOT_DISABLED = false;

    if (isLoading) return DISABLED;
    if (!isLoggedIn) return DISABLED;
    if (errorMessage?.canApprove) return DISABLED;
    if (errorMessage?.msg) return DISABLED;
    if (lockMode === 0 && lockAmount === '') return DISABLED;
    if (lockMode === 1 && estimate.date?.unix() === lockedInSpiritEndDate)
      return DISABLED;
    if (lockMode === 1 && lockPeriod === '') return DISABLED;
    if (hasUnlocked) return DISABLED;

    return NOT_DISABLED;
  };

  const handleTransactionFlow = () => {
    const approveStep: StepStateProps = {
      action: approveSpiritAmount,
      label: 'Approve SPIRIT',
      status: getIsNotApproved()
        ? TransactionStatus.UPCOMING
        : TransactionStatus.SUCCESS,
    };

    const actionStep: StepStateProps = {
      action: handleInspiritAction,
      label: handleInspiritLabel(),
      status: TransactionStatus.UPCOMING,
    };

    if (lockMode === 1) setSteps([actionStep]);
    else setSteps([approveStep, actionStep]);

    onOpen();
  };

  const textGenerator = () => {
    if (
      (!inspiritAllowance && !hasLock) ||
      inspiritAllowance < Number(lockAmount)
    )
      return 'Approve SPIRIT';

    if (
      inspiritAllowance &&
      !hasLock &&
      inspiritAllowance >= Number(lockAmount)
    )
      return 'Lock SPIRIT for inSPIRIT';

    if (hasLock && lockMode === 0 && inspiritAllowance >= Number(lockAmount))
      return 'Lock more SPIRIT';

    if (hasLock && lockMode === 1 && inspiritAllowance >= Number(lockAmount))
      return 'Extend locking period';

    return '';
  };

  return (
    <Box>
      <StyledListItem>
        <CardHeader
          title="Get inLEVI"
          id={INSPIRIT}
          helperContent={{
            title: t(`${translationPathHelper}.inspirit`),
            text: t(`${translationPathHelper}.inspiritExplanation`),
            showDocs: true,
          }}
        />
      </StyledListItem>
      {hasLock ? (
        <StyledSelect
          selected={lockMode}
          labels={['Lock more', 'Extend period']}
          onChange={onSelectLockHandler}
        />
      ) : null}

      {!hasLock || lockMode === 0 ? (
        <StyledStepWrapper>
          <StyledStepHeader>
            <StyledStepNumber>1</StyledStepNumber>
            <StyledLabel>{`Choose ${
              hasLock ? 'additional' : ''
            } SPIRIT amount to lock`}</StyledLabel>
          </StyledStepHeader>
          <TokenAmountPanel
            token={SPIRIT}
            isSelectable={false}
            inputValue={lockAmount}
            context="token"
            onChange={handleSetLockAmount}
            showPercentage
            errorMessage={errorMessage?.msg}
            setErrorMessage={setErrorMessage}
            setBalance={setBalance}
          />
        </StyledStepWrapper>
      ) : null}

      {!hasLock ? <StyledHr /> : null}

      {!hasLock || lockMode === 1 ? (
        <StyledStepWrapper>
          <StyledStepHeader>
            <StyledStepNumber>{hasLock ? '1' : '2'}</StyledStepNumber>
            <StyledLabel>{`Choose ${
              hasLock ? 'extended' : ''
            } locking period of your SPIRIT`}</StyledLabel>
          </StyledStepHeader>

          <StepSlider
            onChange={onStepSliderHandler}
            steps={filterTime}
            currentValue={lockPeriod}
          />
        </StyledStepWrapper>
      ) : null}
      <StyledHr />

      {stepsCompleted() ? (
        <StyledStepWrapper>
          <StyledStepHeader>
            <StyledStepNumber>{hasLock ? '2' : '3'}</StyledStepNumber>
            <StyledLabel>View details and lock your SPIRIT</StyledLabel>
          </StyledStepHeader>

          <StyledLockDetailsWrapper>
            <StyledLockDetails>
              <Icon size={30} clickable={false} icon={<InSPIRITSvg />} />
              <div>
                <Paragraph>You receive:</Paragraph>
                <StyledHighlight>{`${formatAmount(
                  estimate.amount,
                  18,
                  4,
                )} inSPIRIT`}</StyledHighlight>
              </div>
            </StyledLockDetails>
            <StyledLockDetails>
              <Icon size={30} clickable={false} icon={<LockingSvg />} />
              <div>
                <Paragraph>{}</Paragraph>
                <StyledHighlight>
                  {estimate.date ? estimate.date.format('Do MMM YYYY') : ''}
                </StyledHighlight>
              </div>
            </StyledLockDetails>
          </StyledLockDetailsWrapper>
        </StyledStepWrapper>
      ) : null}

      <StyledButtonsContainer>
        <HStack gap="8px">
          <Button
            size="lg"
            w="100%"
            onClick={handleTransactionFlow}
            disabled={getStatusButton()}
            isLoading={isLoading}
            loadingText={loadingText}
            display="flex"
            alignItems="center"
          >
            <Text w="full" fontSize="sm">
              {textGenerator()}
            </Text>
          </Button>
          {hasUnlocked && (
            <Button
              onClick={handleUnlock}
              size="lg"
              w="100%"
              isDisabled={!hasUnlocked}
              isLoading={isLoadingUnlock}
            >
              <Text fontSize="sm">Unlock your SPIRIT</Text>
            </Button>
          )}
        </HStack>
      </StyledButtonsContainer>
      {steps.length ? (
        <TransactionFlowV2
          isOpen={isOpen}
          onClose={onClose}
          title="Lock SPIRIT for inSPIRIT"
          description="Confirm all transactions to finish the claiming process."
          steps={steps}
        />
      ) : null}
    </Box>
  );
};

export default GetInSpirit;
