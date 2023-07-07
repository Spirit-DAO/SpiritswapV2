import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { EcosystemFarmType, IConcentratedFarm } from 'app/interfaces/Farm';
import { IconTooltipPanel } from '../components/IconTooltipPanel';
import { YourApr } from '../components/YourApr';
import { IconButton } from 'app/components/IconButton';
import { StyledContainer } from './styles';
import { ReactComponent as SparklesIcon } from 'app/assets/images/sparkles.svg';
import { BoostFactor } from '../components/BoostFactor';
import Web3Monitoring from 'app/connectors/EthersConnector/transactions';
import { transactionResponse } from 'utils/web3/actions/utils';
import { checkAddress, formatNumber, getRoundedSFs } from 'app/utils';
import { SuggestionsTypes } from 'app/hooks/Suggestions/Suggestion';
import { useNavigate } from 'app/hooks/Routing';
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
  Flex,
} from '@chakra-ui/react';
import { RetrieveTokens } from '../components/RetrieveTokens/RetrieveTokens';
import {
  selectFarmRewards,
  selectFarmsStaked,
  selectInspiritUserBalance,
} from 'store/user/selectors';
import { useAppSelector } from 'store/hooks';
import {
  selectFtmInfo,
  selectSpiritInfo,
  selectTotalSpiritSupply,
} from 'store/general/selectors';
import { calculateBoost } from '../helpers/calculateBoost';
import BigNumber from 'bignumber.js';
import { formatUnits } from 'ethers/lib/utils';
import { Props } from './Farm.d';
import useGetTokensPrices from 'app/hooks/useGetTokensPrices';
import { LIQUIDITY, resolveRoutePath } from 'app/router/routes';
import { RetrieveConcentratedPosition } from '../components/RetrieveConcentratedPosition/RetrieveConcentratedPosition';

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
    concentrated,
    label,
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
  const { price: ftmPrice } = useAppSelector(selectFtmInfo);
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

  if (!ecosystem && aprRange && !farm.concentrated) {
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

  if (ecosystem && !farm.concentrated) {
    infoPanelItems.push({
      label: t(`farms.iconTooltipPanel.status`),
      value: t(
        `farms.iconTooltipPanel.${
          ecosystem === EcosystemFarmType.VERIFIED ? 'verified' : 'unverified'
        }`,
      ),
    });
  }

  if (!!totalLiquidity || (totalLiquidity === 0 && !farm.concentrated)) {
    infoPanelItems.push({
      label: t(`farms.iconTooltipPanel.totalLiquidity`),
      value:
        '$' +
        totalLiquidity.toLocaleString('en-us', { maximumFractionDigits: 0 }),
    });
  }

  const multiplierValue = parseFloat(multiplier || '0');

  if (!ecosystem && !!multiplier && !farm.concentrated) {
    infoPanelItems.push({
      label: t(`farms.iconTooltipPanel.votingWeight`),
      value:
        multiplierValue > 0 && multiplierValue < 0.01
          ? '<0.01%'
          : `${multiplierValue.toFixed(2)}%`,
      tooltip: 'votingWeight',
    });
  }

  if (!farm.concentrated) {
    infoPanelItems.push({
      label: t(`${translationPath}.stakedLPTokens`),
      value: checkSmallValue(+farmUserData.lpTokens),
    });

    infoPanelItems.push({
      label: t(`${translationPath}.stakedLPTokensMoney`),
      value: `$${farmUserData.lpTokensMoney}`,
    });
  }

  if (ecosystem && rewardToken && !farm.concentrated) {
    infoPanelItems.push({
      label: t(`farms.ecosystem.rewardToken`),
      value: rewardToken,
    });
  }

  const concentratedStakedPositions = useMemo(() => {
    const _farm = farm as IConcentratedFarm;

    if (!_farm || !_farm.wallet) return [];

    return _farm.wallet.filter(
      stake => stake.eternalFarming && stake.eternalFarming.id === _farm.id,
    );
  }, [farm]);

  const [concentratedEarned, concentratedBonusEarned] = useMemo(() => {
    if (!concentratedStakedPositions.length) return [0, 0];

    const earned = concentratedStakedPositions.reduce(
      (acc, stake) => Number(stake.eternalFarming?.earned) + acc,
      0,
    );
    const bonusEarned = concentratedStakedPositions.reduce(
      (acc, stake) => Number(stake.eternalFarming?.bonusEarned) + acc,
      0,
    );

    return [earned, bonusEarned];
  }, [concentratedStakedPositions]);

  const [claimTitle, claimValue, claimMoney] = useMemo(() => {
    if (!farm.concentrated) {
      return [
        t(`${translationPath}.spiritEarned`),
        farmUserData.spiritEarned,
        farm.spiritEarnedMoney,
      ];
    }

    const _farm = farm as IConcentratedFarm;

    if (_farm.rewardToken.id === _farm.bonusRewardToken.id) {
      return [
        ' ',
        `${Number(concentratedEarned) + Number(concentratedBonusEarned)} ${
          _farm.rewardToken.symbol
        }`,
        ' ',
      ];
    } else {
      let earnedRewards: string[] = [' ', ' ', ' '];

      if (concentratedEarned) {
        earnedRewards[0] = `${Number(concentratedEarned)} ${
          _farm.rewardToken.symbol
        }`;
      }

      if (concentratedBonusEarned) {
        earnedRewards[1] = `${Number(concentratedBonusEarned)} ${
          _farm.bonusRewardToken.symbol
        }`;
      }

      return earnedRewards;
    }
  }, [concentratedEarned, concentratedBonusEarned]);

  const hasConcenctratedRewards = concentratedEarned || concentratedBonusEarned;

  if (farm.concentrated) {
    const _farm = farm as IConcentratedFarm;

    const reward = formatUnits(
      _farm.reward,
      Number(_farm.rewardToken.decimals),
    );
    const bonusReward = formatUnits(
      _farm.bonusReward,
      Number(_farm.bonusRewardToken.decimals),
    );

    if (+reward) {
      infoPanelItems.push({
        label: `${_farm.rewardToken.symbol} Reward Pool`,
        value: compactifyValue(reward),
      });
    }

    if (+bonusReward) {
      infoPanelItems.push({
        label: `${_farm.bonusRewardToken.symbol} Bonus Reward Pool`,
        value: compactifyValue(bonusReward),
      });
    }

    infoPanelItems.push({
      label: 'Total Liquidity',
      value: `$${(_farm.tvl * ftmPrice).toFixed(3)}`,
    });

    infoPanelItems.push({
      label: 'Total Reward Value',
      value: `$${_farm.rewardsUSDValue.toFixed(3)}`,
    });

    infoPanelItems.push({
      label: 'Staked LP Positions',
      value: concentratedStakedPositions.length,
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
  const handleConcentratedInput = (positionId: string) => {
    onWithdraw(positionId);
  };
  const handleClaim = async () => {
    setIsLoading(true);
    try {
      let tx,
        text,
        secondText = '';

      if (farm.concentrated) {
        const _farm = farm as IConcentratedFarm;

        const positionsToClaim = _farm.wallet?.filter(
          (position: any) => position?.eternalFarming?.id === _farm.id,
        );

        const earned = positionsToClaim?.reduce(
          (acc, stake: any) => Number(stake.eternalFarming.earned) + acc,
          0,
        );
        const bonusEarned = positionsToClaim?.reduce(
          (acc, stake: any) => Number(stake.eternalFarming.bonusEarned) + acc,
          0,
        );

        const isSameToken = _farm.rewardToken.id === _farm.bonusRewardToken.id;

        if (isSameToken) {
          text = `${formatNumber({
            value: Number(earned) + Number(bonusEarned),
            maxDecimals: 2,
          })} ${_farm.rewardToken.symbol}`;
        } else
          text = `${formatNumber({ value: Number(earned), maxDecimals: 2 })} ${
            _farm.rewardToken.symbol
          }${
            bonusEarned
              ? ` + ${Number(bonusEarned)} ${_farm.bonusRewardToken.symbol}`
              : ''
          }`;

        tx = await onClaim(positionsToClaim);
      } else {
        tx = await onClaim();
        text = getRoundedSFs(farmUserData.spiritEarned?.toString() || '');
        secondText = 'SPIRIT';
      }

      const response = transactionResponse('farm.claim', {
        tx: tx,
        uniqueMessage: {
          text,
          secondText,
        },
        update: 'portfolio',
        updateTarget: 'user',
      });

      const suggestionData = {
        type: SuggestionsTypes.FARMS,
        id: response.tx.hash,
        data: {
          harvestSpirit: !farm.concentrated,
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
    return `${LIQUIDITY.path}/${token0}/${token1}/${type || 'concentrated'}`;
  };

  const staked = farm.concentrated
    ? concentratedStakedPositions.length > 0
    : Number(farmUserData.lpTokens) > 0;

  const disableConcentratedFarm =
    farm.concentrated &&
    Number(farm.rewardRate) === 0 &&
    Number(farm.bonusRewardRate) === 0;

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
                isExpanded={isExpanded}
                farmUserData={farmUserData}
                lpApr={lpApr}
                staked={staked}
                concentrated={farm.concentrated}
              />

              <IconTooltipPanel staked={staked} items={infoPanelItems} />
              <AccordionPanel p={0}>
                {concentrated ? (
                  concentratedStakedPositions.map(position => (
                    <RetrieveConcentratedPosition
                      key={`retrieve-concentrated-${position.tokenId}`}
                      position={position}
                      highlight={true}
                      title={`Position #${position.tokenId}`}
                      style={{ marginTop: '0.5rem' }}
                      button={
                        <Button
                          variant="secondary"
                          onClick={() =>
                            handleConcentratedInput(String(position.tokenId))
                          }
                          disabled={false}
                        >
                          {t(`${translationPath}.withdraw`)}
                        </Button>
                      }
                    />
                  ))
                ) : (
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
                )}
                <RetrieveTokens
                  key="retrieveToken1"
                  highlight={false}
                  value={claimValue}
                  moneyValue={claimMoney}
                  title={claimTitle}
                  preParsed
                  isConcentrated={farm.concentrated}
                  button={
                    <IconButton
                      size="small"
                      iconPos="right"
                      variant="inverted"
                      label={t(`${translationPath}.claimRewards`)}
                      icon={isLoading ? <Spinner /> : <SparklesIcon />}
                      disabled={
                        farm.concentrated
                          ? !hasConcenctratedRewards
                          : !farmReward
                      }
                      onClick={handleClaim}
                    />
                  }
                />
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

                <Button
                  variant="inverted"
                  disabled={disableConcentratedFarm}
                  onClick={handleDeposit}
                >
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
