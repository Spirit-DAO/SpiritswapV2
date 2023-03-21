import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Skeleton,
  Spacer,
  Text,
} from '@chakra-ui/react';
import ImageLogo from 'app/components/ImageLogo';
import { usePositionData } from 'app/hooks/v3/usePositionData';
import { useMemo } from 'react';
import { Props } from './ConcentratedCollapse.d';
import useMobile from 'utils/isMobile';
import { useTranslation } from 'react-i18next';
import ConcentreatedRangeBadge from '../ConcentratedRangeBadge/ConcentratedRangeBadge';
import { ConcentratedFarmingBadge } from '../ConcentratedFarmingBadge';
import { useToken } from 'app/hooks/useToken';
import { CHAIN_ID } from 'constants/index';
import { LiquidityDetailProps } from '../../utils/getDetailData';
import { tickToPrice } from '../../../../../v3-sdk';
import { FARMS } from 'app/router/routes';
import { useNavigate } from 'app/hooks/Routing';

const ConcentratedCollapseItem = ({
  position,
  hideRemoveLiquidity,
  handleChangeToken,
  setLPToken,
}: Props) => {
  const isMobile = useMobile();

  const { t } = useTranslation();
  const navigate = useNavigate();

  const translationPath = 'liquidity.common';

  const {
    usdAmount,
    amount0String,
    amount1String,
    token0,
    token1,
    amount0,
    amount1,
    outOfRange,
    pool,
  } = usePositionData(position);

  const lowerPrice =
    token0 && token1
      ? tickToPrice(token0.wrapped, token1.wrapped, position.tickLower)
      : 0;
  const upperPrice =
    token0 && token1
      ? tickToPrice(token0.wrapped, token1.wrapped, position.tickUpper)
      : 0;

  const priceRange = useMemo(() => {
    if (!lowerPrice || !upperPrice) return '-';

    return `${lowerPrice.toSignificant(4)} — ${upperPrice.toSignificant(4)}`;
  }, [lowerPrice, upperPrice]);

  const tokenList = useMemo(() => {
    if (!token0 || !token1) return [undefined, undefined];

    return [token0, token1];
  }, [token0, token1]);

  const removeLiquidityText = isMobile
    ? t(`${translationPath}.removeLiquidityMobile`)
    : t(`${translationPath}.removeLiquidity`);

  const isOnFarmingCenter = position.onFarmingCenter;

  const handleNavigateFarm = () => {
    navigate(`${FARMS.path}/${position.eternalAvailable}`);
  };

  const detailData = useMemo(() => {
    if (!amount0String || !amount1String || !token0 || !token1 || !pool)
      return [];

    return [
      {
        detailTitle: `Pooled ${token0.symbol}`,
        detailValue: amount0String,
      },
      {
        detailTitle: `Pooled ${token1.symbol}`,
        detailValue: amount1String,
      },
      // {
      //   detailTitle: `Pool APR`,
      //   detailValue: '12%',
      // },
      {
        detailTitle: `Range`,
        detailValue: priceRange,
      },
      {
        detailTitle: `Pool Fee`,
        detailValue: `${pool.fee / 10000}%`,
      },
    ];
  }, [[amount0String, amount1String, token0, token1, pool, priceRange]]);

  return (
    <AccordionItem>
      <AccordionButton>
        <Box flex={1} textAlign="left">
          <Flex>
            {tokenList?.map((token, index) => (
              <Skeleton
                startColor="grayBorderBox"
                endColor="bgBoxLighter"
                w="35px"
                h="35px"
                borderRadius="50%"
                isLoaded={Boolean(token)}
                mr={!index ? '4px' : ''}
              >
                <ImageLogo
                  symbol={token?.symbol}
                  size="35px"
                  key={token?.address}
                />
              </Skeleton>
            ))}
            <Flex key="f2" ml="spacing04" alignItems="center">
              <ConcentreatedRangeBadge inRange={!outOfRange} />
              {isOnFarmingCenter && (
                <Box ml={4}>
                  <ConcentratedFarmingBadge />
                </Box>
              )}
            </Flex>
          </Flex>
          <Skeleton
            startColor="grayBorderBox"
            endColor="bgBoxLighter"
            w={Boolean(position.tokenId) ? 'unset' : '100px'}
            h="21px"
            isLoaded={Boolean(position.tokenId)}
          >
            <Heading
              size="base"
              mt="5px"
            >{`Position #${position.tokenId}`}</Heading>
          </Skeleton>
          <Skeleton
            startColor="grayBorderBox"
            endColor="bgBoxLighter"
            w={usdAmount !== undefined ? 'unset' : '150px'}
            h="21px"
            isLoaded={Boolean(usdAmount)}
          >
            <Text fontSize="sm" color="grayDarker">
              {usdAmount && usdAmount > 0 && usdAmount < 0.01
                ? '<$0.01'
                : `≈ $${(usdAmount || 0).toFixed(2)}`}
            </Text>
          </Skeleton>
        </Box>

        <AccordionIcon />
      </AccordionButton>

      <AccordionPanel
        py="spacing03"
        px={isMobile ? 'spacing03' : 'spacing05'}
        bgColor="bgBoxDarker"
      >
        <Skeleton
          key={position.tokenId}
          startColor="grayBorderBox"
          endColor="bgBoxLighter"
          w={'full'}
          h={'80px'}
          isLoaded={detailData.length > 1}
        >
          {detailData?.map((item: LiquidityDetailProps, index) => {
            return (
              <Flex
                px={isMobile ? 'spacing03' : 'spacing05'}
                fontSize="h5"
                color="gray"
                key={`position-${position.tokenId}-${index}-detail-item`}
              >
                {item.detailTitle}
                <Spacer />
                {item.detailValue}
              </Flex>
            );
          })}
        </Skeleton>
        <HStack
          spacing="spacing03"
          w="full"
          mt="spacing03"
          px={isMobile ? 'spacing03' : 'spacing05'}
        >
          <Button
            variant="secondary"
            w="full"
            size="sm"
            onClick={() => setLPToken(position)}
            disabled={isOnFarmingCenter}
          >
            {removeLiquidityText}
          </Button>
          {position.eternalAvailable && (
            <Button
              variant="inverted"
              w="full"
              size="sm"
              onClick={handleNavigateFarm}
            >
              {t(`${translationPath}.farm`)}
            </Button>
          )}
        </HStack>
      </AccordionPanel>
    </AccordionItem>
  );
};

export default ConcentratedCollapseItem;
