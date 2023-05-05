import { useEffect, useMemo, useState } from 'react';
import { Props } from './ListConcentratedLiquidityItem.d';
import { getTokenUsdPrice } from 'utils/data';
import { StyledContainer } from '../ListItem/styles';
import { Flex, HStack, Skeleton, Text } from '@chakra-ui/react';
import ImageLogo from 'app/components/ImageLogo';
import { truncateTokenValue } from 'app/utils';
import { selectConcentratedLiquidityWallet } from 'store/user/selectors';
import { usePositionData } from 'app/hooks/v3/usePositionData';
import { ConcentratedRangeBadge } from 'app/pages/Liquidity/components/ConcentratedRangeBadge';
import { NewDropdown } from 'app/components/Menu';
import { useAppSelector } from 'store/hooks';
import { useEternalFarmingRewards } from 'app/hooks/v3/useEternalFarmingsRewards';

export default function PositionListItem({
  positionDetails,
  options,
  handleConcentratedPositionTotalValue,
}: Props) {
  const { farmRewardsByPositions } = useEternalFarmingRewards();

  const {
    usdAmount,
    feesAmount,
    outOfRange,
    token0,
    token1,
    feeValue0,
    feeValue1,
    isRemoved,
  } = usePositionData(positionDetails);

  const isOnFarmingCenter = positionDetails.onFarmingCenter;

  const isOnFarmingCenterAndNotDeposited =
    isOnFarmingCenter && !positionDetails.eternalFarming;

  const positionRewardsUSD = useMemo(() => {
    const position = farmRewardsByPositions.find(
      farmReward => farmReward.positionId === positionDetails.tokenId,
    );

    if (!position) return 0;

    return position.amount + (feesAmount || 0);
  }, [farmRewardsByPositions]);

  const tokenSymbols = useMemo(() => {
    if (!token0 || !token1) return [undefined, undefined];

    return [token0.symbol, token1.symbol];
  }, [token0, token1]);

  const isUSDAmountLoaded =
    usdAmount !== undefined &&
    (isOnFarmingCenter ? positionRewardsUSD !== undefined : true);

  useEffect(() => {
    handleConcentratedPositionTotalValue({
      tokenId: positionDetails.tokenId,
      value: (positionRewardsUSD || 0) + (usdAmount || 0) + (feesAmount || 0),
    });
  }, [positionRewardsUSD, usdAmount]);

  return (
    <StyledContainer data-testid="ListItem">
      <Flex align="center">
        <Flex>
          {tokenSymbols.map((symbol, index) => (
            <Skeleton
              key={`concentrated-liquidity-token-${index}`}
              startColor="grayBorderBox"
              endColor="bgBoxLighter"
              w="32px"
              h="32px"
              borderRadius="50%"
              ml={index === 1 && !symbol ? '-11px' : '0'}
              isLoaded={Boolean(symbol)}
            >
              <ImageLogo
                size="32px"
                nextPair={index > 0 ?? false}
                symbol={symbol}
                key={`token-icon-${symbol}`}
              />
            </Skeleton>
          ))}
        </Flex>
        <Skeleton
          isLoaded={tokenSymbols.every(Boolean)}
          startColor="grayBorderBox"
          endColor="bgBoxLighter"
          h="24px"
          w="120px"
        >
          <Text fontWeight="medium">{tokenSymbols.join('/')}</Text>
        </Skeleton>
      </Flex>
      <Flex align="center">
        <Flex direction="column" align="flex-end">
          <HStack>
            <ConcentratedRangeBadge
              inRange={!outOfRange}
              isRemoved={isRemoved}
            />
            <Text>{`Position #${positionDetails.tokenId}`}</Text>
          </HStack>
          {isOnFarmingCenterAndNotDeposited ? (
            <Text fontSize="sm" color="warning">
              Position is not deposited
            </Text>
          ) : (
            <Skeleton
              isLoaded={isUSDAmountLoaded}
              startColor="grayBorderBox"
              endColor="bgBoxLighter"
              h="18px"
              w={
                !isUSDAmountLoaded
                  ? isOnFarmingCenter
                    ? '150px'
                    : '40px'
                  : 'unset'
              }
            >
              <Text fontSize="sm" color="grayDarker">
                $
                {`${truncateTokenValue(usdAmount, usdAmount)}${
                  isOnFarmingCenter
                    ? ` + $${truncateTokenValue(
                        positionRewardsUSD,
                        positionRewardsUSD,
                      )} rewards`
                    : ''
                }`}
              </Text>
            </Skeleton>
          )}
        </Flex>
        <NewDropdown
          items={options}
          address={positionDetails.eternalAvailable ?? '0x0000000'}
        />
      </Flex>
    </StyledContainer>
  );
}
