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
import { useContext, useMemo } from 'react';
import { Props } from './ConcentratedCollapse.d';
import useMobile from 'utils/isMobile';
import { useTranslation } from 'react-i18next';
import ConcentratedRangeBadge from '../ConcentratedRangeBadge/ConcentratedRangeBadge';
import { ConcentratedFarmingBadge } from '../ConcentratedFarmingBadge';
import { useToken } from 'app/hooks/useToken';
import { CHAIN_ID } from 'constants/index';
import { LiquidityDetailProps } from '../../utils/getDetailData';
import { tickToPrice } from '../../../../../v3-sdk';
import { FARMS } from 'app/router/routes';
import { useNavigate } from 'app/hooks/Routing';
import UseIsLoading from 'app/hooks/UseIsLoading';
import {
  collectConcentratedLiquidityFees,
  transactionResponse,
} from 'utils/web3';
import useWallets from 'app/hooks/useWallets';
import Web3Monitoring from 'app/connectors/EthersConnector/transactions';
import { Bound } from 'store/v3/mint/actions';
import { DataContext } from 'contexts/DataContext';
import { getCircularReplacer } from 'app/utils';
import { connect } from 'utils/web3';

const ConcentratedCollapseItem = ({
  position,
  setLPToken,
  showClosed,
}: Props) => {
  const isMobile = useMobile();

  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isLoading, loadingOn, loadingOff } = UseIsLoading();
  const { account } = useWallets();
  const { addToQueue } = Web3Monitoring();

  const { userDataWorker } = useContext(DataContext);

  const translationPath = 'liquidity.common';

  const {
    usdAmount,
    feesAmount,
    amount0String,
    amount1String,
    token0,
    token1,
    outOfRange,
    pool,
    feeValue0,
    feeValue1,
    tickAtLimit,
    isRemoved,
    isFullRange,
  } = usePositionData(position);

  const lowerPrice =
    token0 && token1
      ? tickToPrice(token0.wrapped, token1.wrapped, position.tickLower)
      : 0;
  const upperPrice =
    token0 && token1
      ? tickToPrice(token0.wrapped, token1.wrapped, position.tickUpper)
      : 0;

  const positionHealth = useMemo(() => {
    if (!position || !pool) return undefined;

    const halfRange = Math.round((position.tickUpper - position.tickLower) / 2);

    const midRange = position.tickLower + halfRange;

    if (pool.tickCurrent === midRange) return 100;

    if (pool.tickCurrent < midRange)
      return (
        (100 * (pool.tickCurrent - position.tickLower)) /
        (midRange - position.tickLower)
      ).toFixed(2);

    if (pool.tickCurrent > midRange)
      return (
        (100 * (position.tickUpper - pool.tickCurrent)) /
        (position.tickUpper - midRange)
      ).toFixed(2);
  }, [position, pool]);

  const priceRange = useMemo(() => {
    if (!lowerPrice || !upperPrice) return '-';

    return `${tickAtLimit[Bound.LOWER] ? '0' : lowerPrice.toSignificant(4)} — ${
      tickAtLimit[Bound.UPPER] ? '∞' : upperPrice.toSignificant(4)
    }`;
  }, [lowerPrice, upperPrice]);

  const tokenList = useMemo(() => {
    if (!token0 || !token1) return [undefined, undefined];

    return [token0, token1];
  }, [token0, token1]);

  const removeLiquidityText = isMobile
    ? t(`${translationPath}.removeLiquidityMobile`)
    : t(`${translationPath}.removeLiquidity`);

  const claimFeesText = t(`${translationPath}.claimFees`);

  const isOnFarmingCenter = position.onFarmingCenter;

  const isFeesToCollect =
    feeValue0?.greaterThan(0) || feeValue1?.greaterThan(0);

  async function handleCollectFees() {
    if (feeValue0 === undefined || feeValue1 === undefined) return;

    try {
      loadingOn();

      const tx = await collectConcentratedLiquidityFees(
        position.tokenId,
        account,
        feeValue0,
        feeValue1,
        isOnFarmingCenter,
      );

      const response = transactionResponse('liquidity.collect', {
        operation: 'LIQUIDITY',
        tx: tx,
        update: 'liquidity',
        updateTarget: 'user',
        uniqueMessage: {
          text: `Collected ${
            (feesAmount || 0) < 0.01 ? '< $0.01' : `$${feesAmount}`
          } fees`,
          secondText: `Position #${position.tokenId}`,
        },
      });

      addToQueue(response);

      await tx.wait();

      const { provider } = await connect({});

      userDataWorker.postMessage({
        userAddress: account,
        type: 'getV3Liquidity',
        provider: JSON.stringify(provider, getCircularReplacer()),
      });

      loadingOff();
    } catch (error) {
      console.error(error);
      loadingOff();
    }
  }

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
      {
        detailTitle: `Earned fees`,
        detailValue: (feesAmount || 0) < 0.01 ? '< $0.01' : `$${feesAmount}`,
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

  return !isRemoved || (isRemoved && showClosed) ? (
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
              <ConcentratedRangeBadge
                inRange={!outOfRange}
                isRemoved={isRemoved}
                isFullRange={isFullRange}
              />
              {!outOfRange && !isRemoved && !isFullRange && (
                <Skeleton
                  startColor="grayBorderBox"
                  endColor="bgBoxLighter"
                  w="70px"
                  h="20px"
                  isLoaded={Boolean(positionHealth)}
                  ml={1.5}
                >
                  <Text
                    size="sm"
                    fontSize={'14px'}
                  >{`( ${positionHealth}% )`}</Text>
                </Skeleton>
              )}
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
          {!isRemoved ? (
            <Skeleton
              startColor="grayBorderBox"
              endColor="bgBoxLighter"
              w={usdAmount !== undefined ? 'unset' : '150px'}
              h="21px"
              isLoaded={usdAmount !== undefined}
            >
              <Text fontSize="sm" color="grayDarker">
                {usdAmount && usdAmount > 0 && usdAmount < 0.01
                  ? '<$0.01'
                  : `≈ $${(usdAmount || 0).toFixed(2)}`}
              </Text>
            </Skeleton>
          ) : null}
        </Box>

        {!isRemoved ? <AccordionIcon /> : null}
      </AccordionButton>

      {!isRemoved ? (
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
            h={'100px'}
            isLoaded={detailData.length > 1}
          >
            {detailData?.map((item: any, index) => {
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
            <Button
              variant="secondary"
              w="full"
              size="sm"
              onClick={handleCollectFees}
              disabled={!isFeesToCollect}
            >
              {claimFeesText}
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
      ) : null}
    </AccordionItem>
  ) : null;
};

export default ConcentratedCollapseItem;
