import { VStack, Text, Skeleton, HStack } from '@chakra-ui/react';
import { Switch } from 'app/components/Switch';
import { CardHeader } from 'app/components/CardHeader';
import { INSPIRIT } from 'constants/icons';
import GreenBox from './components/GreenBox';
import Footer from './components/Footer';
import { useTranslation } from 'react-i18next';
import TokenLabel from './components/TokenLabel';
import ClaimStateLabel from './components/ClaimStateLabel';
import { calcTimeUntilNextBlock } from 'utils/data';
import { inSpiritPanel } from './index';
import { useAppSelector } from 'store/hooks';
import { selectSpiritInfo } from 'store/general/selectors';
import { StyledPanel } from './styles';
import { useState } from 'react';
import {
  getDaysUntilFriday,
  getRoundedSFs,
  truncateTokenValue,
} from 'app/utils';
import { selectLiquidity } from 'store/user/selectors';
import moment from 'moment';
import {
  INSPIRIT as INSPIRIT_ROUTE,
  SWAP,
  resolveRoutePath,
} from 'app/router/routes';

const InSpiritPanel = ({ spiritData, inSpiritData }: inSpiritPanel) => {
  const { t } = useTranslation();
  const translationPath = 'home.about.inspirit';
  const translationPathHelper = 'inSpirit.modalHelper';
  const [valueInSpirit, setValueInSpirit] = useState(false);
  const liquidity = useAppSelector(selectLiquidity);
  const isLoading = liquidity ? liquidity.length === 0 : true;
  const { price: spiritPrice } = useAppSelector(selectSpiritInfo);

  const {
    nextDistribution,
    userLockedAmount,
    userLockedAmountValue,
    inSpiritBalance,
    userLockEndDate,
    userClaimableAmount,
  } = inSpiritData;

  const { amount, address } = spiritData;

  const today = moment().utc();
  const timeUntilFriday = getDaysUntilFriday(today);

  const nextBlockRestTime = calcTimeUntilNextBlock(timeUntilFriday.unix());
  const { days, hours, minutes } = nextBlockRestTime;

  const restTime = () => {
    if ((days || hours || minutes) < 0)
      return `0 ${t(`${translationPath}.days`)}`;
    // Days
    if (days && days === 1) return `${days} ${t(`${translationPath}.day`)}`;
    if (days) return `${days} ${t(`${translationPath}.days`)}`;
    // Hours
    if (!days && hours && hours === 1)
      return `${hours} ${t(`${translationPath}.hour`)}`;
    if (!days && hours) return `${hours} ${t(`${translationPath}.hours`)}`;
    // Minutes
    if (!hours && minutes && minutes === 1)
      return `${minutes} ${t(`${translationPath}.minute`)}`;
    if (!hours && minutes)
      return `${minutes} ${t(`${translationPath}.minutes`)}`;
  };

  let userClaimableAmountUSD: number;
  userClaimableAmountUSD = userClaimableAmount * spiritPrice;

  const totalValue = userLockedAmountValue + userClaimableAmountUSD;
  const claimableRewardsValueUSD = userLockedAmount
    ? userClaimableAmountUSD
    : undefined;

  const greenBoxTitle = amount
    ? t(`${translationPath}.lockSpiritText`)
    : t(`${translationPath}.buySpiritText`);

  const greenBoxButtonTitle =
    amount && !inSpiritBalance
      ? t(`${translationPath}.lockSpirit`)
      : t(`${translationPath}.buySpirit`);

  const label = userClaimableAmount
    ? t(`${translationPath}.claimReward`)
    : `${t(`${translationPath}.inSpiritReward`)} ${restTime()}`;

  const navigateTo =
    amount && !inSpiritBalance
      ? INSPIRIT_ROUTE.path
      : `${SWAP.path}/address/${address}`;

  const showLoader = isLoading;

  const totalValueToShow = valueInSpirit
    ? `${getRoundedSFs(`${totalValue / spiritPrice}`, 4)} SPIRIT`
    : `≈ $${getRoundedSFs(`${totalValue}`, 2)}`;

  const claimableRewardsValue = claimableRewardsValueUSD
    ? valueInSpirit
      ? `${getRoundedSFs(
          `${claimableRewardsValueUSD / spiritPrice}`,
          2,
        )} SPIRIT`
      : `≈ $${getRoundedSFs(`${claimableRewardsValueUSD}`)}`
    : undefined;

  const renderStatus = () => {
    if (showLoader) return null;

    return (
      <VStack w="full" spacing="spacing02">
        <HStack w="full" justifyContent="space-between">
          <Text fontSize="16px">Total Value</Text>
          <Text fontSize="20px">{totalValueToShow}</Text>
        </HStack>
        <HStack w="full" justifyContent="space-between">
          <Text fontSize="14px" color="gray">
            Total inSPIRIT
          </Text>
          <Text fontSize="14px" color="gray">
            {truncateTokenValue(inSpiritBalance, spiritPrice)}
          </Text>
        </HStack>
      </VStack>
    );
  };
  return (
    <>
      <StyledPanel
        footer={<Footer userClaimableAmount={userClaimableAmount} />}
      >
        <VStack p="24px" align="start" spacing="spacing04">
          <CardHeader
            title="inSPIRIT"
            helperContent={{
              title: t(`${translationPathHelper}.inspirit`),
              text: t(`${translationPathHelper}.inspiritExplanation`),
              showDocs: true,
            }}
            id={INSPIRIT}
          />

          {showLoader ? (
            <Skeleton
              startColor="grayBorderBox"
              endColor="bgBoxLighter"
              w="full"
              h="214px"
              mb="spacing05"
            />
          ) : null}

          {!userLockEndDate && !showLoader ? (
            <GreenBox
              title={greenBoxTitle}
              buttonTitle={greenBoxButtonTitle}
              navigateTo={navigateTo}
            />
          ) : null}

          {userLockEndDate && !showLoader ? (
            <>
              <VStack align="start" w="full" spacing="8px">
                <HStack w="full" justifyContent="space-between">
                  <Text color="grayDarker" fontSize="sm">
                    inSPIRIT Balance
                  </Text>
                  <Switch
                    gap="8px"
                    label="Value in SPIRIT"
                    justify={{ base: 'space-between', md: 'initial' }}
                    onChange={() => setValueInSpirit(!valueInSpirit)}
                    checked={valueInSpirit}
                  />
                </HStack>

                <TokenLabel
                  spiritPrice={spiritPrice}
                  valueOnSpirit={valueInSpirit}
                  symbol="inSPIRIT"
                  tokenBalance={inSpiritBalance}
                  tokenValue={userLockedAmountValue}
                />
              </VStack>

              <ClaimStateLabel
                claimableState={label}
                claimableAmount={claimableRewardsValue}
              />
            </>
          ) : null}
          {userLockEndDate ? renderStatus() : null}
        </VStack>
      </StyledPanel>
    </>
  );
};

export default InSpiritPanel;
