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

export default function PositionListItem({
  positionDetails,
  options,
  handleConcentratedPositionTotalValue,
}: Props) {
  const [usdRewards, setUsdRewards] = useState<number>(0);

  const farmingStakes = useAppSelector(selectConcentratedLiquidityWallet);

  const { usdAmount, outOfRange, token0, token1 } =
    usePositionData(positionDetails);

  const isOnFarmingCenter = positionDetails.onFarmingCenter;

  useEffect(() => {
    if (!farmingStakes || !positionDetails.onFarmingCenter) return;

    const farming = farmingStakes.find(
      farming => farming.id === positionDetails.tokenId,
    );

    if (!farming) return;

    Promise.all([
      getTokenUsdPrice(farming.rewardToken),
      getTokenUsdPrice(farming.bonusRewardToken),
    ]).then(results => {
      if (results) {
        const earned = farming.eternalEarned;
        const bonusEarned = farming.eternalBonusEarned;

        const sum =
          Number(earned) * results[0] + Number(bonusEarned) * results[1];

        setUsdRewards(sum);
      }
    });
  }, [farmingStakes, positionDetails]);

  const tokenSymbols = useMemo(() => {
    if (!token0 || !token1) return [undefined, undefined];

    return [token0.symbol, token1.symbol];
  }, [token0, token1]);

  const isUSDAmountLoaded =
    usdAmount !== undefined &&
    (isOnFarmingCenter ? usdRewards !== undefined : true);

  useEffect(() => {
    handleConcentratedPositionTotalValue((usdRewards || 0) + (usdAmount || 0));
  }, [usdRewards, usdAmount]);

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
            <ConcentratedRangeBadge inRange={!outOfRange} />
            <Text>{`Position #${positionDetails.tokenId}`}</Text>
          </HStack>
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
              {`${truncateTokenValue(usdAmount)}${
                isOnFarmingCenter ? ` + $${usdRewards} farming rewards` : ''
              }`}
            </Text>
          </Skeleton>
        </Flex>
        <NewDropdown
          items={options}
          address={positionDetails.eternalAvailable ?? '0x0000000'}
        />
      </Flex>
    </StyledContainer>
  );
}
