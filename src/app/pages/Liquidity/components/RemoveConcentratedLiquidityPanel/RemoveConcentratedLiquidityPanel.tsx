import {
  Box,
  Button,
  Flex,
  HStack,
  Input,
  Skeleton,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  Text,
} from '@chakra-ui/react';
import { CardHeader } from 'app/components/CardHeader';
import NewTokenAmountPanel from 'app/components/NewTokenAmountPanel/NewTokenAmountPanel';
import { Switch } from 'app/components/Switch';
import { TransactionStatus } from 'app/components/TransactionFlow';
import { removeLiquidityTF } from 'app/components/TransactionFlow/utils/helper';
import { Heading } from 'app/components/Typography';
import Web3Monitoring from 'app/connectors/EthersConnector/transactions';
import UseIsLoading from 'app/hooks/UseIsLoading';
import useSettings from 'app/hooks/useSettings';
import useWallets from 'app/hooks/useWallets';
import usePrevious from 'app/hooks/v3/usePrevious';
import { ARROWBACK } from 'constants/icons';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'app/hooks/Routing';
import {
  useBurnV3ActionHandlers,
  useBurnV3State,
  useDerivedV3BurnInfo,
} from 'store/v3/burn/hooks';
import { removeConcentratedLiquidity, transactionResponse } from 'utils/web3';
import { WETH9 } from '../../../../../v3-sdk';
import { HOME } from 'app/router/routes';

export default function RemoveConcentratedLiquidityPanel({
  position,
  onCancel,
}: {
  position: any;
  onCancel: () => void;
}) {
  const [sliderValue, setSliderValue] = useState(0);

  const { loadingOn, loadingOff, isLoading } = UseIsLoading();

  const { account } = useWallets();

  const { states } = useSettings();

  const { addToQueue } = Web3Monitoring();

  const navigate = useNavigate();

  const translationPath = 'liquidity.removeLiquidity';
  const translationPathCommon = 'liquidity.common';

  const { t } = useTranslation();

  const [receiveWFTM, setReceiveWFTM] = useState(false);

  const { percent } = useBurnV3State();

  const derivedInfo = useDerivedV3BurnInfo(position, receiveWFTM);

  const prevDerivedInfo = usePrevious({ ...derivedInfo });
  const {
    positionSDK,
    liquidityPercentage,
    liquidityValue0,
    liquidityValue1,
    feeValue0,
    feeValue1,
    outOfRange,
    error,
  } = useMemo(() => {
    if (
      (!derivedInfo.feeValue0 ||
        !derivedInfo.liquidityValue0 ||
        !derivedInfo.position) &&
      prevDerivedInfo
    ) {
      return {
        positionSDK: prevDerivedInfo.position,
        error: prevDerivedInfo.error,
        ...prevDerivedInfo,
      };
    }

    return {
      positionSDK: derivedInfo.position,
      error: derivedInfo.error,
      ...derivedInfo,
    };
  }, [derivedInfo]);

  const { onPercentSelect } = useBurnV3ActionHandlers();

  const removed = Number(position?.liquidity) === 0;

  const showCollectAsWFTM = Boolean(
    liquidityValue0?.currency &&
      liquidityValue1?.currency &&
      (liquidityValue0.currency.isNative ||
        liquidityValue1.currency.isNative ||
        liquidityValue0.currency.wrapped.equals(WETH9[250]) ||
        liquidityValue1.currency.wrapped.equals(WETH9[250])),
  );

  const labelStyles = {
    mt: '2',
    ml: '-2.5',
    fontSize: 'sm',
  };

  async function handleRemoveLiquidity() {
    if (
      feeValue0 === undefined ||
      feeValue1 === undefined ||
      !liquidityPercentage
    )
      return;

    try {
      loadingOn();

      const tx = await removeConcentratedLiquidity(
        positionSDK,
        position.tokenId,
        account,
        liquidityPercentage,
        feeValue0,
        feeValue1,
        states.slippage,
        states.deadline,
      );

      const response = transactionResponse('liquidity.remove', {
        operation: 'LIQUIDITY',
        tx: tx,
        update: 'liquidity',
        updateTarget: 'user',
        uniqueMessage: {
          text: `Removed ${percent}% of liquidity`,
          secondText: `Position #${position.tokenId}`,
        },
      });

      addToQueue(response);
      await tx.wait();
      loadingOff();
      onCancel();
    } catch (error) {
      console.error(error);
      loadingOff();
    }
  }

  function changeSliderValue(val) {
    setSliderValue(val);
    onPercentSelect(val);
  }

  return (
    <Box
      bgColor="bgBox"
      borderRadius="md"
      borderWidth="1px"
      maxW="504px"
      p="spacing06"
      w={{ base: '95%', lg: '100%' }}
      h={'fit-content'}
      mb="spacing06"
    >
      <CardHeader
        hidebackground
        title={t(`${translationPath}.title`)}
        id={ARROWBACK}
        onIconClick={() => {
          if (window.location.href.includes('/remove')) {
            navigate(HOME.path);
          } else {
            onCancel();
          }
        }}
        hideQuestionIcon
      />

      <Box my={4}>
        <Heading
          level={3}
        >{`Select percent of Position #${position.tokenId} to remove`}</Heading>
      </Box>

      <Box w="full" mb={12}>
        <NewTokenAmountPanel
          showPercentage
          context="liquidity"
          inputValue={`${String(sliderValue)}%`}
          showTokenSelection={false}
          showBalance={false}
          showInputInUSD={false}
          showConfirm
        />
      </Box>

      <Box w="full">
        <Slider
          aria-label="slider-ex-6"
          colorScheme="teal"
          onChange={val => changeSliderValue(val)}
          defaultValue={0}
        >
          <SliderMark
            value={0}
            {...labelStyles}
            ml={'1px'}
            onClick={() => changeSliderValue(0)}
          >
            0%
          </SliderMark>
          <SliderMark
            value={25}
            {...labelStyles}
            onClick={() => changeSliderValue(25)}
          >
            25%
          </SliderMark>
          <SliderMark
            value={50}
            {...labelStyles}
            onClick={() => changeSliderValue(50)}
          >
            50%
          </SliderMark>
          <SliderMark
            value={75}
            {...labelStyles}
            onClick={() => changeSliderValue(75)}
          >
            75%
          </SliderMark>
          <SliderMark
            value={100}
            {...labelStyles}
            ml={'-2rem'}
            onClick={() => changeSliderValue(100)}
          >
            100%
          </SliderMark>
          <SliderMark
            value={sliderValue}
            textAlign="center"
            bg="teal.600"
            color="white"
            mt="-10"
            ml="-5"
            w="12"
          >
            {sliderValue}%
          </SliderMark>
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
      </Box>

      <Box mt={8}>
        <Skeleton
          my={2}
          startColor="grayBorderBox"
          endColor="bgBoxLighter"
          isLoaded={Boolean(liquidityValue0)}
        >
          <Flex justifyContent="space-between">
            <Box>Pooled {liquidityValue0?.currency.symbol}</Box>
            <Box>{liquidityValue0?.toSignificant(4)}</Box>
          </Flex>
        </Skeleton>
        <Skeleton
          my={2}
          startColor="grayBorderBox"
          endColor="bgBoxLighter"
          isLoaded={Boolean(liquidityValue1)}
        >
          <Flex justifyContent="space-between">
            <Box>Pooled {liquidityValue1?.currency.symbol}</Box>
            <Box>{liquidityValue1?.toSignificant(4)}</Box>
          </Flex>
        </Skeleton>
      </Box>

      {showCollectAsWFTM && (
        <Flex justifyContent="space-between">
          <Text mr={4}>Recieve WFTM</Text>
          <Switch
            checked={receiveWFTM}
            onChange={() => setReceiveWFTM(!receiveWFTM)}
          ></Switch>
        </Flex>
      )}

      <HStack spacing={1} mt={4}>
        <Button variant="secondary" w="full" onClick={onCancel}>
          {t(`${translationPathCommon}.cancel`)}
        </Button>
        <Button
          w="full"
          isLoading={isLoading}
          loadingText={'Removing'}
          onClick={handleRemoveLiquidity}
          disabled={percent === 0 || !liquidityValue0}
        >
          {t(`${translationPathCommon}.confirm`)}
        </Button>
      </HStack>
    </Box>
  );
}
