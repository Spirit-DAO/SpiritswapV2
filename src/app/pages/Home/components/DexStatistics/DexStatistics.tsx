import { Box, Flex, Skeleton, Text } from '@chakra-ui/react';
import { convertTokenPrice } from 'app/utils';
import { ReactChild, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { selectTVL } from 'store/general/selectors';
import { useAppSelector } from 'store/hooks';
import { client, clientV2 } from 'utils/apollo/client';
import {
  GET_TOTAL_VOLUME,
  GET_TOTAL_VOLUMEV2,
} from 'utils/apollo/queries/getTotalVolume';
import useMobile from 'utils/isMobile';
import { Wrapper, StyledBottom, StyledInfoTab } from './style';

const DexStatistics = () => {
  const { t } = useTranslation();
  const [totalVolumen, setTotalVolume] = useState(0);
  const translationPath = 'home.dexStatistics';
  const isMobile = useMobile('425px');
  const isDesktop = !useMobile('1024px');

  const TVL = useAppSelector(selectTVL);

  useEffect(() => {
    const init = async () => {
      try {
        const { data } = await client.query({
          query: GET_TOTAL_VOLUME,
          fetchPolicy: 'cache-first',
        });
        const { data: dataV2 } = await clientV2.query({
          query: GET_TOTAL_VOLUMEV2,
          fetchPolicy: 'cache-first',
        });

        if (
          data.spiritswapFactories[0] &&
          dataV2.uniswapFactory.totalVolumeUSD
        ) {
          const tvV1: number = Number(
            data.spiritswapFactories[0].totalVolumeUSD,
          );
          const tvV2: number = Number(
            data.spiritswapFactories[0].totalVolumeUSD,
          );
          const total = tvV1 + tvV2;
          setTotalVolume(total);
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  const totalInspiritRewards = (totalVolumen * 0.3) / 600;

  const loaderManager = (child: ReactChild, isLoaded: boolean) => (
    <Skeleton
      isLoaded={isLoaded}
      startColor="grayBorderBox"
      endColor="bgBoxLighter"
    >
      {child}
    </Skeleton>
  );

  const titles = (child: ReactChild) => (
    <Text fontSize={isMobile ? '36px' : '40px'} fontWeight="medium">
      {child}
    </Text>
  );

  const subTitles = (child: string) => (
    <Text fontSize="base" color="ci" textAlign="center">
      {child}
    </Text>
  );

  return (
    <Wrapper>
      <Flex
        gap="48px"
        justifyContent="center"
        alignItems="center"
        flexDirection={isDesktop ? 'row' : 'column'}
      >
        <Flex alignItems="center">
          <Text fontSize={isMobile ? '28px' : '36px'}>Trusted by&nbsp;</Text>
          <Box fontSize={isMobile ? '28px' : '36px'} mt="4px">
            <Text fontSize={isMobile ? '28px' : '36px'}>over 60k users</Text>
            <StyledBottom />
          </Box>
        </Flex>
        <StyledInfoTab>
          <Flex
            justifyContent="space-around"
            alignItems="center"
            gap="16px"
            py="16px"
            flexDirection={isMobile ? 'column' : 'row'}
          >
            {loaderManager(
              <Box alignContent="center" textAlign="center">
                {titles(convertTokenPrice(+totalVolumen, 1))}
                {subTitles(t(`${translationPath}.totalVolume`))}
              </Box>,
              !!totalVolumen,
            )}

            {loaderManager(
              <Box textAlign="center">
                {titles(convertTokenPrice(TVL, 1))}
                {subTitles(t(`${translationPath}.totalLiquidity`))}
              </Box>,

              !!TVL,
            )}

            {loaderManager(
              <Box textAlign="center">
                {titles(convertTokenPrice(totalInspiritRewards, 1))}
                {subTitles(t(`${translationPath}.totalinSpiritRewards`))}
              </Box>,
              !!totalVolumen,
            )}
          </Flex>
        </StyledInfoTab>
      </Flex>
    </Wrapper>
  );
};

export default DexStatistics;
