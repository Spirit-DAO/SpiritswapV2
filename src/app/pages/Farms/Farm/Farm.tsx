import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { EcosystemFarmType } from 'app/interfaces/Farm';
import { IconTooltipPanel } from '../components/IconTooltipPanel';
import { YourApr } from '../components/YourApr';
import { IconButton } from 'app/components/IconButton';
import { StyledContainer } from './styles';
import { ReactComponent as SparklesIcon } from 'app/assets/images/sparkles.svg';
import { BoostFactor } from '../components/BoostFactor';
import Web3Monitoring from 'app/connectors/EthersConnector/transactions';
import { transactionResponse } from 'utils/web3/actions/utils';
import { checkAddress, getRoundedSFs } from 'app/utils';
import { SuggestionsTypes } from 'app/hooks/Suggestions/Suggestion';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  SimpleGrid,
  Text,
  AccordionButton,
  AccordionIcon,
  Accordion,
  AccordionPanel,
  Spinner,
  Skeleton,
} from '@chakra-ui/react';
import { RetrieveTokens } from '../components/RetrieveTokens/RetrieveTokens';
import {
  selectFarmRewards,
  selectFarmsStaked,
  selectInspiritUserBalance,
} from 'store/user/selectors';
import { useAppSelector } from 'store/hooks';
import {
  selectSpiritInfo,
  selectTotalSpiritSupply,
} from 'store/general/selectors';
import { calculateBoost } from '../helpers/calculateBoost';
import BigNumber from 'bignumber.js';
import { formatUnits } from 'ethers/lib/utils';
import { Props } from './Farm.d';
import useGetTokensPrices from 'app/hooks/useGetTokensPrices';

export const Farm = ({
  farm,
  isTransitioning,
  isOpen,
  TokenList,
  onDeposit,
  onWithdraw,
  onClaim,
}: Props) => {
  const { t } = useTranslation();
  const translationPath = 'farms.common';
  const navigate = useNavigate();
  const { addToQueue } = Web3Monitoring();

  const {
    tokens,
    totalLiquidity,
    apr,
    aprRange,
    multiplier,
    yourApr,
    boosted,
    ecosystem,
    lpApr,
    lpAddress,
    totalSupply,
    rewardToken,
    type,
    gaugeAddress,
  } = farm;

  const { loadingPrices } = useGetTokensPrices({
    tokenAddresses: [lpAddress],
  });

  const aprValue = ecosystem ? apr : yourApr;
  const isMax = aprRange![1] === yourApr;
  const [doTransition, setDoTransition] = useState(false);
  const [shouldTransition, setShouldTransition] = useState(isTransitioning);
  const [isLoading, setIsLoading] = useState(false);
  const farmRewards = useAppSelector(selectFarmRewards);
  const farmsStaked = useAppSelector(selectFarmsStaked);
  const totalInSpirit = useAppSelector(selectTotalSpiritSupply);
  const userInSpirit = useAppSelector(selectInspiritUserBalance);
  const spiritPriceInfo = useAppSelector(selectSpiritInfo);
  const { price: spiritPrice } = spiritPriceInfo;

  const farmReward =
    farmRewards &&
    farmRewards.find(item =>
      checkAddress(item.gaugeAddress, gaugeAddress ?? ''),
    );

  const pairRate = (Number(totalLiquidity) / Number(totalSupply)).toString();

  const farmUserData = useMemo(() => {
    const lpFarmId = `${lpAddress?.toLowerCase()}`;

    let currentBoost = '1';
    let spiritNeededForMax = '0';
    let lpTokens = '0';
    let lpTokensMoney = '0';
    let spiritEarned = '0';
    let spiritEarnedMoney = '0';

    if (farmsStaked[lpFarmId]) {
      lpTokens = farmsStaked[lpFarmId].amount;
      lpTokensMoney = (
        loadingPrices ? 0 : parseFloat(pairRate) * parseFloat(lpTokens)
      ).toFixed(2);

      ({ currentBoost, spiritNeededForMax } = calculateBoost(
        totalInSpirit,
        userInSpirit,
        lpTokens,
        totalSupply,
      ));
    }

    const fullApy = new BigNumber(yourApr ?? '0');

    const yourAprValue = (
      new BigNumber(lpTokens!).isGreaterThan(0)
        ? fullApy.times(new BigNumber(currentBoost))
        : fullApy
    ).toFixed(2);

    if (farmReward) {
      // We set this to a small value (above zero) to avoid farm reordering after just claiming a reward
      spiritEarned =
        farmReward.earned === 0
          ? '0.0000000000001'
          : formatUnits(farmReward.earned, 18);

      const spiritEarnedMoneyVal = Number(spiritEarned) * spiritPrice;
      spiritEarnedMoney =
        spiritEarnedMoneyVal < 0.01 && spiritEarnedMoneyVal > 0
          ? '< $0.01'
          : `≈ $${spiritEarnedMoneyVal.toFixed(2)}`;
    }
    return {
      lpTokens,
      lpTokensMoney,
      spiritEarned,
      spiritEarnedMoney,
      currentBoost,
      spiritNeededForMax,
      yourAprValue,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [farmsStaked, farmRewards]);

  const infoPanelItems = [] as any;

  const checkSmallValue = (value: number) => {
    if (!value) return '0.0';
    if (value < 0.01 && value > 0) return '<0.01';
    return value.toFixed(2);
  };

  const compactifyValue = (value: string | number) => {
    return Number(`${value}`.replaceAll(',', '')).toLocaleString('en-us', {
      notation: 'compact',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  if (!ecosystem && aprRange) {
    if (aprRange[0] !== aprRange[1]) {
      infoPanelItems.push({
        label: t(`farms.iconTooltipPanel.aprRange`),
        value: `${compactifyValue(aprRange[0])}% ~ ${compactifyValue(
          aprRange[1],
        )}%`,
        tooltip: 'aprRange',
      });
    } else {
      infoPanelItems.push({
        label: t(`farms.iconTooltipPanel.apr`),
        value: `${aprRange[0]}%`,
        tooltip: 'apr',
      });
    }
  }

  if (ecosystem) {
    infoPanelItems.push({
      label: t(`farms.iconTooltipPanel.status`),
      value: t(
        `farms.iconTooltipPanel.${
          ecosystem === EcosystemFarmType.VERIFIED ? 'verified' : 'unverified'
        }`,
      ),
    });
  }

  if (!!totalLiquidity || totalLiquidity === 0) {
    infoPanelItems.push({
      label: t(`farms.iconTooltipPanel.totalLiquidity`),
      value:
        '$' +
        totalLiquidity.toLocaleString('en-us', { maximumFractionDigits: 0 }),
    });
  }

  const multiplierValue = parseFloat(multiplier || '0');

  if (!ecosystem && !!multiplier) {
    infoPanelItems.push({
      label: t(`farms.iconTooltipPanel.votingWeight`),
      value:
        multiplierValue > 0 && multiplierValue < 0.01
          ? '<0.01%'
          : `${multiplierValue.toFixed(2)}%`,
      tooltip: 'votingWeight',
    });
  }
  infoPanelItems.push({
    label: t(`${translationPath}.stakedLPTokens`),
    value: checkSmallValue(+farmUserData.lpTokens),
  });

  infoPanelItems.push({
    label: t(`${translationPath}.stakedLPTokensMoney`),
    value: `$${farmUserData.lpTokensMoney}`,
  });
  if (ecosystem && rewardToken) {
    infoPanelItems.push({
      label: t(`farms.ecosystem.rewardToken`),
      value: rewardToken,
    });
  }

  // TODO: Replace this default with actual input
  const defaultAmount = '1';

  const handleDeposit = () => {
    onDeposit(defaultAmount);
  };
  const handleWithdraw = () => {
    onWithdraw(defaultAmount);
  };
  const handleClaim = async () => {
    setIsLoading(true);
    try {
      const tx = await onClaim();
      const response = transactionResponse('farm.claim', {
        tx: tx,
        uniqueMessage: {
          text: `Claiming ${getRoundedSFs(
            farmUserData.spiritEarned?.toString() || '',
          )}`,
          secondText: 'SPIRIT',
        },
        update: 'portfolio',
        updateTarget: 'user',
      });

      const suggestionData = {
        type: SuggestionsTypes.FARMS,
        id: response.tx.hash,
        data: {
          harvestSpirit: true,
        },
      };
      addToQueue(response, suggestionData);
      await tx.wait();
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const getUrl = () => {
    const token0 = tokens[0] === 'WFTM' ? 'FTM' : tokens[0];
    const token1 = tokens[1] === 'WFTM' ? 'FTM' : tokens[1];
    return `/liquidity/${token0}/${token1}/${type}`;
  };

  const staked = Number(farmUserData.lpTokens) > 0;

  useEffect(() => {
    setDoTransition(isOpen);
  }, [isOpen]);

  useEffect(() => {
    setShouldTransition(isTransitioning);
  }, [isTransitioning]);

  return (
    <Accordion allowToggle>
      <StyledContainer
        staked={+staked}
        transition="0.2s ease-in-out"
        maxHeight={!isTransitioning || doTransition ? '100%' : '320px'}
      >
        {({ isExpanded }) => (
          <>
            <TokenList farm={farm} />

            <Skeleton isLoaded={!shouldTransition} fadeDuration={0.2}>
              <YourApr
                value={compactifyValue(farmUserData.yourAprValue ?? aprValue!)}
                ecosystem={ecosystem}
                isBoosted={boosted}
                isMax={isMax}
                lpApr={lpApr}
                staked={staked}
              />
              <IconTooltipPanel staked={staked} items={infoPanelItems} />
              <AccordionPanel p={0}>
                <RetrieveTokens
                  key="retrieveToken2"
                  highlight={true}
                  value={checkSmallValue(+farmUserData.lpTokens)}
                  moneyValue={farmUserData.lpTokensMoney}
                  title={t(`${translationPath}.stakedLPTokens`)}
                  style={{ marginTop: '0.5rem' }}
                  button={
                    <Button
                      variant="secondary"
                      onClick={handleWithdraw}
                      disabled={!staked}
                    >
                      {t(`${translationPath}.withdraw`)}
                    </Button>
                  }
                />
                <RetrieveTokens
                  key="retrieveToken1"
                  highlight={false}
                  value={`${farmUserData.spiritEarned}`}
                  moneyValue={farmUserData.spiritEarnedMoney}
                  title={t(`${translationPath}.spiritEarned`)}
                  preParsed
                  button={
                    <IconButton
                      size="small"
                      iconPos="right"
                      variant="inverted"
                      label={t(`${translationPath}.claimRewards`)}
                      icon={isLoading ? <Spinner /> : <SparklesIcon />}
                      disabled={!farmReward}
                      onClick={handleClaim}
                    />
                  }
                />
                {boosted && (
                  <BoostFactor
                    key="boostfactor"
                    currentBoost={farmUserData.currentBoost || '0'}
                    holdAmountForMaxBoost={
                      farmUserData.spiritNeededForMax || '0'
                    }
                    lpTokens={farmUserData.lpTokens}
                  />
                )}
              </AccordionPanel>
              <AccordionButton
                justifyContent={'center'}
                _hover={{ bgColor: 'grayBorderToggle' }}
              >
                <Text mr={2}>
                  {isExpanded
                    ? t(`${translationPath}.hide`)
                    : t(`${translationPath}.show`)}
                </Text>
                <AccordionIcon color="gray" _hover={{ color: 'ci' }} />
              </AccordionButton>

              <SimpleGrid spacing="8px" columns={2}>
                <Button variant="secondary" onClick={() => navigate(getUrl())}>
                  {t(`${translationPath}.addLiquidity`)}
                </Button>

                <Button variant="inverted" onClick={handleDeposit}>
                  {t(`${translationPath}.deposit`)}
                </Button>
              </SimpleGrid>
            </Skeleton>
          </>
        )}
      </StyledContainer>
    </Accordion>
  );
};
