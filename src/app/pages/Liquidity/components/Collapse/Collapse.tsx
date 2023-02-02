import { Props } from './Collapse.d';
import { useTranslation } from 'react-i18next';
import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  Box,
  Flex,
  Heading,
  AccordionPanel,
  Button,
  HStack,
  Spacer,
  Text,
  Skeleton,
} from '@chakra-ui/react';
import ImageLogo from 'app/components/ImageLogo';
import getDetailData, { LiquidityDetailProps } from '../../utils/getDetailData';
import useMobile from 'utils/isMobile';
import { truncateTokenValue } from 'app/utils';
import getSobDetailData from '../../utils/getSobDetailData';
import { useNavigate } from 'app/hooks/Routing';
import { weightedpools } from 'constants/weightedpools';
import { stableSobPools } from 'constants/sobpools';
import { useTokenBalance } from 'app/hooks/useTokenBalance';
import { CHAIN_ID } from 'constants/index';
import { useEffect, useState } from 'react';
import { getPooledData } from 'utils/web3/actions/liquidity';
import useGetTokensPrices from 'app/hooks/useGetTokensPrices';
import { useSelector } from 'react-redux';
import { selectLpPrices } from 'store/general/selectors';
import { FARMS } from 'app/router/routes';

const CollapseItem = ({
  pair,
  setLPToken,
  handleChangeToken,
  hideRemoveLiquidity,
}: Props) => {
  const { t } = useTranslation();
  const translationPath = 'liquidity.common';
  const navigate = useNavigate();
  const [poolData, setPooldata] = useState({});
  const isMobile = useMobile();
  const { tokensPrices } = useGetTokensPrices({
    tokenAddresses: [pair.address],
  });

  const lpPrices = useSelector(selectLpPrices);

  const { token: tokenWithBalance } = useTokenBalance(
    CHAIN_ID,
    pair.address,
    'liquidity',
    {
      ...pair,
      chainId: CHAIN_ID,
      decimals: 18,
    },
  );

  let rate = Object.values(tokensPrices || {})[0]?.rate;

  if (!rate) {
    rate = lpPrices[pair.address];
  }

  const amount = +tokenWithBalance?.amount ?? pair?.amount;
  const usd = rate * amount || 0;

  useEffect(() => {
    const getPoolData = async () => {
      const pooldata = await getPooledData(pair.address, pair.amount);

      if (pooldata) {
        setPooldata(pooldata);
      }
    };
    getPoolData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pair.address]);

  let detailData;
  if (!pair.tokensAmounts) {
    detailData = getDetailData(pair, poolData);
  } else {
    detailData = getSobDetailData(pair);
  }

  const tokens = pair.token0 && pair.token1 ? [pair.token0, pair.token1] : [];

  const onAddLiquidity = () => {
    hideRemoveLiquidity();
    if (tokens.length) {
      tokens?.map((token, i) => handleChangeToken(token, i));
    } else {
      const weightedAndStablePools = [...weightedpools, ...stableSobPools];
      const [match] = weightedAndStablePools.filter(
        pool =>
          pool.address?.toLocaleLowerCase() ===
          pair.address?.toLocaleLowerCase(),
      );

      if (match) {
        handleChangeToken(match, -1, () => null, match.type); // -1 means stable or weighted
      }
    }
  };

  const handleNavigateFarm = () => {
    navigate(`${FARMS.path}/${pair.address}`);
  };

  const symbolsList = pair?.tokens?.map((symbol, i) => {
    return { symbol, ID: i };
  });

  const removeLiquidityText = isMobile
    ? t(`${translationPath}.removeLiquidityMobile`)
    : t(`${translationPath}.removeLiquidity`);

  if (amount === 0) {
    return null;
  }

  return (
    <AccordionItem>
      <AccordionButton>
        <Box flex={1} textAlign="left">
          <Flex>
            {symbolsList?.map(token => (
              <ImageLogo symbol={token.symbol} size="35px" key={token.ID} />
            ))}
          </Flex>

          <Flex key="f2" mt="spacing02" alignItems="flex-end">
            <Heading size="base" mr="5px">
              {amount < 0.01 && amount > 0
                ? '<0.01'
                : truncateTokenValue(
                    +tokenWithBalance?.amount ?? pair?.amount,
                    usd,
                  )}
            </Heading>
            <Text fontSize="xs" color="grayDarker">
              {pair?.title || ''}
            </Text>
          </Flex>
          <Text fontSize="sm" color="grayDarker">
            {usd > 0 && usd < 0.01 ? '<$0.01' : `≈ $${(usd || 0).toFixed(2)}`}
          </Text>
        </Box>

        <AccordionIcon />
      </AccordionButton>

      <AccordionPanel
        py="spacing03"
        px={isMobile ? 'spacing03' : 'spacing05'}
        bgColor="bgBoxDarker"
      >
        {detailData?.map((item: LiquidityDetailProps) => {
          return (
            <Skeleton
              startColor="grayBorderBox"
              endColor="bgBoxLighter"
              isLoaded={detailData.length > 1}
            >
              <Flex
                px={isMobile ? 'spacing03' : 'spacing05'}
                fontSize="h5"
                color="gray"
                key={`${pair.address}-item`}
              >
                {item.detailTitle}
                <Spacer />
                {item.detailValue}
              </Flex>
            </Skeleton>
          );
        })}
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
            onClick={() => setLPToken(pair)}
          >
            {removeLiquidityText}
          </Button>
          <Button
            variant="secondary"
            onClick={onAddLiquidity}
            w="full"
            size="sm"
          >
            {t(`${translationPath}.addLiquidity`)}
          </Button>
          <Button
            variant="inverted"
            w="full"
            size="sm"
            onClick={handleNavigateFarm}
          >
            {t(`${translationPath}.farm`)}
          </Button>
        </HStack>
      </AccordionPanel>
    </AccordionItem>
  );
};

export default CollapseItem;
