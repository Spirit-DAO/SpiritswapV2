import { useAppSelector } from 'store/hooks';
import { useTranslation } from 'react-i18next';
import {
  selectNextSpiritDistribution,
  selectSaturatedGauges,
} from 'store/general/selectors';
import {
  selectInspiritUserBalance,
  selectLockedInSpiritAmount,
  selectLockedInsSpiritEndDate,
  selectSpiritClaimableAmount,
} from 'store/user/selectors';
import {
  approveSpirit,
  claimSpirit,
  increaseLockAmount,
} from 'utils/web3/actions';
import Web3Monitoring from 'app/connectors/EthersConnector/transactions';
import {
  Container,
  Card,
  CardTitle,
  CardDescription,
  CardContainer,
  FixedWidthCardContainer,
  CardWrapper,
} from '../../styles';
import Time from './time';
import { CardHeader } from 'app/components/CardHeader';
import { DASHBOARD } from 'constants/icons';
import { checkAddress, formatNumber, formatUSDAmount } from 'app/utils';
import {
  Button,
  Stack,
  VStack,
  Text,
  HStack,
  Flex,
  IconButton,
  useDisclosure,
} from '@chakra-ui/react';
import { useClaimBribes } from '../Voting/hooks/useClaimBribes';
import { SuggestionsTypes } from 'app/hooks/Suggestions/Suggestion';
import { useNavigate } from 'react-router-dom';
import {
  CompoundIcon,
  SoullyIcon,
  SparklesIcon,
} from '../../../../assets/icons/index';
import UseIsLoading from 'app/hooks/UseIsLoading';
import moment from 'moment';
import { CHAIN_ID, SPIRIT } from 'constants/index';
import { TransactionFlowV2 } from 'app/components/TransactionFlowV2';
import { TransactionStatus } from 'app/components/TransactionFlow';
import { StepStateProps } from '../Aside/components/GetInSpirit/GetInSpirit.d';
import { useState } from 'react';
import addresses from 'constants/contracts';
import useWallets from 'app/hooks/useWallets';
import useMobile from 'utils/isMobile';

export default function Dashboard() {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const inSpiritBalance: string = useAppSelector(selectInspiritUserBalance);
  const lockedSpiritBalance = useAppSelector(selectLockedInSpiritAmount);
  const lockedInSpiritEndDate = useAppSelector(selectLockedInsSpiritEndDate);
  const claimableSpiritRewards: string = useAppSelector(
    selectSpiritClaimableAmount,
  );
  const { totalRewards, boostedV2, boostedStable } = useAppSelector(
    selectSaturatedGauges,
  );

  const nextDistribution = useAppSelector(selectNextSpiritDistribution);
  const { isLoggedIn, wallet, account } = useWallets();
  const isMobile = useMobile('1076px');

  const checkSpiritExist = (): boolean => {
    if (wallet.length) {
      const hasSpirit = wallet.find(token =>
        checkAddress(token.address, SPIRIT.address),
      )
        ? true
        : false;
      return hasSpirit;
    }
    return false;
  };
  const hasLock =
    isLoggedIn &&
    lockedInSpiritEndDate &&
    lockedInSpiritEndDate.toString() !== '0';
  const { addToQueue } = Web3Monitoring();
  const { isLoading: isClaimingRewards, claimBribeRewards } = useClaimBribes(
    boostedV2,
    boostedStable,
  );
  const { isLoading, loadingOff, loadingOn } = UseIsLoading();

  const { t } = useTranslation();
  const translationPathHelper = 'inSpirit.modalHelper';

  const claimRewards = async () => {
    try {
      loadingOn();
      const response = await claimSpirit(claimableSpiritRewards);
      const suggestionData = {
        type: SuggestionsTypes.INSPIRIT,
        data: {
          claimSpirit: true,
          tokensToLink: { tokenA: 'SPIRIT', tokenB: 'FTM' },
        },
        id: response.tx.hash,
      };
      addToQueue(response, suggestionData);
      await response.tx.wait();
      loadingOff();
    } catch {
      loadingOff();
      throw new Error('Claim rewards failed');
    }
  };

  const claimBribeRewardsHandler = async () => {
    await claimBribeRewards();
  };

  const approveSpiritAmount = async () => {
    try {
      loadingOn();
      const response = await approveSpirit(
        addresses.inspirit[CHAIN_ID],
        claimableSpiritRewards,
      );
      addToQueue(response);
      await response.tx.wait();
      loadingOff();
    } catch (error) {
      loadingOff();
      throw new Error('Approve spirit failed');
    }
  };

  const lockMoreSpirit = async () => {
    try {
      loadingOn();
      const response = await increaseLockAmount(
        account,
        claimableSpiritRewards,
      );
      const suggestionData = {
        type: SuggestionsTypes.INSPIRIT,
        data: { lockSpirit: true },
        id: response.tx.hash,
      };
      addToQueue(response, suggestionData);
      await response.tx.wait();
      loadingOff();
    } catch (error) {
      loadingOff();
      throw new Error('Lock more spirit failed');
    }
  };

  const onBuySpiritClick = () => {
    navigate('/swap');
  };

  const balanceFormatted = formatNumber({
    value: Number(inSpiritBalance),
    maxDecimals: 2,
  });
  const reinvestFormatted = formatNumber({
    value: Number(claimableSpiritRewards),
    maxDecimals: 2,
  });
  const spiritFormatted = formatNumber({
    value: Number(lockedSpiritBalance),
    maxDecimals: 2,
  });

  const [steps, setSteps] = useState<StepStateProps[]>([]);
  const [txFlowData, setTxFlowData] = useState<string[]>([]);
  const handleTransactionFlow = (type: string) => {
    let steps: StepStateProps[] = [];
    let txLabels: string[] = [];
    if (type === 'all') {
      const claimSpirits: StepStateProps = {
        action: claimRewards,
        label: 'Claim SPIRIT rewards',
        status:
          Number(claimableSpiritRewards) === 0
            ? TransactionStatus.SUCCESS
            : TransactionStatus.UPCOMING,
      };
      const claimBribes: StepStateProps = {
        action: claimBribeRewards,
        label: 'Claim bribes rewards',
        status: TransactionStatus.UPCOMING,
      };
      steps = [claimSpirits, claimBribes];
      txLabels = [
        'Claim all',
        'Confirm all transactions to finish the claiming process.',
      ];
    }
    if (type === 'rewards') {
      const claimAction: StepStateProps = {
        action: claimRewards,
        label: 'Claim SPIRIT rewards',
        status: TransactionStatus.UPCOMING,
      };
      const approveAction: StepStateProps = {
        action: approveSpiritAmount,
        label: 'Approve SPIRIT',
        status: TransactionStatus.UPCOMING,
      };
      const lockAction: StepStateProps = {
        action: lockMoreSpirit,
        label: `Lock ${reinvestFormatted} SPIRIT for inSPIRIT`,
        status: TransactionStatus.UPCOMING,
      };
      steps = [claimAction, approveAction, lockAction];
      txLabels = [
        'Compound SPIRIT',
        'Confirm all transactions to finalize the compound process.',
      ];
    }
    setTxFlowData(txLabels);

    setSteps(steps);
    onOpen();
  };

  const totalBribeRewards: number = totalRewards ? totalRewards : 0;
  const renderBanner = () => {
    const isSpirit = checkSpiritExist();
    if (isSpirit) {
      return (
        <HStack
          p="spacing06"
          bg="ciTrans15"
          justifyContent="space-between"
          borderRadius="md"
        >
          <Text fontSize={'xl'} letterSpacing="loose">
            {t(`${translationPathHelper}.generateInspiritToEarn`)}
          </Text>
          <Button onClick={onBuySpiritClick}>
            <Flex gap="spacing02">
              <SoullyIcon />
              {t(`${translationPathHelper}.lockSpirit`)}
            </Flex>
          </Button>
        </HStack>
      );
    }
    return (
      <HStack
        p="spacing06"
        bg="ciTrans15"
        justifyContent="space-between"
        borderRadius="md"
      >
        <Text fontSize={'xl'} letterSpacing="loose">
          {t(`${translationPathHelper}.butSpiritToGenerateInSpirit`)}
        </Text>
        <Button onClick={onBuySpiritClick} p="8px">
          <HStack align="center" justify="center">
            <SoullyIcon size="20px" />
            <Text> {t(`${translationPathHelper}.buySpirit`)}</Text>
          </HStack>
        </Button>
      </HStack>
    );
  };

  return (
    <Container gridArea="Dashboard" isMobile={isMobile}>
      <CardHeader
        title={t(`${translationPathHelper}.yourDashboard`)}
        id={DASHBOARD}
        helperContent={{
          title: t(`${translationPathHelper}.yourDashboard`),
          text: t(`${translationPathHelper}.dashboardExplanation`),
        }}
      />
      <CardWrapper>
        <FixedWidthCardContainer gridArea="StatsCard">
          <VStack>
            <Card fullWidth fullHeight>
              <CardTitle>
                {t(`${translationPathHelper}.currentInSpiritBalance`)}
              </CardTitle>
              <CardDescription>{`${balanceFormatted} inSPIRIT`}</CardDescription>
            </Card>
            <Card fullWidth fullHeight>
              <CardTitle>
                {t(`${translationPathHelper}.lockedSpirit`)}
              </CardTitle>
              <CardDescription>{`${spiritFormatted} SPIRIT`}</CardDescription>
            </Card>
            <Card fullWidth fullHeight>
              <CardTitle>
                {t(`${translationPathHelper}.inspiritUnlockDate`)}
              </CardTitle>
              <CardDescription>
                {hasLock
                  ? moment
                      .unix(lockedInSpiritEndDate)
                      .utc()
                      .format('Do MMM YYYY')
                  : t(`${translationPathHelper}.noLock`)}
              </CardDescription>
            </Card>
          </VStack>
        </FixedWidthCardContainer>

        <Stack w="full">
          <VStack
            w="full"
            align="center"
            borderRadius="md"
            p="spacing03"
            bg="bgBoxLighter"
          >
            <VStack spacing={0}>
              <Text color="grayDarker" fontSize="sm">
                {t(`${translationPathHelper}.nextDistributionBlock`)}
              </Text>
              <Text fontSize="xl">
                {/* {moment
                  .unix(+nextDistribution)
                  .utc()
                  .format('Do MMM YYYY')} */}
                {' Every Friday (UTC)'}
              </Text>
            </VStack>
            <VStack spacing={0}>
              <Time nextDistributionTimeStamp={nextDistribution} />
            </VStack>
          </VStack>

          <CardContainer gridArea="ClaimCard">
            {hasLock ? (
              <VStack w="full" bg="ciTrans15" spacing={0}>
                <HStack
                  w="full"
                  align="center"
                  justify="space-between"
                  borderRadius="sm"
                  pt="spacing05"
                  px="spacing05"
                >
                  <div>
                    <Text color="ci" fontSize="sm">
                      {t(`${translationPathHelper}.claimSpiritRewards`)}
                    </Text>
                    <Text fontSize="lg" fontWeight="medium">
                      {formatUSDAmount(Number(claimableSpiritRewards))} SPIRIT
                    </Text>
                  </div>
                  <HStack w="50%" align="center" justify="flex-end">
                    <Button
                      variant="inverted"
                      isLoading={isOpen && isLoading}
                      loadingText="Compounding"
                      p="spacing03"
                      onClick={() => handleTransactionFlow('rewards')}
                      disabled={!+claimableSpiritRewards || isLoading}
                    >
                      <HStack align="center">
                        <CompoundIcon />
                        <Text color="ci" fontSize="sm" fontWeight="medium">
                          Compound
                        </Text>
                      </HStack>
                    </Button>
                    <IconButton
                      size="md"
                      variant="inverted"
                      aria-label="claim"
                      icon={<SparklesIcon />}
                      onClick={claimRewards}
                      disabled={isLoading || !+claimableSpiritRewards}
                    />
                  </HStack>
                </HStack>
                <HStack
                  w="full"
                  align="center"
                  justify="space-between"
                  borderRadius="sm"
                  p="spacing05"
                >
                  <div>
                    <Text color="ci" fontSize="sm">
                      {t(`${translationPathHelper}.claimableBribeRewards`)}
                    </Text>
                    <Text fontSize="lg" fontWeight="medium">
                      {formatUSDAmount(Number(totalBribeRewards), '$')}
                    </Text>
                  </div>
                  <HStack w="50%" align="center" justify="flex-end">
                    <IconButton
                      size="md"
                      variant="inverted"
                      aria-label="claim bribe"
                      icon={<SparklesIcon />}
                      onClick={claimBribeRewardsHandler}
                      isDisabled={isClaimingRewards || totalBribeRewards === 0}
                    />
                  </HStack>
                </HStack>
                <HStack
                  w="full"
                  align="center"
                  justify="center"
                  pb="spacing05"
                  px="spacing05"
                >
                  <Button
                    variant="inverted"
                    w="full"
                    loadingText="Claiming"
                    p="spacing03"
                    onClick={() => handleTransactionFlow('all')}
                  >
                    <HStack align="center">
                      <SparklesIcon />
                      <Text color="ci" fontSize="sm" fontWeight="medium">
                        Claim all
                      </Text>
                    </HStack>
                  </Button>
                </HStack>
              </VStack>
            ) : null}
            {!hasLock && renderBanner()}
          </CardContainer>
        </Stack>
      </CardWrapper>
      {steps.length ? (
        <TransactionFlowV2
          isOpen={isOpen}
          onClose={onClose}
          title={txFlowData[0]}
          description={txFlowData[1]}
          steps={steps}
        />
      ) : null}
    </Container>
  );
}
